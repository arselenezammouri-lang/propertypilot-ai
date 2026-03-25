import { listingContentToolsLocalesEs } from '@/lib/i18n/listing-content-tools-locales-es';
import { listingContentToolsLocalesAr } from '@/lib/i18n/listing-content-tools-locales-ar';

describe('listing content tools locales', () => {
  it('ES refine has iconKeys and no emoji in hero badge', () => {
    const r = listingContentToolsLocalesEs.refineListingPage;
    expect(r.heroBadge).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
    expect(r.transactionOptions.every((o) => o.iconKey)).toBe(true);
    expect(r.toneSelectItems.every((o) => o.iconKey)).toBe(true);
  });

  it('ES translate has successDescFresh placeholder and target languages', () => {
    const tr = listingContentToolsLocalesEs.translateListingPage;
    expect(tr.successDescFresh).toContain('{lang}');
    expect(tr.targetLanguages.length).toBeGreaterThanOrEqual(12);
  });

  it('AR hashtags mix title template has placeholder', () => {
    const h = listingContentToolsLocalesAr.hashtagsPage;
    expect(h.mixTitleTemplate).toContain('{label}');
    expect(h.hashtagTitleVirali).toContain('{count}');
  });
});
