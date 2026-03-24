import type { Metadata } from "next";
import { CompliancePageClient } from "@/components/compliance-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildCompliancePageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildCompliancePageMetadata(locale as SupportedLocale);
}

export default function CompliancePage() {
  return <CompliancePageClient />;
}
