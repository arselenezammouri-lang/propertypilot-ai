import { Metadata } from "next";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { PrivacyPageContent } from "@/components/privacy-page-content";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Privacy Policy | PropertyPilot AI",
  description: "Informativa sulla privacy e protezione dei dati personali di PropertyPilot AI. Scopri come trattiamo i tuoi dati.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <DiamondPageHeader />
      <PrivacyPageContent />
    </main>
  );
}
