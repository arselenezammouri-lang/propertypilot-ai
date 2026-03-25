import { getTranslation } from '@/lib/i18n/dictionary';

describe('marketing-public-locales', () => {
  const enSlugs = getTranslation('en').marketingBlog.posts.map((p) => p.slug).sort();

  it('blog posts keep same slugs as EN for ES–AR', () => {
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      expect(getTranslation(loc).marketingBlog.posts.map((p) => p.slug).sort()).toEqual(enSlugs);
    }
  });

  it('marketingFeatures has same feature count as EN', () => {
    const n = getTranslation('en').marketingFeatures.features.length;
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      expect(getTranslation(loc).marketingFeatures.features).toHaveLength(n);
    }
  });

  it('pricing plans structure matches EN', () => {
    const en = getTranslation('en').pricingPagePlans;
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const p = getTranslation(loc).pricingPagePlans;
      expect(p.starter.includes).toHaveLength(en.starter.includes.length);
      expect(p.pro.includes).toHaveLength(en.pro.includes.length);
      expect(p.agency.includes).toHaveLength(en.agency.includes.length);
      expect(p.boost.includes).toHaveLength(en.boost.includes.length);
      expect(p.footerCopyright).toContain('{year}');
    }
  });

  it('localized titles differ from EN (no silent fallback)', () => {
    const en = getTranslation('en');
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslation(loc);
      expect(t.marketingAbout.title).not.toBe(en.marketingAbout.title);
      expect(t.marketingBlog.metaTitle).not.toBe(en.marketingBlog.metaTitle);
      expect(t.marketingBlog.subtitle).not.toBe(en.marketingBlog.subtitle);
      expect(t.marketingFeatures.titleWord).not.toBe(en.marketingFeatures.titleWord);
      expect(t.blogPostPage.backToBlog).not.toBe(en.blogPostPage.backToBlog);
      expect(t.pricingPagePlans.starter.cta).not.toBe(en.pricingPagePlans.starter.cta);
    }
  });

  it('blog knownTitles cover all EN slugs', () => {
    for (const loc of ['es', 'fr', 'de', 'pt', 'ar'] as const) {
      const kt = getTranslation(loc).blogPostPage.knownTitles;
      for (const slug of enSlugs) {
        expect(kt[slug]).toBeTruthy();
      }
    }
  });
});
