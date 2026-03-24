import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import { titleFromBlogSlug } from '@/lib/i18n/blog-post-slug';
import { getBaseUrl } from '@/lib/env';
import { docArticles } from '@/lib/docs/doc-content';
import { resolveDocArticle } from '@/lib/docs/doc-article';

function firstMeaningfulLineFromDocBody(body: string): string {
  const line =
    body
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 0) ?? '';
  return line.replace(/^#+\s*/, '').trim();
}

const MAX_DESC = 158;

/** Shared SEO description trim (Open Graph, Twitter, child pages). */
export function clipMetaDescription(...parts: string[]): string {
  const s = parts
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (s.length <= MAX_DESC) return s;
  return `${s.slice(0, MAX_DESC - 1)}…`;
}

function clipDescription(...parts: string[]): string {
  return clipMetaDescription(...parts);
}

/** Child page titles use root layout template `%s | PropertyPilot AI`. */
export function buildAboutPageMetadata(locale: SupportedLocale): Metadata {
  const m = getTranslation(locale).marketingAbout;
  return {
    title: m.title,
    description: clipDescription(m.subtitle, m.missionBody),
  };
}

export function buildFeaturesPageMetadata(locale: SupportedLocale): Metadata {
  const m = getTranslation(locale).marketingFeatures;
  const extra = m.features[0]?.desc ?? '';
  return {
    title: m.titleWord,
    description: clipDescription(m.subtitle, extra),
  };
}

export function buildBlogIndexMetadata(locale: SupportedLocale): Metadata {
  const m = getTranslation(locale).marketingBlog;
  const extra = m.posts[0]?.excerpt ?? m.comingSoon;
  return {
    title: m.metaTitle,
    description: clipDescription(m.subtitle, extra),
  };
}

export function buildBlogPostPageMetadata(
  locale: SupportedLocale,
  slug: string
): Metadata {
  const tr = getTranslation(locale);
  const blog = tr.blogPostPage;
  const hub = tr.marketingBlog;
  const title = titleFromBlogSlug(slug, blog.knownTitles);
  const excerpt = hub.posts.find((p) => p.slug === slug)?.excerpt;
  return {
    title,
    description: clipDescription(excerpt ?? blog.comingSoonBody),
  };
}

export function buildPrivacyPageMetadata(locale: SupportedLocale): Metadata {
  const p = getTranslation(locale).privacyPolicyPage;
  const first = p.sections[0]?.body?.[0] ?? '';
  return {
    title: `${p.title} ${p.highlight}`.trim(),
    description: clipDescription(first),
  };
}

export function buildTermsPageMetadata(locale: SupportedLocale): Metadata {
  const t = getTranslation(locale).termsPolicyPage;
  const first = t.sections[0]?.paragraphs[0] ?? '';
  return {
    title: `${t.title} ${t.highlight}`.trim(),
    description: clipDescription(first),
  };
}

export function buildRefundPageMetadata(locale: SupportedLocale): Metadata {
  const r = getTranslation(locale).refundPolicyPage;
  const first = clipDescription(
    r.guaranteeTitle,
    r.guaranteeBodyStart,
    r.guaranteeBodyStrong,
    r.guaranteeBodyEnd
  );
  return {
    title: `${r.title} ${r.highlight}`.trim(),
    description: first,
  };
}

export function buildDemoPageMetadata(locale: SupportedLocale): Metadata {
  const d = getTranslation(locale).demo;
  const extra = d.valuePointsList[0]?.description ?? '';
  return {
    title: d.hero.title,
    description: clipDescription(d.hero.subtitle, extra),
  };
}

export function buildContactPageMetadata(locale: SupportedLocale): Metadata {
  const c = getTranslation(locale).contact;
  return {
    title: c.title,
    description: clipDescription(c.subtitle, c.support.desc),
  };
}

/** `/contact` → 301 to `/contatti`; SEO consolidates on the canonical locale URL. */
export function buildContactAliasPageMetadata(locale: SupportedLocale): Metadata {
  const base = getBaseUrl();
  const inner = buildContactPageMetadata(locale);
  return {
    ...inner,
    alternates: { canonical: `${base}/contatti` },
  };
}

export function buildAuthLoginPageMetadata(locale: SupportedLocale): Metadata {
  const a = getTranslation(locale).auth.login;
  const base = getBaseUrl();
  return {
    title: a.title,
    description: clipDescription(a.subtitle, a.secureNote),
    alternates: { canonical: `${base}/auth/login` },
  };
}

export function buildAuthSignupPageMetadata(locale: SupportedLocale): Metadata {
  const s = getTranslation(locale).auth.signup;
  const base = getBaseUrl();
  return {
    title: s.title,
    description: clipDescription(s.subtitle, s.freePlanIncludes, s.noCreditCard),
    alternates: { canonical: `${base}/auth/signup` },
  };
}

export function buildPricingPageMetadata(locale: SupportedLocale): Metadata {
  const tr = getTranslation(locale);
  const fallback = getTranslation('en').landing!.pricingPage;
  const pp = tr.landing?.pricingPage ?? fallback;
  const title = `${pp.mainTitle} ${pp.mainTitle2}`.replace(/\s+/g, ' ').trim();
  return {
    title,
    description: clipDescription(pp.subtitle, pp.trustTrial, pp.trustCancel),
  };
}

/** `/docs` — hub title and subtitle from dictionary. */
export function buildDocsHubPageMetadata(locale: SupportedLocale): Metadata {
  const h = getTranslation(locale).docsHub;
  const base = getBaseUrl();
  return {
    title: h.pageTitle,
    description: clipDescription(h.pageSubtitle),
    alternates: { canonical: `${base}/docs` },
  };
}

/** `/docs/[slug]` — article title + first content line as description. */
export function buildDocArticlePageMetadata(
  locale: SupportedLocale,
  slug: string
): Metadata | null {
  const entry = docArticles[slug];
  if (!entry) return null;
  const slice = resolveDocArticle(entry, locale as Locale);
  if (!slice) return null;
  const base = getBaseUrl();
  const lead = firstMeaningfulLineFromDocBody(slice.content);
  return {
    title: slice.title,
    description: clipDescription(slice.title, lead),
    alternates: { canonical: `${base}/docs/${slug}` },
  };
}
