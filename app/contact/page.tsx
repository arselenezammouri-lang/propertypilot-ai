import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildContactAliasPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildContactAliasPageMetadata(locale as SupportedLocale);
}

export default function ContactPage() {
  redirect("/contatti");
}
