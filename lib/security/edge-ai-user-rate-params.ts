/**
 * Per-authenticated-user rate limit for costly AI POSTs (middleware).
 * Only applied when a Supabase session exists; anonymous traffic relies on IP limits only.
 */

export function isEdgeAiUserRateLimitEnabled(): boolean {
  if (process.env.EDGE_AI_USER_RATE_LIMIT_ENABLED === 'false') return false;
  if (process.env.EDGE_AI_USER_RATE_LIMIT_ENABLED === 'true') return true;
  return process.env.NODE_ENV === 'production';
}

export function getEdgeAiUserRateLimitParams(): { max: number; windowMs: number } {
  const max = Math.max(
    1,
    Number(process.env.EDGE_AI_USER_RATE_LIMIT_MAX ?? 20) || 20
  );
  const windowMs = Math.max(
    5000,
    Number(process.env.EDGE_AI_USER_RATE_LIMIT_WINDOW_MS ?? 60_000) || 60_000
  );
  return { max, windowMs };
}
