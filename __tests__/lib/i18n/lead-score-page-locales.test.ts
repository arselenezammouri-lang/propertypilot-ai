import { leadScorePageUiEs } from '@/lib/i18n/lead-score-page-locales-es';
import { leadScorePageUiAr } from '@/lib/i18n/lead-score-page-locales-ar';

describe('lead score page locales', () => {
  it('ES has placeholders and factor label map', () => {
    expect(leadScorePageUiEs.analysisInSeconds).toContain('{seconds}');
    expect(leadScorePageUiEs.copiedWithLabel).toContain('{label}');
    expect(leadScorePageUiEs.factorLabels['Urgenza Percepita'].length).toBeGreaterThan(3);
    expect(leadScorePageUiEs.propertyTypes.length).toBe(8);
  });

  it('AR has RTL-friendly copy and timing options', () => {
    expect(leadScorePageUiAr.timingOptions.length).toBe(5);
    expect(leadScorePageUiAr.pageTitle.length).toBeGreaterThan(5);
  });
});
