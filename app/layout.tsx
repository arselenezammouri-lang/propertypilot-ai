import type { Metadata } from "next";
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
import { LocalizedErrorBoundary } from "@/components/error-boundary";
import { CommandPalette } from "@/components/command-palette";
import { DisableServiceWorker } from "@/components/disable-service-worker";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SkipToContent } from "@/components/skip-to-content";
import { HtmlLangDir } from "@/components/html-lang-dir";
import { getBaseUrl } from "@/lib/env";
import type { SupportedLocale } from "@/lib/i18n/dictionary";
import { getTranslation } from "@/lib/i18n/dictionary";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { SEO_APP_NAME, buildRootSiteMetadata } from "@/lib/i18n/root-site-metadata";

export const dynamic = 'force-dynamic';

const APP_URL = getBaseUrl();

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildRootSiteMetadata(locale as SupportedLocale);
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocaleFromCookies();
  const hero = getTranslation(locale as SupportedLocale).landing!.hero;
  const jsonLdDescription = `${hero.subtitle} ${hero.poweredBy}`.replace(/\s+/g, ' ').trim();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SEO_APP_NAME,
    description: jsonLdDescription,
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
      name: SEO_APP_NAME,
      url: APP_URL,
    },
    areaServed: ['United States', 'Canada', 'Italy', 'Spain', 'Portugal', 'France', 'United Kingdom', 'Germany'],
    availableLanguage: ['English', 'Italian', 'Spanish', 'Portuguese', 'French', 'German', 'Arabic'],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=typeof location!=='undefined'&&location.hostname;var l=h&&/^localhost$|^127\\.0\\.0\\.1$|^\\[::1\\]$|^::1$/i.test(h);if(!l||typeof navigator==='undefined'||!('serviceWorker'in navigator))return;navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister();});});if('caches'in window)caches.keys().then(function(k){k.forEach(function(n){caches.delete(n);});});})();`,
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
              <TooltipProvider delayDuration={300} skipDelayDuration={0}>
                <PerformanceMonitor />
                <DisableServiceWorker />
                <LocalizedErrorBoundary>
                  {children}
                </LocalizedErrorBoundary>
                <Toaster />
                <DemoModal />
                <CommandPalette />
              </TooltipProvider>
            </ThemeProvider>
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
