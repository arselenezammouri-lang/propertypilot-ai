import { Metadata } from "next";
import NextDynamic from "next/dynamic";
import { DiamondPageHeader } from "@/components/diamond-page-header";

const BlogPageContent = NextDynamic(
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

export const metadata: Metadata = {
  title: "Blog | PropertyPilot AI",
  description: "Articoli, guide e risorse per agenti immobiliari. Tips AI, marketing e best practice.",
};

export default function BlogPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <DiamondPageHeader />
      <BlogPageContent />
    </main>
  );
}
