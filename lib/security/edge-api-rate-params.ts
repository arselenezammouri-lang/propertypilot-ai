/**
 * Shared env-driven params for Edge API rate limiting (memory + optional Upstash).
 */

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
