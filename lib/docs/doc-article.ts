/**
 * Docs articles in app/docs/[...slug] — legacy single-locale, multilingual IT/EN + optional ES–AR, or bilingual IT/EN only.
 */

import type { Locale } from '@/lib/i18n/config';

export type DocArticleSlice = { title: string; content: string };

export type DocArticleBilingual = {
  it: DocArticleSlice;
  en: DocArticleSlice;
};

/** IT/EN required; other locales optional (fallback: requested → EN → IT) */
export type DocArticleMultilingual = DocArticleBilingual & Partial<Record<Exclude<Locale, 'it' | 'en'>, DocArticleSlice>>;

export type DocArticleLegacy = DocArticleSlice;

export type DocArticleEntry = DocArticleMultilingual | DocArticleLegacy;

const EXTRA_LOCALES = ['es', 'fr', 'de', 'pt', 'ar'] as const satisfies readonly Exclude<Locale, 'it' | 'en'>[];

function isMultilingual(entry: DocArticleEntry): entry is DocArticleMultilingual {
  return 'it' in entry && 'en' in entry;
}

export function resolveDocArticle(
  entry: DocArticleEntry | undefined,
  locale: Locale
): DocArticleSlice | null {
  if (!entry) return null;
  if (!isMultilingual(entry)) {
    return { title: entry.title, content: entry.content };
  }
  if (locale === 'it') return entry.it;
  if (locale === 'en') return entry.en;
  for (const loc of EXTRA_LOCALES) {
    if (locale === loc) {
      const slice = entry[loc];
      if (slice) return slice;
      break;
    }
  }
  return entry.en;
}
