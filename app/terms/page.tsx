import { Metadata } from "next";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { TermsPageContent } from "@/components/terms-page-content";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Termini e Condizioni | PropertyPilot AI",
  description: "Leggi i termini e le condizioni d'uso di PropertyPilot AI, la piattaforma AI per professionisti immobiliari.",
};

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />
      <TermsPageContent />
    </main>
  );
}
