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
    <div className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />

      <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isItalian ? 'Torna al Blog' : 'Back to Blog'}
        </Link>

        <article className="diamond-card border border-white/[0.08] rounded-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-white/50 text-sm mt-2">
            {isItalian ? 'Articolo in arrivo. Resta sintonizzato!' : 'Article coming soon. Stay tuned!'}
          </p>
          <div className="mt-8 prose prose-invert max-w-none">
            <p className="text-white/70 leading-relaxed">
              {isItalian
                ? 'Questo articolo è in fase di preparazione. Torneremo presto con contenuti di valore per agenti immobiliari.'
                : 'This article is being prepared. We will be back soon with valuable content for real estate agents.'}
            </p>
          </div>
        </article>

        <div className="mt-8">
          <Link href="/blog">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              {isItalian ? 'Altri articoli' : 'More articles'}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
