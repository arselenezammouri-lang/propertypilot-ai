import type { Metadata } from 'next';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import { titleFromBlogSlug } from '@/lib/i18n/blog-post-slug';

const MAX_DESC = 158;

function clipDescription(...parts: string[]): string {
  const s = parts
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (s.length <= MAX_DESC) return s;
  return `${s.slice(0, MAX_DESC - 1)}…`;
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
