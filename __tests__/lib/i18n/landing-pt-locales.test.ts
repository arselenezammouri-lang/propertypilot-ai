import { getTranslation } from '@/lib/i18n/dictionary';

describe('landing-pt-locales', () => {
  it('PT home landing differs from EN (full native block)', () => {
    const pt = getTranslation('pt').landing;
    const en = getTranslation('en').landing;
    expect(pt.hero.titlePart1).not.toBe(en.hero.titlePart1);
    expect(pt.features.title).not.toBe(en.features.title);
    expect(pt.testimonials.title).not.toBe(en.testimonials.title);
    expect(pt.footer.pricing).not.toBe(en.footer.pricing);
    expect(pt.pricingPage.mainTitle).not.toBe(en.pricingPage.mainTitle);
  });

  it('PT pricingPage has 6 feature rows and 6 FAQs like EN', () => {
    const pt = getTranslation('pt').landing.pricingPage;
    const en = getTranslation('en').landing.pricingPage;
    expect(pt.features).toHaveLength(en.features.length);
    expect(pt.faqs).toHaveLength(en.faqs.length);
  });
});
