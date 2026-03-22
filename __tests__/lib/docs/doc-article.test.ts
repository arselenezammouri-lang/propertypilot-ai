import { resolveDocArticle, type DocArticleBilingual, type DocArticleLegacy } from '@/lib/docs/doc-article';

describe('resolveDocArticle', () => {
  it('returns Italian for bilingual entry when isItalian', () => {
    const entry: DocArticleBilingual = {
      it: { title: 'IT', content: 'ciao' },
      en: { title: 'EN', content: 'hi' },
    };
    expect(resolveDocArticle(entry, true)).toEqual({ title: 'IT', content: 'ciao' });
  });

  it('returns English for bilingual entry when not Italian', () => {
    const entry: DocArticleBilingual = {
      it: { title: 'IT', content: 'ciao' },
      en: { title: 'EN', content: 'hi' },
    };
    expect(resolveDocArticle(entry, false)).toEqual({ title: 'EN', content: 'hi' });
  });

  it('returns legacy single-locale entry as-is', () => {
    const entry: DocArticleLegacy = { title: 'X', content: 'y' };
    expect(resolveDocArticle(entry, true)).toEqual({ title: 'X', content: 'y' });
    expect(resolveDocArticle(entry, false)).toEqual({ title: 'X', content: 'y' });
  });

  it('returns null for undefined', () => {
    expect(resolveDocArticle(undefined, true)).toBeNull();
  });
});
