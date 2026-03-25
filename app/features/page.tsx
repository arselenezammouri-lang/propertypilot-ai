import type { Metadata } from "next";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { FeaturesPageContent } from "@/components/features-page-content";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildFeaturesPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildFeaturesPageMetadata(locale as SupportedLocale);
}

export default function FeaturesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />
      <FeaturesPageContent />
    </main>
  );
}
