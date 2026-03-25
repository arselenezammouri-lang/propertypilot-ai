import { getTranslation } from '@/lib/i18n/dictionary';
import type { ComplianceCountryCode } from '@/lib/i18n/compliance-center-ui';

const COUNTRIES: ComplianceCountryCode[] = ['IT', 'US', 'ES', 'FR', 'DE', 'GB'];

describe('complianceCenter', () => {
  it('all locales have same country codes and document keys', () => {
    const en = getTranslation('en').complianceCenter;
    expect(en.countries.map((c) => c.code)).toEqual(COUNTRIES);

    for (const loc of ['it', 'es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslation(loc).complianceCenter;
      expect(t.countries.map((c) => c.code)).toEqual(COUNTRIES);
      for (const code of COUNTRIES) {
        expect(t.documents[code].map((d) => d.type)).toEqual(
          en.documents[code].map((d) => d.type)
        );
      }
    }
  });

  it('non-EN locales differ from EN on visible chrome', () => {
    const en = getTranslation('en').complianceCenter;
    const it = getTranslation('it').complianceCenter;
    expect(it.pageTitle).not.toBe(en.pageTitle);
    expect(it.countries[0].name).not.toBe(en.countries[0].name);
  });

  it('downloadDesc placeholder is present for all locales', () => {
    for (const loc of ['it', 'en', 'es', 'fr', 'de', 'pt', 'ar'] as const) {
      expect(getTranslation(loc).complianceCenter.downloadDesc).toContain('{filename}');
    }
  });
});
