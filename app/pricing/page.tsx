import type { Metadata } from "next";
import { PricingPageClient } from "@/components/pricing-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildPricingPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildPricingPageMetadata(locale as SupportedLocale);
}

export default function PricingPage() {
  return <PricingPageClient />;
}
