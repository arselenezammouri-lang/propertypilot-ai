/**
 * Second Upstash fixed window for AI-heavy `/api/*` routes (same Redis as global API limit).
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/cloudflare';
import { logger } from '@/lib/utils/safe-logger';
import { getEdgeAiRateLimitParams } from '@/lib/security/edge-ai-rate-params';

let ratelimit: Ratelimit | null | undefined;

function getAiRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    ratelimit = null;
    return null;
  }

  try {
    const redis = new Redis({ url, token });
    const { max, windowMs } = getEdgeAiRateLimitParams();
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(max, `${windowSec} s`),
      prefix: 'pp:mw:ai',
      analytics: false,
    });
    return ratelimit;
  } catch (e) {
    logger.error('Upstash AI Ratelimit init failed', e);
    ratelimit = null;
    return null;
  }
}

export function isUpstashAiRateLimitConfigured(): boolean {
  return getAiRatelimit() !== null;
}

export type UpstashAiLimitOutcome =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export async function limitAiRequestUpstash(identifier: string): Promise<UpstashAiLimitOutcome> {
  const rl = getAiRatelimit();
  if (!rl) {
    return { ok: true };
  }

  try {
    const result = await rl.limit(identifier);
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
    logger.warn('Upstash AI rate limit call failed, falling back to memory', {
      message: e instanceof Error ? e.message : String(e),
    });
    return { ok: true };
  }
}
