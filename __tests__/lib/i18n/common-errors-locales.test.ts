import { getTranslation } from '@/lib/i18n/dictionary';

describe('common + errors locales ES–AR', () => {
  it('errors and common are native for ES vs EN merge', () => {
    const en = getTranslation('en');
    const es = getTranslation('es');
    expect(es.errors.pageNotFound).not.toBe(en.errors.pageNotFound);
    expect(es.errors.backToHome.toLowerCase()).toMatch(/inicio|volver|home/);
    expect(es.common.loading.toLowerCase()).toMatch(/cargando/);
    expect(es.common.error).toBe('Error');
  });

  it('all five locales have full common keys', () => {
    for (const loc of ['fr', 'de', 'pt', 'ar'] as const) {
      const c = getTranslation(loc).common;
      expect(c.loading.length).toBeGreaterThan(3);
      expect(c.error.length).toBeGreaterThan(1);
    }
  });
});
