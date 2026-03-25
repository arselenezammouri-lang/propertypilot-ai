import {
  resolveDocArticle,
  type DocArticleBilingual,
  type DocArticleLegacy,
  type DocArticleMultilingual,
} from '@/lib/docs/doc-article';

describe('resolveDocArticle', () => {
  it('returns Italian for bilingual entry when locale is it', () => {
    const entry: DocArticleBilingual = {
      it: { title: 'IT', content: 'ciao' },
      en: { title: 'EN', content: 'hi' },
    };
    expect(resolveDocArticle(entry, 'it')).toEqual({ title: 'IT', content: 'ciao' });
  });

  it('returns English when locale has no extra translation', () => {
    const entry: DocArticleBilingual = {
      it: { title: 'IT', content: 'ciao' },
      en: { title: 'EN', content: 'hi' },
    };
    expect(resolveDocArticle(entry, 'es')).toEqual({ title: 'EN', content: 'hi' });
    expect(resolveDocArticle(entry, 'en')).toEqual({ title: 'EN', content: 'hi' });
  });

  it('returns locale slice when present on multilingual entry', () => {
    const entry: DocArticleMultilingual = {
      it: { title: 'IT', content: 'ciao' },
      en: { title: 'EN', content: 'hi' },
      es: { title: 'ES', content: 'hola' },
    };
    expect(resolveDocArticle(entry, 'es')).toEqual({ title: 'ES', content: 'hola' });
    expect(resolveDocArticle(entry, 'fr')).toEqual({ title: 'EN', content: 'hi' });
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
