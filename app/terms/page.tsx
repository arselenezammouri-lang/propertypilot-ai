import type { Metadata } from "next";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { TermsPageContent } from "@/components/terms-page-content";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildTermsPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildTermsPageMetadata(locale as SupportedLocale);
}

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />
      <TermsPageContent />
    </main>
  );
}
