"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { locale } = useLocale();
  const isItalian = locale === 'it';

  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DiamondPageHeader />

      <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isItalian ? 'Torna al Blog' : 'Back to Blog'}
        </Link>

        <article className="pp-card border border-border rounded-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isItalian ? 'Articolo in arrivo. Resta sintonizzato!' : 'Article coming soon. Stay tuned!'}
          </p>
          <div className="mt-8 prose prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed">
              {isItalian
                ? 'Questo articolo è in fase di preparazione. Torneremo presto con contenuti di valore per agenti immobiliari.'
                : 'This article is being prepared. We will be back soon with valuable content for real estate agents.'}
            </p>
          </div>
        </article>

        <div className="mt-8">
          <Link href="/blog">
            <Button variant="outline" className="border-border text-white hover:bg-muted">
              {isItalian ? 'Altri articoli' : 'More articles'}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
