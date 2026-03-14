import { Metadata } from "next";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { AboutPageContent } from "@/components/about-page-content";

export const metadata: Metadata = {
  title: "About Us | PropertyPilot AI",
  description: "Scopri la missione di PropertyPilot AI: potenziare le agenzie immobiliari con l'AI.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />
      <AboutPageContent />
    </main>
  );
}
