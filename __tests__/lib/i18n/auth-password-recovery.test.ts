import { getTranslation } from '@/lib/i18n/dictionary';

describe('authPasswordRecovery', () => {
  it('all locales expose same keys as EN', () => {
    const en = getTranslation('en').authPasswordRecovery;
    const enKeys = (o: unknown): string[] =>
      typeof o === 'object' && o !== null ? Object.keys(o).sort() : [];

    expect(enKeys(en.forgot)).toEqual(enKeys(getTranslation('it').authPasswordRecovery.forgot));
    expect(enKeys(en.reset)).toEqual(enKeys(getTranslation('ar').authPasswordRecovery.reset));

    for (const loc of ['it', 'es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslation(loc).authPasswordRecovery;
      expect(t.backToLogin).not.toBe(en.backToLogin);
      expect(t.forgot.pageTitle).not.toBe(en.forgot.pageTitle);
      expect(t.reset.minLength).not.toBe(en.reset.minLength);
    }
  });
});
