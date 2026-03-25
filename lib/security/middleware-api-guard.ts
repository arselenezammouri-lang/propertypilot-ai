import type { NextRequest } from 'next/server';
import { checkEdgeRateLimit } from '@/lib/security/edge-rate-limit';
import { getEdgeClientIp } from '@/lib/security/request-ip';
import { evaluateBotGuard, parseBotGuardConfig } from '@/lib/security/bot-guard';
import {
  getEdgeApiRateLimitParams,
  isEdgeApiRateLimitEnabled,
} from '@/lib/security/edge-api-rate-params';
import { getEdgeAiRateLimitParams } from '@/lib/security/edge-ai-rate-params';
import {
  getEdgeAiUserRateLimitParams,
  isEdgeAiUserRateLimitEnabled,
} from '@/lib/security/edge-ai-user-rate-params';
import { isAiCostlyApiPath } from '@/lib/security/ai-costly-api-path';

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
  | {
      type: 'rate';
      retryAfterSec: number;
      detail?: 'general' | 'ai' | 'ai_user';
    };

/**
 * Returns null if the request may proceed, or a failure descriptor if it should be blocked.
 * Rate limit: when `skipGeneralMemoryRateLimit` is true, skip general in-memory (caller ran Upstash).
 * When `skipAiMemoryRateLimit` is true, skip AI IP in-memory (caller ran Upstash AI).
 * When `skipAiUserMemoryRateLimit` is true, skip per-user AI in-memory (caller ran Upstash user AI).
 */
export function evaluateApiGuard(
  request: NextRequest,
  options?: {
    skipGeneralMemoryRateLimit?: boolean;
    skipAiMemoryRateLimit?: boolean;
    skipAiUserMemoryRateLimit?: boolean;
    /** Supabase user id when session exists; enables per-user AI bucket. */
    authenticatedUserId?: string | null;
  }
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

  const ip = getEdgeClientIp(request);

  if (!options?.skipGeneralMemoryRateLimit) {
    const { max, windowMs } = getEdgeApiRateLimitParams();
    const rl = checkEdgeRateLimit(`api:${ip}`, max, windowMs);
    if (!rl.ok) {
      return { type: 'rate', retryAfterSec: rl.retryAfterSec, detail: 'general' };
    }
  }

  if (
    request.method === 'POST' &&
    isAiCostlyApiPath(pathname) &&
    !options?.skipAiMemoryRateLimit
  ) {
    const { max: aiMax, windowMs: aiWindow } = getEdgeAiRateLimitParams();
    const aiRl = checkEdgeRateLimit(`ai:${ip}`, aiMax, aiWindow);
    if (!aiRl.ok) {
      return { type: 'rate', retryAfterSec: aiRl.retryAfterSec, detail: 'ai' };
    }
  }

  if (
    request.method === 'POST' &&
    isAiCostlyApiPath(pathname) &&
    options?.authenticatedUserId &&
    isEdgeAiUserRateLimitEnabled() &&
    !options?.skipAiUserMemoryRateLimit
  ) {
    const { max: uMax, windowMs: uWindow } = getEdgeAiUserRateLimitParams();
    const uRl = checkEdgeRateLimit(
      `aiu:${options.authenticatedUserId}`,
      uMax,
      uWindow
    );
    if (!uRl.ok) {
      return { type: 'rate', retryAfterSec: uRl.retryAfterSec, detail: 'ai_user' };
    }
  }

  return null;
}
