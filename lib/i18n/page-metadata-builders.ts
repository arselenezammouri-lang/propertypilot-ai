import type { Metadata } from 'next';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';

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
