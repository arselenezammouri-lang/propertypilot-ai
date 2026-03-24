import { buildAboutPageMetadata, buildBlogIndexMetadata } from '@/lib/i18n/page-metadata-builders';

describe('page-metadata-builders', () => {
  it('about title uses marketing about title', () => {
    const it = buildAboutPageMetadata('it');
    expect(it.title).toBe('Chi siamo');
    expect(typeof it.description).toBe('string');
    expect((it.description as string).length).toBeGreaterThan(10);
  });

  it('blog title uses localized metaTitle', () => {
    expect(buildBlogIndexMetadata('en').title).toBe('Real estate blog');
    expect(buildBlogIndexMetadata('it').title).toBe('Blog immobiliare');
  });
});
