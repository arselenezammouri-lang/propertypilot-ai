/**
 * Upstash fixed window per Supabase user id for AI-heavy POSTs (prefix pp:mw:aiu).
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/cloudflare';
import { logger } from '@/lib/utils/safe-logger';
import { getEdgeAiUserRateLimitParams } from '@/lib/security/edge-ai-user-rate-params';

let ratelimit: Ratelimit | null | undefined;

function getRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    ratelimit = null;
    return null;
  }

  try {
    const redis = new Redis({ url, token });
    const { max, windowMs } = getEdgeAiUserRateLimitParams();
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(max, `${windowSec} s`),
      prefix: 'pp:mw:aiu',
      analytics: false,
    });
    return ratelimit;
  } catch (e) {
    logger.error('Upstash AI user Ratelimit init failed', e);
    ratelimit = null;
    return null;
  }
}

export function isUpstashAiUserRateLimitConfigured(): boolean {
  return getRatelimit() !== null;
}

export type UpstashAiUserLimitOutcome =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export async function limitAiUserRequestUpstash(
  userId: string
): Promise<UpstashAiUserLimitOutcome> {
  const rl = getRatelimit();
  if (!rl) {
    return { ok: true };
  }

  try {
    const result = await rl.limit(userId);
    if (result.pending) {
      void result.pending.catch(() => {});
    }
    if (!result.success) {
      const retryAfterSec = Math.max(
        1,
        Math.ceil((result.reset - Date.now()) / 1000)
      );
      return { ok: false, retryAfterSec };
    }
    return { ok: true };
  } catch (e) {
    logger.warn('Upstash AI user rate limit call failed, falling back to memory', {
      message: e instanceof Error ? e.message : String(e),
    });
    return { ok: true };
  }
}
