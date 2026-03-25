import type { Metadata } from "next";
import { ContattiPageClient } from "@/components/contatti-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildContactPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildContactPageMetadata(locale as SupportedLocale);
}

export default function ContattiPage() {
  return <ContattiPageClient />;
}
