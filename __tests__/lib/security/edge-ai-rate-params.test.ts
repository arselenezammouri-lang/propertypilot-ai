import { getEdgeAiRateLimitParams } from '@/lib/security/edge-ai-rate-params';

describe('getEdgeAiRateLimitParams', () => {
  const prevMax = process.env.EDGE_AI_RATE_LIMIT_MAX;
  const prevWin = process.env.EDGE_AI_RATE_LIMIT_WINDOW_MS;

  afterEach(() => {
    if (prevMax === undefined) delete process.env.EDGE_AI_RATE_LIMIT_MAX;
    else process.env.EDGE_AI_RATE_LIMIT_MAX = prevMax;
    if (prevWin === undefined) delete process.env.EDGE_AI_RATE_LIMIT_WINDOW_MS;
    else process.env.EDGE_AI_RATE_LIMIT_WINDOW_MS = prevWin;
  });

  it('defaults to 30 per minute', () => {
    delete process.env.EDGE_AI_RATE_LIMIT_MAX;
    delete process.env.EDGE_AI_RATE_LIMIT_WINDOW_MS;
    expect(getEdgeAiRateLimitParams()).toEqual({ max: 30, windowMs: 60_000 });
  });

  it('reads env', () => {
    process.env.EDGE_AI_RATE_LIMIT_MAX = '10';
    process.env.EDGE_AI_RATE_LIMIT_WINDOW_MS = '120000';
    expect(getEdgeAiRateLimitParams()).toEqual({ max: 10, windowMs: 120_000 });
  });
});
