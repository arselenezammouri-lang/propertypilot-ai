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

export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://propertypilot-ai.vercel.app';
const APP_NAME = 'PropertyPilot AI';
const APP_DESCRIPTION = 'The AI Operating System for Real Estate Agencies. Close more deals, write better listings, and automate follow-ups. Built for agents and teams in the US, Europe, and beyond.';
const SUPPORT_EMAIL = 'support@propertypilotai.com';
const SALES_EMAIL = 'sales@propertypilotai.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
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
    locale: 'en_US',
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
  },
};

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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
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
        <Providers>
          <LocaleProvider>
            <ThemeProvider
              defaultTheme="dark"
              storageKey="propertypilot-theme"
              suppressHydrationWarning
            >
              <PerformanceMonitor />
              {children}
              <Toaster />
              <DemoModal />
            </ThemeProvider>
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
