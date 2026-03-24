import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildBlogIndexMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";

const BlogPageContent = dynamic(
  () => import("@/components/blog-page-content").then((m) => ({ default: m.BlogPageContent })),
  {
    ssr: true,
    loading: () => (
      <div className="container mx-auto max-w-4xl px-4 py-16 animate-pulse">
        <div className="h-10 bg-white/10 rounded w-3/4 mb-8" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/10 rounded" />
          ))}
        </div>
      </div>
    ),
  }
);

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocaleFromCookies();
  return buildBlogIndexMetadata(locale as SupportedLocale);
}

export default function BlogPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />
      <BlogPageContent />
    </main>
  );
}
