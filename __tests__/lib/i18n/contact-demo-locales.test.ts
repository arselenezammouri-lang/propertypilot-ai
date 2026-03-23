import { getTranslation } from '@/lib/i18n/dictionary';

function sortedKeysDeep(o: unknown): string[] {
  if (o === null || typeof o !== 'object') return [];
  if (Array.isArray(o)) return o.map((_, i) => String(i));
  return Object.keys(o as object).sort();
}

describe('contact-demo-locales', () => {
  it('demo + contact structures match EN for ES–AR', () => {
    const en = getTranslation('en');
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslation(loc);
      expect(sortedKeysDeep(t.demo)).toEqual(sortedKeysDeep(en.demo));
      expect(sortedKeysDeep(t.contact)).toEqual(sortedKeysDeep(en.contact));
      expect(t.demo.valuePointsList).toHaveLength(en.demo.valuePointsList.length);
      expect(t.demo.testimonialsList).toHaveLength(en.demo.testimonialsList.length);
      expect(t.demo.trustStats).toHaveLength(en.demo.trustStats.length);
    }
  });

  it('localized demo/contact differ from EN (no silent fallback)', () => {
    const en = getTranslation('en');
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslation(loc);
      expect(t.demo.hero.title).not.toBe(en.demo.hero.title);
      expect(t.contact.title).not.toBe(en.contact.title);
      expect(t.contact.toast.successDesc).not.toBe(en.contact.toast.successDesc);
    }
  });

  it('landing nav tagline localized for ES–AR (demo header)', () => {
    const enTag = getTranslation('en').landing.nav.tagline;
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      expect(getTranslation(loc).landing.nav.tagline).not.toBe(enTag);
    }
  });
});
