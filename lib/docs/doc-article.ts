/**
 * Docs articles in app/docs/[slug] — legacy single-locale, or bilingual IT/EN (body); hub cards localized separately.
 */

import type { Locale } from '@/lib/i18n/config';

export type DocArticleBilingual = {
  it: { title: string; content: string };
  en: { title: string; content: string };
};

export type DocArticleLegacy = { title: string; content: string };

export type DocArticleEntry = DocArticleBilingual | DocArticleLegacy;

export function resolveDocArticle(
  entry: DocArticleEntry | undefined,
  locale: Locale
): { title: string; content: string } | null {
  if (!entry) return null;
  if ('it' in entry && 'en' in entry) {
    return locale === 'it' ? entry.it : entry.en;
  }
  return { title: entry.title, content: entry.content };
}
