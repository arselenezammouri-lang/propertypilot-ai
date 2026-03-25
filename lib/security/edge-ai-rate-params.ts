/**
 * Stricter per-IP limits for costly AI / LLM API routes (middleware).
 * Applied in addition to the general `EDGE_API_RATE_LIMIT_*` bucket.
 */

export function getEdgeAiRateLimitParams(): { max: number; windowMs: number } {
  const max = Math.max(
    1,
    Number(process.env.EDGE_AI_RATE_LIMIT_MAX ?? 30) || 30
  );
  const windowMs = Math.max(
    5000,
    Number(process.env.EDGE_AI_RATE_LIMIT_WINDOW_MS ?? 60_000) || 60_000
  );
  return { max, windowMs };
}
