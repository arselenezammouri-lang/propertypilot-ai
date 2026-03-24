import type { Metadata } from "next";
import { MarketingHomePageClient } from "@/components/marketing-home-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildMarketingHomeMetadata } from "@/lib/i18n/root-site-metadata";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildMarketingHomeMetadata(locale as SupportedLocale);
}

export default function MarketingHomePage() {
  return <MarketingHomePageClient />;
}
