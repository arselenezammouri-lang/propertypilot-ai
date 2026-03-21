/**
 * Optional distributed API rate limit via Upstash Redis (Edge-compatible).
 * When `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set, middleware uses this
 * instead of per-instance memory (see `middleware-api-guard.ts`).
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis/cloudflare';
import { logger } from '@/lib/utils/safe-logger';
import { getEdgeApiRateLimitParams } from '@/lib/security/edge-api-rate-params';

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
    const { max, windowMs } = getEdgeApiRateLimitParams();
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(max, `${windowSec} s`),
      prefix: 'pp:mw:api',
      analytics: false,
    });
    return ratelimit;
  } catch (e) {
    logger.error('Upstash Ratelimit init failed', e);
    ratelimit = null;
    return null;
  }
}

export function isUpstashApiRateLimitConfigured(): boolean {
  return getRatelimit() !== null;
}

export type UpstashLimitOutcome =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

/**
 * Returns whether the identifier is within limit. Swallows `pending` promise (Edge has no waitUntil in all setups).
 * On Redis/network failure, returns `{ ok: true }` so caller can fall back to in-memory limiter (fail-open).
 */
export async function limitApiRequestUpstash(identifier: string): Promise<UpstashLimitOutcome> {
  const rl = getRatelimit();
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
    logger.warn('Upstash rate limit call failed, falling back to memory', {
      message: e instanceof Error ? e.message : String(e),
    });
    return { ok: true };
  }
}
