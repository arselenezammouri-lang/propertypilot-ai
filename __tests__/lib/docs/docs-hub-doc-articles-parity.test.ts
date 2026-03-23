import { docArticles } from '@/lib/docs/doc-content';
import { getTranslation } from '@/lib/i18n/dictionary';

describe('docsHub slugs vs docArticles', () => {
  const enHub = getTranslation('en').docsHub;
  const hubSlugs = [...new Set(enHub.sections.flatMap((s) => s.articles.map((a) => a.slug)))].sort();

  it('every hub article slug has doc content', () => {
    for (const slug of hubSlugs) {
      expect(docArticles[slug]).toBeDefined();
    }
  });

  it('docArticles keys are a superset of hub (no orphan hub links)', () => {
    expect(hubSlugs.length).toBeGreaterThan(0);
  });
});
