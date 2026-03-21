import {
  getEdgeApiRateLimitParams,
  isEdgeApiRateLimitEnabled,
} from '@/lib/security/edge-api-rate-params';

describe('edge-api-rate-params', () => {
  const prevEdge = process.env.EDGE_API_RATE_LIMIT_ENABLED;
  const prevMax = process.env.EDGE_API_RATE_LIMIT_MAX;
  const prevWin = process.env.EDGE_API_RATE_LIMIT_WINDOW_MS;
  const prevNode = process.env.NODE_ENV;

  afterEach(() => {
    if (prevEdge === undefined) delete process.env.EDGE_API_RATE_LIMIT_ENABLED;
    else process.env.EDGE_API_RATE_LIMIT_ENABLED = prevEdge;
    if (prevMax === undefined) delete process.env.EDGE_API_RATE_LIMIT_MAX;
    else process.env.EDGE_API_RATE_LIMIT_MAX = prevMax;
    if (prevWin === undefined) delete process.env.EDGE_API_RATE_LIMIT_WINDOW_MS;
    else process.env.EDGE_API_RATE_LIMIT_WINDOW_MS = prevWin;
    process.env.NODE_ENV = prevNode;
  });

  it('respects EDGE_API_RATE_LIMIT_ENABLED', () => {
    process.env.EDGE_API_RATE_LIMIT_ENABLED = 'false';
    expect(isEdgeApiRateLimitEnabled()).toBe(false);
    process.env.EDGE_API_RATE_LIMIT_ENABLED = 'true';
    expect(isEdgeApiRateLimitEnabled()).toBe(true);
  });

  it('getEdgeApiRateLimitParams reads env with floors', () => {
    process.env.EDGE_API_RATE_LIMIT_MAX = '50';
    process.env.EDGE_API_RATE_LIMIT_WINDOW_MS = '30000';
    expect(getEdgeApiRateLimitParams()).toEqual({ max: 50, windowMs: 30000 });
  });
});
