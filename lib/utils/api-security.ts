import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/safe-logger';

export const DEFAULT_MAX_API_BODY_BYTES = 512 * 1024;

const NO_STORE =
  'no-store, no-cache, must-revalidate, max-age=0, private' as const;

/**
 * Ensures JSON API responses are not cached by shared proxies or browsers.
 */
export function mergeNoStoreHeaders(response: NextResponse): NextResponse {
  if (!response.headers.has('Cache-Control')) {
    response.headers.set('Cache-Control', NO_STORE);
  }
  if (!response.headers.has('Pragma')) {
    response.headers.set('Pragma', 'no-cache');
  }
  return response;
}

function parseCommaSeparatedUrls(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  const out: string[] = [];
  for (const part of raw.split(',')) {
    const t = part.trim();
    if (!t) continue;
    try {
      const u = new URL(t.includes('://') ? t : `https://${t}`);
      out.push(u.origin);
    } catch {
      /* skip invalid */
    }
  }
  return out;
}

/**
 * App origin for this request plus optional `API_ALLOWED_ORIGINS` (staging, previews).
 */
export function getTrustedApiOrigins(request: NextRequest): Set<string> {
  const set = new Set<string>();
  set.add(request.nextUrl.origin);
  for (const o of parseCommaSeparatedUrls(process.env.API_ALLOWED_ORIGINS)) {
    set.add(o);
  }
  return set;
}

function getEmbedAllowedOrigins(): Set<string> {
  const set = new Set<string>();
  for (const o of parseCommaSeparatedUrls(process.env.API_EMBED_ALLOWED_ORIGINS)) {
    set.add(o);
  }
  return set;
}

function normalizeOriginHeader(origin: string | null): string | null {
  if (!origin || origin === 'null') return null;
  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
}

/**
 * CSRF mitigation: when strict, browser requests with `Origin` must match trusted or embed list.
 * Missing `Origin` allows server-to-server and some clients (no header).
 */
export function assertOriginAllowed(
  request: NextRequest,
  mode: 'none' | 'trusted' | 'embed'
): NextResponse | null {
  if (mode === 'none') return null;

  const originRaw = request.headers.get('origin');
  const origin = normalizeOriginHeader(originRaw);
  if (origin === null) return null;

  const path = request.nextUrl.pathname;

  if (mode === 'trusted') {
    if (process.env.API_STRICT_BROWSER_ORIGIN === 'false') return null;
    if (process.env.API_STRICT_BROWSER_ORIGIN !== 'true' && process.env.NODE_ENV !== 'production') {
      return null;
    }
    const trusted = getTrustedApiOrigins(request);
    if (trusted.has(origin)) return null;
    logger.warn('API origin rejected (trusted policy)', { path, origin });
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403, headers: { 'Cache-Control': NO_STORE } }
    );
  }

  if (mode === 'embed') {
    const embed = getEmbedAllowedOrigins();
    if (embed.size === 0) return null;
    const trusted = getTrustedApiOrigins(request);
    if (trusted.has(origin) || embed.has(origin)) return null;
    logger.warn('API origin rejected (embed policy)', { path, origin });
    return NextResponse.json(
      { error: 'Forbidden', code: 'ORIGIN_NOT_ALLOWED' },
      { status: 403, headers: { 'Cache-Control': NO_STORE } }
    );
  }

  return null;
}

export function getDefaultMaxApiBodyBytes(): number {
  const raw = process.env.API_MAX_BODY_BYTES;
  if (raw) {
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n) && n > 0) {
      return Math.min(n, 10 * 1024 * 1024);
    }
  }
  return DEFAULT_MAX_API_BODY_BYTES;
}

/**
 * Rejects the request if the body exceeds `maxBytes` (Content-Length hint or streamed read on a clone).
 * Does not consume the original request body — the handler can still call `request.json()`.
 */
export async function assertRequestBodyWithinLimit(
  request: NextRequest,
  maxBytes: number
): Promise<NextResponse | null> {
  const path = request.nextUrl.pathname;
  const len = request.headers.get('content-length');
  if (len) {
    const n = parseInt(len, 10);
    if (!Number.isNaN(n) && n > maxBytes) {
      logger.warn('API body rejected: Content-Length exceeds limit', {
        path,
        maxBytes,
      });
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413, headers: { 'Cache-Control': NO_STORE } }
      );
    }
    if (!Number.isNaN(n) && n >= 0 && n <= maxBytes) {
      return null;
    }
  }

  let clone: NextRequest;
  try {
    clone = request.clone();
  } catch {
    return null;
  }

  const body = clone.body;
  if (!body) return null;

  const reader = body.getReader();
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => {});
        logger.warn('API body rejected: stream exceeds limit', { path, maxBytes });
        return NextResponse.json(
          { error: 'Payload too large' },
          { status: 413, headers: { 'Cache-Control': NO_STORE } }
        );
      }
    }
  } catch (e) {
    logger.error('API body preflight read failed', e, { path });
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: { 'Cache-Control': NO_STORE } }
    );
  }

  return null;
}

export type WithApiSecurityOptions = {
  /** Max raw body bytes for preflight (default from env or 512 KiB). */
  maxBodyBytes?: number;
  /** If set, return 405 for any other method. */
  allowedMethods?: string[];
  /** Methods that run body size preflight (default POST, PUT, PATCH). */
  bodyLimitMethods?: string[];
  /**
   * Origin check for browser CSRF mitigation.
   * - `trusted`: production + `API_STRICT_BROWSER_ORIGIN=true` → `Origin` must be app or `API_ALLOWED_ORIGINS`.
   * - `embed`: when `API_EMBED_ALLOWED_ORIGINS` is non-empty → `Origin` must be trusted or in that list.
   */
  originCheck?: 'none' | 'trusted' | 'embed';
};

type ApiHandler = (request: NextRequest) => Promise<NextResponse>;

/**
 * Wraps a route handler with method checks, optional body size preflight, and structured request/response logging.
 */
export function withApiSecurity(handler: ApiHandler, options?: WithApiSecurityOptions): ApiHandler {
  const maxBodyBytes = options?.maxBodyBytes ?? getDefaultMaxApiBodyBytes();
  const bodyLimitMethods = options?.bodyLimitMethods ?? ['POST', 'PUT', 'PATCH'];
  const originCheck = options?.originCheck ?? 'none';

  return async (request: NextRequest) => {
    const path = request.nextUrl.pathname;
    const method = request.method;

    if (options?.allowedMethods?.length && !options.allowedMethods.includes(method)) {
      logger.warn('API method not allowed', { path, method });
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405, headers: { 'Cache-Control': NO_STORE } }
      );
    }

    const originReject = assertOriginAllowed(request, originCheck);
    if (originReject) return originReject;

    logger.apiRequest(method, path);

    if (bodyLimitMethods.includes(method)) {
      const reject = await assertRequestBodyWithinLimit(request, maxBodyBytes);
      if (reject) return reject;
    }

    const start = Date.now();
    try {
      const response = await handler(request);
      mergeNoStoreHeaders(response);
      logger.apiResponse(method, path, response.status, {
        durationMs: Date.now() - start,
      });
      return response;
    } catch (err) {
      logger.error(`API handler error ${method} ${path}`, err, {
        durationMs: Date.now() - start,
      });
      throw err;
    }
  };
}
