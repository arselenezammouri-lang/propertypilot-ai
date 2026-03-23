import { docArticles } from '@/lib/docs/doc-content';
import { resolveDocArticle } from '@/lib/docs/doc-article';

/** Articles with full ES–AR markdown (not EN fallback) */
const FULLY_LOCALIZED_DOC_SLUGS = [
  'getting-started/welcome',
  'getting-started/first-listing',
  'getting-started/workspace-setup',
  'getting-started/perfect-copy',
  'crm/pipeline',
  'account/billing-guide',
  'prospecting/scraper-guide',
  'prospecting/filters',
  'prospecting/arbitrage',
  'ai-voice/voice-setup',
  'ai-voice/call-scripts',
  'ai-voice/obstacle-handling',
  '3d-staging/staging-guide',
  '3d-staging/whatsapp-integration',
  'price-sniper/sniper-guide',
  'price-sniper/sniper-strategy',
] as const;

describe('localized doc articles ES–AR', () => {
  it('each article has native title distinct from EN for ES', () => {
    for (const slug of FULLY_LOCALIZED_DOC_SLUGS) {
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

  it('AR billing guide content mentions Stripe', () => {
    const body = resolveDocArticle(docArticles['account/billing-guide'], 'ar')!.content;
    expect(body.toLowerCase()).toContain('stripe');
  });
});
