import { docArticles } from '@/lib/docs/doc-content';
import { getTranslation } from '@/lib/i18n/dictionary';
import {
  ARIA_CHAT_DOC_LINK_BY_KEYWORD,
  ARIA_PROMPT_DOC_LINK_ROWS,
  COMMAND_PALETTE_GUIDE_PATHS,
  CONTEXTUAL_HELP_DOC_SLUGS,
  DOCS_INDEX_QUICK_LINK_PATHS,
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

  it('Aria system prompt doc map rows resolve to articles', () => {
    for (const { path } of ARIA_PROMPT_DOC_LINK_ROWS) {
      const slug = docArticleSlugFromPath(path);
      expect(slug).not.toBeNull();
      expect(docArticles[slug!]).toBeDefined();
    }
  });

  it('docs index quick CTA paths resolve to articles', () => {
    for (const path of Object.values(DOCS_INDEX_QUICK_LINK_PATHS)) {
      const slug = docArticleSlugFromPath(path);
      expect(slug).not.toBeNull();
      expect(docArticles[slug!]).toBeDefined();
    }
  });

  it('ContextualHelpTrigger slugs exist in docArticles', () => {
    for (const slug of CONTEXTUAL_HELP_DOC_SLUGS) {
      expect(docArticles[slug]).toBeDefined();
    }
  });
});
