import { getTranslation } from '@/lib/i18n/dictionary';

describe('docsHub', () => {
  const en = getTranslation('en').docsHub;
  const itHub = getTranslation('it').docsHub;

  it('keeps same section ids and slugs as EN for all locales', () => {
    const enIds = en.sections.map((s) => s.id);
    const enSlugs = en.sections.flatMap((s) => s.articles.map((a) => a.slug)).sort();
    for (const loc of ['it', 'es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslation(loc).docsHub;
      expect(t.sections.map((s) => s.id)).toEqual(enIds);
      expect(t.sections.flatMap((s) => s.articles.map((a) => a.slug)).sort()).toEqual(enSlugs);
    }
  });

  it('ES hub chrome differs from EN', () => {
    const es = getTranslation('es').docsHub;
    expect(es.pageSubtitle).not.toBe(en.pageSubtitle);
    expect(es.backToDocs).not.toBe(en.backToDocs);
  });

  it('IT has native section titles vs EN', () => {
    const itGs = itHub.sections.find((s) => s.id === 'getting-started');
    const enGs = en.sections.find((s) => s.id === 'getting-started');
    expect(itGs?.title).not.toBe(enGs?.title);
  });
});
