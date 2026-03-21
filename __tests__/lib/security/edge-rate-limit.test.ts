import {
  checkEdgeRateLimit,
  resetEdgeRateLimitStore,
} from '@/lib/security/edge-rate-limit';

describe('checkEdgeRateLimit', () => {
  beforeEach(() => {
    resetEdgeRateLimitStore();
  });

  it('allows requests under the limit', () => {
    const now = 1_000_000;
    expect(checkEdgeRateLimit('a', 3, 60_000, now)).toEqual({ ok: true });
    expect(checkEdgeRateLimit('a', 3, 60_000, now + 1)).toEqual({ ok: true });
    expect(checkEdgeRateLimit('a', 3, 60_000, now + 2)).toEqual({ ok: true });
  });

  it('blocks when limit exceeded within window', () => {
    const now = 2_000_000;
    checkEdgeRateLimit('k', 2, 10_000, now);
    checkEdgeRateLimit('k', 2, 10_000, now + 1);
    const r = checkEdgeRateLimit('k', 2, 10_000, now + 2);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.retryAfterSec).toBeGreaterThan(0);
  });

  it('resets after window', () => {
    const t0 = 5_000_000;
    checkEdgeRateLimit('w', 1, 1000, t0);
    expect(checkEdgeRateLimit('w', 1, 1000, t0 + 1).ok).toBe(false);
    expect(checkEdgeRateLimit('w', 1, 1000, t0 + 1001).ok).toBe(true);
  });
});
