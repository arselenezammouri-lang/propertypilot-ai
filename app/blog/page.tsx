import { Metadata } from "next";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { BlogPageContent } from "@/components/blog-page-content";

export const metadata: Metadata = {
  title: "Blog | PropertyPilot AI",
  description: "Articoli, guide e risorse per agenti immobiliari. Tips AI, marketing e best practice.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />
      <BlogPageContent />
    </div>
  );
}
