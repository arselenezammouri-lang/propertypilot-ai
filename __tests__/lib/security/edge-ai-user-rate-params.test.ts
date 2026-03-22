import {
  getEdgeAiUserRateLimitParams,
  isEdgeAiUserRateLimitEnabled,
} from '@/lib/security/edge-ai-user-rate-params';

describe('edge-ai-user-rate-params', () => {
  const prevEn = process.env.EDGE_AI_USER_RATE_LIMIT_ENABLED;
  const prevMax = process.env.EDGE_AI_USER_RATE_LIMIT_MAX;
  const prevWin = process.env.EDGE_AI_USER_RATE_LIMIT_WINDOW_MS;
  const prevNode = process.env.NODE_ENV;

  afterEach(() => {
    if (prevEn === undefined) delete process.env.EDGE_AI_USER_RATE_LIMIT_ENABLED;
    else process.env.EDGE_AI_USER_RATE_LIMIT_ENABLED = prevEn;
    if (prevMax === undefined) delete process.env.EDGE_AI_USER_RATE_LIMIT_MAX;
    else process.env.EDGE_AI_USER_RATE_LIMIT_MAX = prevMax;
    if (prevWin === undefined) delete process.env.EDGE_AI_USER_RATE_LIMIT_WINDOW_MS;
    else process.env.EDGE_AI_USER_RATE_LIMIT_WINDOW_MS = prevWin;
    process.env.NODE_ENV = prevNode;
  });

  it('defaults enabled in production', () => {
    delete process.env.EDGE_AI_USER_RATE_LIMIT_ENABLED;
    process.env.NODE_ENV = 'production';
    expect(isEdgeAiUserRateLimitEnabled()).toBe(true);
  });

  it('defaults disabled in development', () => {
    delete process.env.EDGE_AI_USER_RATE_LIMIT_ENABLED;
    process.env.NODE_ENV = 'development';
    expect(isEdgeAiUserRateLimitEnabled()).toBe(false);
  });

  it('getEdgeAiUserRateLimitParams defaults', () => {
    delete process.env.EDGE_AI_USER_RATE_LIMIT_MAX;
    delete process.env.EDGE_AI_USER_RATE_LIMIT_WINDOW_MS;
    expect(getEdgeAiUserRateLimitParams()).toEqual({ max: 20, windowMs: 60_000 });
  });
});
