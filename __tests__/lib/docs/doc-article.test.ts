import { resolveDocArticle, type DocArticleBilingual, type DocArticleLegacy } from '@/lib/docs/doc-article';

describe('resolveDocArticle', () => {
  it('returns Italian for bilingual entry when locale is it', () => {
    const entry: DocArticleBilingual = {
      it: { title: 'IT', content: 'ciao' },
      en: { title: 'EN', content: 'hi' },
    };
    expect(resolveDocArticle(entry, 'it')).toEqual({ title: 'IT', content: 'ciao' });
  });

  it('returns English for bilingual entry when locale is not it', () => {
    const entry: DocArticleBilingual = {
      it: { title: 'IT', content: 'ciao' },
      en: { title: 'EN', content: 'hi' },
    };
    expect(resolveDocArticle(entry, 'es')).toEqual({ title: 'EN', content: 'hi' });
    expect(resolveDocArticle(entry, 'en')).toEqual({ title: 'EN', content: 'hi' });
  });

  it('returns legacy single-locale entry as-is', () => {
    const entry: DocArticleLegacy = { title: 'X', content: 'y' };
    expect(resolveDocArticle(entry, 'it')).toEqual({ title: 'X', content: 'y' });
    expect(resolveDocArticle(entry, 'fr')).toEqual({ title: 'X', content: 'y' });
  });

  it('returns null for undefined', () => {
    expect(resolveDocArticle(undefined, 'it')).toBeNull();
  });
});
