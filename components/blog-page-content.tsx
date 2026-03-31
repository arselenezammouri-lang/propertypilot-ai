"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { FileText, ArrowRight } from "lucide-react";

export function BlogPageContent() {
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";

  const posts = isItalian
    ? [
        {
          slug: "come-scrivere-annunci-che-convertono",
          title: "Come scrivere annunci che convertono",
          excerpt: "5 regole d'oro per annunci immobiliari che generano contatti.",
          date: "2024-12",
        },
        {
          slug: "ai-per-agenzie-immobiliari",
          title: "AI per agenzie immobiliari: guida pratica",
          excerpt: "Come integrare l'intelligenza artificiale nel tuo flusso di lavoro.",
          date: "2024-11",
        },
        {
          slug: "crm-immobiliare-automatizzato",
          title: "CRM immobiliare automatizzato",
          excerpt: "Riduci il lavoro manuale e non perdere mai un lead.",
          date: "2024-10",
        },
      ]
    : [
        {
          slug: "come-scrivere-annunci-che-convertono",
          title: "How to write listings that convert",
          excerpt: "5 golden rules for property listings that generate leads.",
          date: "2024-12",
        },
        {
          slug: "ai-per-agenzie-immobiliari",
          title: "AI for real estate agencies: practical guide",
          excerpt: "How to integrate artificial intelligence into your daily workflow.",
          date: "2024-11",
        },
        {
          slug: "crm-immobiliare-automatizzato",
          title: "Automated real estate CRM",
          excerpt: "Reduce manual work and never lose a lead again.",
          date: "2024-10",
        },
      ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#9333ea]/50 bg-[#9333ea]/10 flex items-center justify-center">
            <FileText className="h-7 w-7 text-[#9333ea]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Blog <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">PropertyPilot AI</span>
            </h1>
            <p className="text-foreground/60 mt-1">
              {isItalian ? "Guide, tips e risorse per agenti immobiliari" : "Guides, tips, and resources for real estate agents"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block pp-card border border-border rounded-xl p-6 hover:border-border transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-[#9333ea] transition-colors">
                  {post.title}
                </h2>
                <p className="text-foreground/60 text-sm mt-2">{post.excerpt}</p>
                <span className="text-foreground/40 text-xs mt-2 block">{post.date}</span>
              </div>
              <ArrowRight className="h-5 w-5 text-foreground/40 group-hover:text-[#9333ea] shrink-0" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-foreground/50 text-sm">
          {isItalian ? "Altri articoli in arrivo. Resta sintonizzato!" : "More articles are coming soon. Stay tuned!"}
        </p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted/30 mt-4">
            {isItalian ? "Torna alla Home" : "Back to Home"}
          </Button>
        </Link>
      </div>
    </main>
  );
}
