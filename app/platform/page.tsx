import type { Metadata } from "next";
import { PlatformPageClient } from "@/components/platform-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildPlatformPageMetadata } from "@/lib/i18n/root-site-metadata";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildPlatformPageMetadata(locale as SupportedLocale);
}

export default function PlatformPage() {
  return <PlatformPageClient />;
}
