import { getTranslation } from '@/lib/i18n/dictionary';

describe('auth-locales', () => {
  it('all localized auth keys exist vs EN', () => {
    const enAuth = getTranslation('en').auth;
    const enKeys = (o: unknown): string[] =>
      typeof o === 'object' && o !== null ? Object.keys(o).sort() : [];

    expect(enKeys(enAuth.login)).toEqual(enKeys(getTranslation('es').auth.login));
    expect(enKeys(enAuth.signup)).toEqual(enKeys(getTranslation('fr').auth.signup));
    expect(enKeys(enAuth.toast)).toEqual(enKeys(getTranslation('de').auth.toast));

    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslation(loc).auth;
      expect(t.backToHome).not.toBe(enAuth.backToHome);
      expect(t.login.title).not.toBe(enAuth.login.title);
      expect(t.toast.rateLimitMsg).not.toBe(enAuth.toast.rateLimitMsg);
    }
  });

  it('no emoji in auth toast titles for IT/EN', () => {
    for (const loc of ['it', 'en'] as const) {
      const toast = getTranslation(loc).auth.toast;
      for (const v of Object.values(toast)) {
        expect(v).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
      }
    }
  });
});
