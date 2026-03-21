import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/safe-logger';

export const DEFAULT_MAX_API_BODY_BYTES = 512 * 1024;

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
        { status: 413, headers: { 'Cache-Control': 'no-store' } }
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
          { status: 413, headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }
  } catch (e) {
    logger.error('API body preflight read failed', e, { path });
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
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
};

type ApiHandler = (request: NextRequest) => Promise<NextResponse>;

/**
 * Wraps a route handler with method checks, optional body size preflight, and structured request/response logging.
 */
export function withApiSecurity(handler: ApiHandler, options?: WithApiSecurityOptions): ApiHandler {
  const maxBodyBytes = options?.maxBodyBytes ?? getDefaultMaxApiBodyBytes();
  const bodyLimitMethods = options?.bodyLimitMethods ?? ['POST', 'PUT', 'PATCH'];

  return async (request: NextRequest) => {
    const path = request.nextUrl.pathname;
    const method = request.method;

    if (options?.allowedMethods?.length && !options.allowedMethods.includes(method)) {
      logger.warn('API method not allowed', { path, method });
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    logger.apiRequest(method, path);

    if (bodyLimitMethods.includes(method)) {
      const reject = await assertRequestBodyWithinLimit(request, maxBodyBytes);
      if (reject) return reject;
    }

    const start = Date.now();
    try {
      const response = await handler(request);
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
