import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiamondPageHeader } from "@/components/diamond-page-header";
import { Heart, Target, Zap, Globe, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | PropertyPilot AI",
  description: "Scopri la missione di PropertyPilot AI: potenziare le agenzie immobiliari con l'AI.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl border border-[#06b6d4]/50 bg-[#06b6d4]/10 flex items-center justify-center">
              <Heart className="h-7 w-7 text-[#06b6d4]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Chi siamo <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">PropertyPilot AI</span>
              </h1>
              <p className="text-white/60 mt-1">La nostra missione: potenziare le agenzie con l&apos;intelligenza artificiale</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="diamond-card border border-white/[0.08] rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-[#9333ea]" />
              La nostra missione
            </h2>
            <p className="text-white/70 leading-relaxed">
              PropertyPilot AI nasce per dare a ogni agenzia immobiliare gli strumenti AI che prima erano riservati solo ai grandi player.
              Vogliamo che agenti e team possano competere sul mercato con annunci persuasivi, CRM intelligenti e automazioni che risparmiano ore di lavoro.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#06b6d4]" />
              Cosa facciamo
            </h2>
            <p className="text-white/70 leading-relaxed">
              Generazione annunci AI, audit listing, traduzioni multi-lingua, CRM integrato, prospecting, compliance GDPR e molto altro.
              Tutto in un&apos;unica piattaforma pensata per il mercato immobiliare italiano e internazionale.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#9333ea]" />
              Mercati
            </h2>
            <p className="text-white/70 leading-relaxed">
              Siamo attivi in Italia, USA, Spagna e altri mercati. Supportiamo 7+ lingue e multiple valute per agenti che operano a livello locale e internazionale.
            </p>
          </section>

          <section className="diamond-card border border-white/[0.08] rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#06b6d4]" />
              Privacy e Sicurezza
            </h2>
            <p className="text-white/70 leading-relaxed">
              I tuoi dati sono al sicuro. Conformità GDPR, crittografia end-to-end e infrastruttura enterprise.
              Leggi la nostra <Link href="/privacy" className="text-[#9333ea] hover:text-[#a855f7] underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] border border-white/10">
              Contattaci
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              Torna alla Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
