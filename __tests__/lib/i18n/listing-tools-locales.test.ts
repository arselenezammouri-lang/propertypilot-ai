import { listingToolsLocalesEs } from '@/lib/i18n/listing-tools-locales-es';
import { listingToolsLocalesAr } from '@/lib/i18n/listing-tools-locales-ar';
import { getTranslation } from '@/lib/i18n/dictionary';

describe('listing-tools-locales', () => {
  it('ES analyze + auditor use placeholders and iconKey', () => {
    const { analyzeLinkPage, listingAuditorPage } = listingToolsLocalesEs;
    expect(analyzeLinkPage.copiedToClipboard).toContain('{label}');
    expect(listingAuditorPage.transactionTypes.vendita.iconKey).toBe('tag');
    expect(listingAuditorPage.structuralSections.titolo).not.toMatch(/📌/);
  });

  it('dictionary merge exposes ES listing pages', () => {
    const es = getTranslation('es').dashboard;
    expect(es.analyzeLinkPage.analyze.length).toBeGreaterThan(3);
    expect(es.listingScraperPage.suggestionHint).not.toMatch(/💡/);
    expect(es.listingAuditorPage.markets.italia.label).not.toMatch(/🇮🇹/);
  });

  it('AR scraper has back link', () => {
    expect(listingToolsLocalesAr.listingScraperPage.backLink.length).toBeGreaterThan(2);
  });
});
