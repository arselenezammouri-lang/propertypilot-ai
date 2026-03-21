import type { NextRequest } from 'next/server';
import { checkEdgeRateLimit } from '@/lib/security/edge-rate-limit';
import { getEdgeClientIp } from '@/lib/security/request-ip';
import { evaluateBotGuard, parseBotGuardConfig } from '@/lib/security/bot-guard';
import {
  getEdgeApiRateLimitParams,
  isEdgeApiRateLimitEnabled,
} from '@/lib/security/edge-api-rate-params';

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

export type ApiGuardFailure =
  | { type: 'bot'; reason: 'empty_ua' | 'scanner_ua' }
  | { type: 'rate'; retryAfterSec: number };

/**
 * Returns null if the request may proceed, or a failure descriptor if it should be blocked.
 * Rate limit: when `useDistributedRateLimit` is true, skip in-memory check (caller runs Upstash first).
 */
export function evaluateApiGuard(
  request: NextRequest,
  options?: { skipMemoryRateLimit?: boolean }
): ApiGuardFailure | null {
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

  if (options?.skipMemoryRateLimit) {
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
