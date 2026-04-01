"use client";

import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { ArrowRight, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const { locale } = useLocaleContext();
  const isIt = locale === "it";

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 inset-x-0 z-50 pp-glass border-b border-border/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4 text-background" />
            </div>
            <span className="text-base font-semibold tracking-tight">PropertyPilot</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm h-9">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="text-sm h-9 bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {isIt ? "Blog PropertyPilot" : "PropertyPilot Blog"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isIt
              ? "Strategie, guide e insight per agenzie immobiliari che vogliono crescere con l'AI."
              : "Strategies, guides and insights for real estate agencies that want to grow with AI."}
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={"/blog/" + post.slug} className="block pp-card p-6 sm:p-8 hover-lift group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {isIt ? post.categoryIt : post.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime} min
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString(isIt ? "it-IT" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                {isIt ? post.titleIt : post.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {isIt ? post.excerptIt : post.excerpt}
              </p>
              <span className="text-sm font-medium text-primary flex items-center gap-1">
                {isIt ? "Leggi l'articolo" : "Read article"}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="pp-card p-8 sm:p-12 text-center bg-muted/30">
            <h2 className="text-2xl font-bold mb-3">
              {isIt ? "Pronto a provare PropertyPilot?" : "Ready to try PropertyPilot?"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isIt ? "Genera il tuo primo annuncio AI in meno di 30 secondi." : "Generate your first AI listing in under 30 seconds."}
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 rounded-xl">
                {isIt ? "Inizia gratis" : "Start free trial"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
