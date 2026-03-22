import { suggestNextAction } from '@/lib/ai/next-action-suggestion';
import { prospectingNextActionUiEn, prospectingNextActionUiIt } from '@/lib/i18n/prospecting-next-action-ui';

describe('suggestNextAction', () => {
  it('returns localized action for price drop (EN)', () => {
    const r = suggestNextAction(prospectingNextActionUiEn, {
      status: 'new',
      price_drop_percentage: 12,
    });
    expect(r.iconKey).toBe('barChart');
    expect(r.action.toLowerCase()).toMatch(/report|send/);
    expect(r.reasoning).toContain('12');
  });

  it('returns Italian copy when IT bundle passed', () => {
    const r = suggestNextAction(prospectingNextActionUiIt, {
      status: 'new',
      price_drop_percentage: 5,
    });
    expect(r.action).toMatch(/report|aggiornato/i);
    expect(r.reasoning).toContain('5');
  });
});
