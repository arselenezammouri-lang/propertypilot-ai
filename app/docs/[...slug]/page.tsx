import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocArticlePageClient } from "@/components/doc-article-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildDocArticlePageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";
import { docArticles } from "@/lib/docs/doc-content";

function slugFromParams(slug: string | string[]): string {
  return Array.isArray(slug) ? slug.join("/") : slug;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug: slugSegments } = await params;
  const slug = slugFromParams(slugSegments);
  const locale = await getServerLocaleFromCookies();
  const meta = buildDocArticlePageMetadata(locale as SupportedLocale, slug);
  if (!meta) notFound();
  return meta;
}

export default async function DocArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: slugSegments } = await params;
  const slug = slugFromParams(slugSegments);
  if (!docArticles[slug]) {
    notFound();
  }
  return <DocArticlePageClient docSlug={slug} />;
}
