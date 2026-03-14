import { Metadata } from "next";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { RefundPageContent } from "@/components/refund-page-content";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Politica di Rimborso | PropertyPilot AI",
  description: "Informazioni sulla politica di rimborso e cancellazione abbonamenti di PropertyPilot AI.",
};

export default function RefundPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />
      <RefundPageContent />
    </main>
  );
}
