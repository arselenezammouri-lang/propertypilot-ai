import { suggestNextAction } from '@/lib/ai/next-action-suggestion';

describe('suggestNextAction', () => {
  it('returns iconKey instead of emoji for price drop', () => {
    const r = suggestNextAction({
      status: 'new',
      price_drop_percentage: 12,
    });
    expect(r.iconKey).toBe('barChart');
    expect(r.action).toBeTruthy();
  });
});
