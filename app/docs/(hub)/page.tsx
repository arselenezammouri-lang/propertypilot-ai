import type { Metadata } from "next";
import { DocsHubPageClient } from "@/components/docs-hub-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildDocsHubPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildDocsHubPageMetadata(locale as SupportedLocale);
}

export default function DocumentationPage() {
  return <DocsHubPageClient />;
}
