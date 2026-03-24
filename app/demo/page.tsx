import type { Metadata } from "next";
import { DemoPageClient } from "@/components/demo-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildDemoPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildDemoPageMetadata(locale as SupportedLocale);
}

export default function DemoPage() {
  return <DemoPageClient />;
}
