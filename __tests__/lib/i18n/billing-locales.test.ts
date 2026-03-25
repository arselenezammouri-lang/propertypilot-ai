import { getTranslation } from '@/lib/i18n/dictionary';

describe('billing-locales', () => {
  it('all localized billing keys exist vs EN', () => {
    const enKeys = Object.keys(getTranslation('en').billing).sort();
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      expect(Object.keys(getTranslation(loc).billing).sort()).toEqual(enKeys);
    }
  });
});
