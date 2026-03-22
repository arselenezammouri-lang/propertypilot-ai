import { getTranslation } from '@/lib/i18n/dictionary';
import { getTerritoryAnalysisStrings } from '@/lib/i18n/territory-analysis-strings';
import { generateTerritoryInsights } from '@/lib/ai/territory-analysis';

describe('prospectingModals dictionary', () => {
  it('ES has script placeholders and WhatsApp clipboard errors', () => {
    const m = getTranslation('es').prospectingModals;
    expect(m.priceDropSniper.scriptTemplate).toContain('{owner}');
    expect(m.whatsappSender.clipboardErrorDesc).toBeTruthy();
    expect(m.investmentAnalysis.disclaimerLead).toBe('Nota:');
  });

  it('EN investment export header is ASCII', () => {
    const m = getTranslation('en').prospectingModals.investmentAnalysis;
    expect(m.exportHeader).toMatch(/INVESTMENT/i);
  });
});

describe('territory analysis i18n', () => {
  it('returns localized demand description for EN', () => {
    const s = getTerritoryAnalysisStrings('en');
    expect(s.demandDescriptions.hot.length).toBeGreaterThan(10);
  });

  it('generateTerritoryInsights uses locale for marketAdvice', () => {
    const it = generateTerritoryInsights('Roma centro', 'RESIDENTIAL_SALE', 'it');
    const en = generateTerritoryInsights('Roma centro', 'RESIDENTIAL_SALE', 'en');
    expect(it.marketAdvice).not.toBe(en.marketAdvice);
  });
});
