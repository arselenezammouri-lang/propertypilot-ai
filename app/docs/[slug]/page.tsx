"use client";

import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import { getTranslation, type SupportedLocale } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import { docArticles } from "@/lib/docs/doc-content";
import { resolveDocArticle } from "@/lib/docs/doc-article";

export default function DocArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { locale } = useLocale();
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug.join("/")
    : resolvedParams.slug;

  const article = resolveDocArticle(docArticles[slug], locale as Locale);
  const backLabel = getTranslation(locale as SupportedLocale).docsHub.backToDocs;

  if (!article) {
    notFound();
  }

  return (
    <main id="main-content" className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/docs">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Button>
        </Link>

        <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Book className="h-6 w-6 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">{article.title}</h1>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                {article.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
