import { docArticles } from '@/lib/docs/doc-content';
import { resolveDocArticle } from '@/lib/docs/doc-article';

const GETTING_STARTED_SLUGS = [
  'getting-started/welcome',
  'getting-started/first-listing',
  'getting-started/workspace-setup',
] as const;

describe('getting-started doc articles ES–AR', () => {
  it('each article has native title distinct from EN for ES', () => {
    for (const slug of GETTING_STARTED_SLUGS) {
      const entry = docArticles[slug];
      const enTitle = resolveDocArticle(entry, 'en')!.title;
      const esTitle = resolveDocArticle(entry, 'es')!.title;
      expect(esTitle).not.toBe(enTitle);
      expect(esTitle.length).toBeGreaterThan(5);
    }
  });

  it('FR and DE titles differ from EN for first-listing', () => {
    const entry = docArticles['getting-started/first-listing'];
    const en = resolveDocArticle(entry, 'en')!.title;
    expect(resolveDocArticle(entry, 'fr')!.title).not.toBe(en);
    expect(resolveDocArticle(entry, 'de')!.title).not.toBe(en);
  });
});
