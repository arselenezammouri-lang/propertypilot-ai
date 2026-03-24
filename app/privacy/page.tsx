import type { Metadata } from "next";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { PrivacyPageContent } from "@/components/privacy-page-content";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildPrivacyPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildPrivacyPageMetadata(locale as SupportedLocale);
}

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />
      <PrivacyPageContent />
    </main>
  );
}
