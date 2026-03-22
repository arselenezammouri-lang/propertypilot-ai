import { buildLocalizedNextActionSuggestion, prospectingNextActionUiEn } from '@/lib/i18n/prospecting-next-action-ui';

describe('prospecting-next-action-ui', () => {
  it('replaces pct and formats minutes', () => {
    const r = buildLocalizedNextActionSuggestion(prospectingNextActionUiEn, {
      iconKey: 'fileText',
      priority: 'medium',
      minutes: 3,
      block: 'premiumReport',
      pct: 18,
    });
    expect(r.reasoning).toContain('18');
    expect(r.estimatedTime).toBe('3 min');
  });
});
