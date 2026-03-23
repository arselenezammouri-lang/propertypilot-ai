import { docArticles } from '@/lib/docs/doc-content';
import { resolveDocArticle } from '@/lib/docs/doc-article';

describe('getting-started/welcome article locales', () => {
  const entry = docArticles['getting-started/welcome'];

  it('resolves native titles for ES–AR', () => {
    const enTitle = resolveDocArticle(entry, 'en')!.title;
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = resolveDocArticle(entry, loc)!.title;
      expect(t).not.toBe(enTitle);
      expect(t.length).toBeGreaterThan(10);
    }
  });

  it('keeps IT distinct from EN', () => {
    expect(resolveDocArticle(entry, 'it')!.title).not.toBe(resolveDocArticle(entry, 'en')!.title);
  });
});
