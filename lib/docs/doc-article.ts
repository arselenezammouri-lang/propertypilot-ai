/**
 * Docs articles in app/docs/[slug] — support legacy single-locale entries and bilingual IT/EN.
 */

export type DocArticleBilingual = {
  it: { title: string; content: string };
  en: { title: string; content: string };
};

export type DocArticleLegacy = { title: string; content: string };

export type DocArticleEntry = DocArticleBilingual | DocArticleLegacy;

export function resolveDocArticle(
  entry: DocArticleEntry | undefined,
  isItalian: boolean
): { title: string; content: string } | null {
  if (!entry) return null;
  if ("it" in entry && "en" in entry) {
    return isItalian ? entry.it : entry.en;
  }
  return { title: entry.title, content: entry.content };
}
