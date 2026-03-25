import { getTranslation } from '@/lib/i18n/dictionary';

describe('devTestError', () => {
  it('all locales have same keys as EN', () => {
    const en = getTranslation('en').devTestError;
    const enKeys = Object.keys(en).sort();
    for (const loc of ['it', 'es', 'fr', 'de', 'pt', 'ar'] as const) {
      expect(Object.keys(getTranslation(loc).devTestError).sort()).toEqual(enKeys);
    }
  });

  it('non-English differs from EN for title', () => {
    expect(getTranslation('it').devTestError.title).not.toBe(
      getTranslation('en').devTestError.title
    );
  });
});
