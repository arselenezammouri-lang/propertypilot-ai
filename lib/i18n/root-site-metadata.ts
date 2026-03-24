import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getTranslation, type SupportedLocale } from '@/lib/i18n/dictionary';
import { getBaseUrl } from '@/lib/env';
import { clipMetaDescription } from '@/lib/i18n/page-metadata-builders';
import { OG_LOCALE } from '@/lib/i18n/seo-open-graph-locale';

export const SEO_APP_NAME = 'PropertyPilot AI';

/** Default site keywords (EN-oriented; stable for crawlers). */
export const SEO_KEYWORDS = [
  'AI Real Estate Operating System',
  'Zillow Voice AI automation',
  'Idealista Prospecting AI',
  'real estate AI',
  'property listing generator',
  'real estate CRM',
  'AI listing writer',
  'MLS listing generator',
  'Zillow listing AI',
  'real estate automation',
  'lead management software',
  'PropertyPilot AI',
  'real estate marketing',
  'property description generator',
  'real estate agents tools',
  'immobiliare AI',
  'Idealista',
  'AI real estate agent',
  'automated property descriptions',
  'real estate lead scoring',
  'AI property valuation',
  'real estate voice AI',
  'property AI assistant',
  'Casa.it AI',
  'Subito.it automation',
  'Redfin AI tools',
  'Realtor.com automation',
] as const;

const LOCALES: Locale[] = ['it', 'en', 'es', 'fr', 'de', 'ar', 'pt'];

/**
 * Root layout metadata: title template, default title, description, OG/Twitter from `landing` copy.
 */
export function buildRootSiteMetadata(locale: SupportedLocale): Metadata {
  const APP_URL = getBaseUrl();
  const tr = getTranslation(locale);
  const L = tr.landing!;
  const h = L.hero;
  const defaultTitle = `${h.titlePart1} ${h.titlePart2} ${h.titleAI}`.replace(/\s+/g, ' ').trim();
  const description = clipMetaDescription(h.subtitle, h.poweredBy);
  const ogTitle = `${SEO_APP_NAME} — ${defaultTitle}`;
  const ogAlt = `${SEO_APP_NAME} — ${L.nav.tagline}`;

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: `${defaultTitle} | ${SEO_APP_NAME}`,
      template: `%s | ${SEO_APP_NAME}`,
    },
    description,
    keywords: [...SEO_KEYWORDS],
    authors: [{ name: SEO_APP_NAME, url: APP_URL }],
    creator: SEO_APP_NAME,
    publisher: SEO_APP_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale as Locale],
      url: APP_URL,
      title: ogTitle,
      description,
      siteName: SEO_APP_NAME,
      images: [
        {
          url: `${APP_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      creator: '@PropertyPilotAI',
      images: [`${APP_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: APP_URL,
      languages: Object.fromEntries(LOCALES.map((l) => [l, APP_URL])) as Record<string, string>,
    },
  };
}

export function buildMarketingHomeMetadata(locale: SupportedLocale): Metadata {
  const tr = getTranslation(locale);
  const h = tr.landing!.hero;
  const titleSegment = `${h.titlePart1} ${h.titlePart2} ${h.titleAI}`.replace(/\s+/g, ' ').trim();
  return {
    title: titleSegment,
    description: clipMetaDescription(h.subtitle, h.poweredBy, tr.landing!.nav.tagline),
  };
}
