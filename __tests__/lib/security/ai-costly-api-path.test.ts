import { isAiCostlyApiPath } from '@/lib/security/ai-costly-api-path';

describe('isAiCostlyApiPath', () => {
  it('matches generate and subpaths', () => {
    expect(isAiCostlyApiPath('/api/generate')).toBe(true);
    expect(isAiCostlyApiPath('/api/generate-comprehensive')).toBe(true);
    expect(isAiCostlyApiPath('/api/generate-perfect-copy')).toBe(true);
  });

  it('matches other costly prefixes', () => {
    expect(isAiCostlyApiPath('/api/aria/chat')).toBe(true);
    expect(isAiCostlyApiPath('/api/lead-score')).toBe(true);
  });

  it('returns false for unrelated API', () => {
    expect(isAiCostlyApiPath('/api/health')).toBe(false);
    expect(isAiCostlyApiPath('/api/user/subscription')).toBe(false);
  });
});
