import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "../styles/design-system.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { DemoModal } from "@/components/demo-modal";
import { PerformanceMonitor } from "@/components/performance-monitor";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { CommandPalette } from "@/components/command-palette";
import { DisableServiceWorker } from "@/components/disable-service-worker";
import { SkipToContent } from "@/components/skip-to-content";
import { HtmlLangDir } from "@/components/html-lang-dir";
import type { Locale } from "@/lib/i18n/config";
import { getBaseUrl } from "@/lib/env";

export const dynamic = 'force-dynamic';

const LOCALE_TO_OG: Record<Locale, string> = {
  it: 'it_IT',
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  ar: 'ar_AE',
  pt: 'pt_PT',
};

const LOCALES: Locale[] = ['it', 'en', 'es', 'fr', 'de', 'ar', 'pt'];

const APP_URL = getBaseUrl();
const APP_NAME = 'PropertyPilot AI';
const APP_DESCRIPTION = 'The AI Operating System for Real Estate Agencies. Close more deals, write better listings, and automate follow-ups. Built for agents and teams in the US, Europe, and beyond.';
const SUPPORT_EMAIL = 'support@propertypilotai.com';
const SALES_EMAIL = 'sales@propertypilotai.com';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('propertypilot_locale')?.value;
  const locale: Locale = localeCookie && LOCALES.includes(localeCookie as Locale) ? (localeCookie as Locale) : 'en';
  const ogLocale = LOCALE_TO_OG[locale];

  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: `${APP_NAME} - The Real Estate Operating System | AI-Powered Property Platform`,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    keywords: [
      "AI Real Estate Operating System",
      "Zillow Voice AI automation",
      "Idealista Prospecting AI",
      "real estate AI",
      "property listing generator",
      "real estate CRM",
      "AI listing writer",
      "MLS listing generator",
      "Zillow listing AI",
      "real estate automation",
      "lead management software",
      "PropertyPilot AI",
      "real estate marketing",
      "property description generator",
      "real estate agents tools",
      "immobiliare AI",
      "Idealista",
      "AI real estate agent",
      "automated property descriptions",
      "real estate lead scoring",
      "AI property valuation",
      "real estate voice AI",
      "property AI assistant",
      "Casa.it AI",
      "Subito.it automation",
      "Redfin AI tools",
      "Realtor.com automation",
    ],
    authors: [{ name: APP_NAME, url: APP_URL }],
    creator: APP_NAME,
    publisher: APP_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: APP_URL,
      title: `${APP_NAME} - AI Operating System for Real Estate`,
      description: APP_DESCRIPTION,
      siteName: APP_NAME,
      images: [
        {
          url: `${APP_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${APP_NAME} - AI for Real Estate Agencies`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${APP_NAME} - AI Operating System for Real Estate`,
      description: APP_DESCRIPTION,
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '0',
      highPrice: '497',
      offerCount: '4',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: APP_NAME,
      url: APP_URL,
    },
    areaServed: ['United States', 'Canada', 'Italy', 'Spain', 'Portugal', 'France', 'United Kingdom', 'Germany'],
    availableLanguage: ['English', 'Italian', 'Spanish', 'Portuguese', 'French', 'German'],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=typeof location!=='undefined'&&location.hostname;var l=h&&/^localhost$|^127\\.0\\.0\\.1$|^\\[::1\\]$/.test(h);if(!l||typeof navigator==='undefined'||!('serviceWorker'in navigator))return;navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister();});});if('caches'in window)caches.keys().then(function(k){k.forEach(function(n){caches.delete(n);});});})();`,
          }}
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {process.env.NODE_ENV === 'production' ? (
          <link rel="manifest" href="/manifest.json" />
        ) : null}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PropertyPilot" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          suppressHydrationWarning
        />
        <link rel="canonical" href={APP_URL} />
      </head>
      <body suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} font-sans diamond-force-black diamond-force-white-text antialiased`}>
        <SkipToContent />
        <HtmlLangDir />
        <Providers>
          <LocaleProvider>
            <ThemeProvider
              defaultTheme="dark"
              storageKey="propertypilot-theme"
            >
              <PerformanceMonitor />
              <DisableServiceWorker />
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
              <Toaster />
              <DemoModal />
              <CommandPalette />
            </ThemeProvider>
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
