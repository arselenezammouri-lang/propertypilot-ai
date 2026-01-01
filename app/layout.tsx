import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { DemoModal } from "@/components/demo-modal";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://propertypilotai.replit.app';
const APP_NAME = 'PropertyPilot AI';
const APP_DESCRIPTION = 'The AI Operating System for Real Estate Agencies. Close more deals, write better listings, and automate follow-ups. Built for agents and teams in the US, Europe, and beyond.';
const SUPPORT_EMAIL = 'support@propertypilotai.com';
const SALES_EMAIL = 'sales@propertypilotai.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - AI Operating System for Real Estate`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
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
    // google: 'your-google-verification-code', // Aggiungi dopo Google Search Console setup
    // yandex: 'your-yandex-verification-code',
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
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          suppressHydrationWarning
        />
        <link rel="canonical" href={APP_URL} />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            defaultTheme="light"
            storageKey="propertypilot-theme"
          >
            {children}
            <Toaster />
            <DemoModal />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
