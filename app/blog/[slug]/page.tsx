import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPageClient } from "@/components/blog-post-page-client";
import { getServerLocaleFromCookies } from "@/lib/i18n/server-locale";
import { buildBlogPostPageMetadata } from "@/lib/i18n/page-metadata-builders";
import type { SupportedLocale } from "@/lib/i18n/dictionary";
import { getTranslation } from "@/lib/i18n/dictionary";

function validBlogSlugs(): Set<string> {
  return new Set(getTranslation("en").marketingBlog.posts.map((p) => p.slug));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!validBlogSlugs().has(slug)) {
    notFound();
  }
  const locale = await getServerLocaleFromCookies();
  return buildBlogPostPageMetadata(locale as SupportedLocale, slug);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!validBlogSlugs().has(slug)) {
    notFound();
  }
  return <BlogPostPageClient slug={slug} />;
}
