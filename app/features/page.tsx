import { Metadata } from "next";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { FeaturesPageContent } from "@/components/features-page-content";

export const metadata: Metadata = {
  title: "Features | PropertyPilot AI",
  description: "Scopri tutte le funzionalità AI di PropertyPilot AI: generazione annunci, CRM, compliance, traduzioni e altro.",
};

export default function FeaturesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <DiamondPageHeader />
      <FeaturesPageContent />
    </main>
  );
}
