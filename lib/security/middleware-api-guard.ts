import type { NextRequest } from 'next/server';
import { checkEdgeRateLimit } from '@/lib/security/edge-rate-limit';
import { getEdgeClientIp } from '@/lib/security/request-ip';
import { evaluateBotGuard, parseBotGuardConfig } from '@/lib/security/bot-guard';

const SKIP_PREFIXES = [
  '/api/stripe/webhook',
  '/api/prospecting/call/webhook',
  '/api/health',
  '/api/auth/verify-turnstile',
] as const;

function shouldSkipApiGuard(pathname: string): boolean {
  for (const p of SKIP_PREFIXES) {
    if (pathname === p || pathname.startsWith(`${p}/`)) return true;
  }
  if (pathname.startsWith('/api/dev/') && process.env.NODE_ENV === 'development') {
    return true;
  }
  return false;
}

export function isEdgeApiRateLimitEnabled(): boolean {
  if (process.env.EDGE_API_RATE_LIMIT_ENABLED === 'false') return false;
  if (process.env.EDGE_API_RATE_LIMIT_ENABLED === 'true') return true;
  return process.env.NODE_ENV === 'production';
}

export function getEdgeApiRateLimitParams(): { max: number; windowMs: number } {
  const max = Math.max(10, Number(process.env.EDGE_API_RATE_LIMIT_MAX ?? 180) || 180);
  const windowMs = Math.max(
    5000,
    Number(process.env.EDGE_API_RATE_LIMIT_WINDOW_MS ?? 60_000) || 60_000
  );
  return { max, windowMs };
}

export type ApiGuardFailure =
  | { type: 'bot'; reason: 'empty_ua' | 'scanner_ua' }
  | { type: 'rate'; retryAfterSec: number };

/**
 * Returns null if the request may proceed, or a failure descriptor if it should be blocked.
 */
export function evaluateApiGuard(request: NextRequest): ApiGuardFailure | null {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith('/api/') || shouldSkipApiGuard(pathname)) {
    return null;
  }

  const bot = evaluateBotGuard(
    request.headers.get('user-agent'),
    parseBotGuardConfig(process.env)
  );
  if (!bot.allow) {
    return { type: 'bot', reason: bot.reason };
  }

  if (!isEdgeApiRateLimitEnabled()) {
    return null;
  }

  const { max, windowMs } = getEdgeApiRateLimitParams();
  const ip = getEdgeClientIp(request);
  const key = `api:${ip}`;
  const rl = checkEdgeRateLimit(key, max, windowMs);
  if (!rl.ok) {
    return { type: 'rate', retryAfterSec: rl.retryAfterSec };
  }

  return null;
}
