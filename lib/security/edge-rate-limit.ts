/**
 * Fixed-window rate limiter for Edge middleware (in-memory per server instance).
 * Mitigates API scraping and brute force; for fleet-wide limits use Vercel Firewall / Redis.
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();
const PRUNE_EVERY = 200;
let pruneCounter = 0;

function pruneExpired(): void {
  const now = Date.now();
  for (const [key, b] of store) {
    if (b.resetAt <= now) store.delete(key);
  }
}

export type EdgeRateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

export function checkEdgeRateLimit(
  key: string,
  max: number,
  windowMs: number,
  now: number = Date.now()
): EdgeRateLimitResult {
  if (++pruneCounter >= PRUNE_EVERY) {
    pruneCounter = 0;
    pruneExpired();
  }

  let bucket = store.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, bucket);
    return { ok: true };
  }

  if (bucket.count >= max) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return { ok: false, retryAfterSec };
  }

  bucket.count += 1;
  return { ok: true };
}

/** Test helper */
export function resetEdgeRateLimitStore(): void {
  store.clear();
  pruneCounter = 0;
}
