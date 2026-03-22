import { prospectingPageUiEs } from '@/lib/i18n/prospecting-page-ui-locales';

describe('prospecting-page-ui-locales', () => {
  it('ES bundle has localized hero and nested nextAction', () => {
    expect(prospectingPageUiEs.heroTitle).toContain('arbitraje');
    expect(prospectingPageUiEs.nextAction.priceDrop.reasoning).toContain('{pct}');
    expect(prospectingPageUiEs.statusRow.new).toBe('Nuevo');
  });
});
