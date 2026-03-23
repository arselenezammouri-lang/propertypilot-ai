import { docArticles } from '@/lib/docs/doc-content';
import { getTranslation } from '@/lib/i18n/dictionary';
import {
  ARIA_CHAT_DOC_LINK_BY_KEYWORD,
  COMMAND_PALETTE_GUIDE_PATHS,
  docArticleSlugFromPath,
} from '@/lib/docs/doc-static-links';

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

describe('hardcoded /docs paths vs docArticles', () => {
  it('command palette guide paths (except hub) resolve to articles', () => {
    for (const path of Object.values(COMMAND_PALETTE_GUIDE_PATHS)) {
      const slug = docArticleSlugFromPath(path);
      if (slug === null) {
        expect(path).toBe('/docs');
        continue;
      }
      expect(docArticles[slug]).toBeDefined();
    }
  });

  it('Aria chat doc link map targets hub or existing articles', () => {
    const paths = [...new Set(Object.values(ARIA_CHAT_DOC_LINK_BY_KEYWORD))];
    for (const path of paths) {
      const slug = docArticleSlugFromPath(path);
      if (slug === null) {
        expect(path).toBe('/docs');
        continue;
      }
      expect(docArticles[slug]).toBeDefined();
    }
  });
});
