import type { Metadata } from "next";
import { DevTestErrorPageClient } from "@/components/dev-test-error-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildDevTestErrorPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildDevTestErrorPageMetadata(locale as SupportedLocale);
}

export default function TestErrorPage() {
  return <DevTestErrorPageClient />;
}
