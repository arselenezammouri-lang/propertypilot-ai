"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Building2, ArrowRight } from "lucide-react";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog-data";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const { locale } = useLocaleContext();
  const isIt = locale === "it";

  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isIt ? "Articolo non trovato" : "Article not found"}
          </h1>
          <Link href="/blog">
            <Button variant="outline">{isIt ? "Torna al blog" : "Back to blog"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = isIt ? post.titleIt : post.title;
  const content = isIt ? post.contentIt : post.content;
  const category = isIt ? post.categoryIt : post.category;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 pp-glass border-b border-border/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4 text-background" />
            </div>
            <span className="text-base font-semibold tracking-tight">PropertyPilot</span>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="text-sm h-9 bg-foreground text-background hover:bg-foreground/90 rounded-lg">
              Get started free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {isIt ? "Torna al Blog" : "Back to Blog"}
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(post.date).toLocaleDateString(isIt ? "it-IT" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 leading-tight">
            {title}
          </h1>

          {/* Render markdown-like content */}
          <div className="prose prose-lg max-w-none">
            {content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-bold mt-10 mb-4 text-foreground">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("**") && block.endsWith("**")) {
                return (
                  <p key={i} className="font-semibold text-foreground mb-4">
                    {block.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (block.startsWith("- ")) {
                return (
                  <ul key={i} className="space-y-2 mb-6 ml-4">
                    {block.split("\n").map((line, j) => (
                      <li key={j} className="text-foreground/80 leading-relaxed flex items-start gap-2">
                        <span className="text-primary mt-1.5 text-xs">●</span>
                        <span>{line.replace(/^- /, "")}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.startsWith("1. ")) {
                return (
                  <ol key={i} className="space-y-2 mb-6 ml-4 list-decimal list-inside">
                    {block.split("\n").map((line, j) => (
                      <li key={j} className="text-foreground/80 leading-relaxed">
                        {line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                      </li>
                    ))}
                  </ol>
                );
              }
              // Bold within paragraphs
              const parts = block.split(/(\*\*.*?\*\*)/);
              return (
                <p key={i} className="text-foreground/80 leading-relaxed mb-4">
                  {parts.map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={j} className="text-foreground font-semibold">
                        {part.replace(/\*\*/g, "")}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </p>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 pp-card p-8 text-center bg-muted/30">
            <h3 className="text-xl font-bold mb-2">
              {isIt ? "Pronto a provare?" : "Ready to try it?"}
            </h3>
            <p className="text-muted-foreground mb-5">
              {isIt
                ? "Genera il tuo primo annuncio AI in meno di 30 secondi."
                : "Generate your first AI listing in under 30 seconds."}
            </p>
            <Link href="/auth/signup">
              <Button className="h-11 px-6 bg-foreground text-background hover:bg-foreground/90 rounded-xl">
                {isIt ? "Inizia gratis" : "Start free trial"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* More articles */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">
              {isIt ? "Altri articoli" : "More articles"}
            </h3>
            <div className="space-y-3">
              {BLOG_POSTS.filter((p) => p.slug !== slug)
                .slice(0, 2)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={"/blog/" + p.slug}
                    className="block pp-card p-4 hover-lift group"
                  >
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {isIt ? p.titleIt : p.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isIt ? p.excerptIt : p.excerpt}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
