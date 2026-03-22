import { emotionalListingPageUiEs } from '@/lib/i18n/emotional-listing-locales-es';
import { emotionalListingPageUiAr } from '@/lib/i18n/emotional-listing-locales-ar';

describe('emotional listing locale bundles', () => {
  it('ES: transaction values unchanged for API', () => {
    expect(emotionalListingPageUiEs.transactionOptions.map((o) => o.value)).toEqual([
      'vendita',
      'affitto',
      'affitto_breve',
    ]);
  });

  it('ES: variant tab ids match result keys', () => {
    expect(emotionalListingPageUiEs.variantTabs.map((v) => v.id)).toEqual([
      'storytelling',
      'luxury',
      'familyWarm',
    ]);
  });

  it('AR: hero badge has no emoji', () => {
    expect(emotionalListingPageUiAr.heroBadge).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
  });
});
