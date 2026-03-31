"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import { Heart, Target, Zap, Globe, Shield } from "lucide-react";

export function AboutPageContent() {
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";

  const copy = isItalian
    ? {
        title: "Chi siamo",
        subtitle: "La nostra missione: potenziare le agenzie con l'intelligenza artificiale",
        missionTitle: "La nostra missione",
        missionBody:
          "PropertyPilot AI nasce per dare a ogni agenzia immobiliare gli strumenti AI che prima erano riservati solo ai grandi player. Vogliamo che agenti e team possano competere sul mercato con annunci persuasivi, CRM intelligenti e automazioni che risparmiano ore di lavoro.",
        whatTitle: "Cosa facciamo",
        whatBody:
          "Generazione annunci AI, audit listing, traduzioni multi-lingua, CRM integrato, prospecting, compliance GDPR e molto altro. Tutto in un'unica piattaforma pensata per il mercato immobiliare italiano e internazionale.",
        marketsTitle: "Mercati",
        marketsBody:
          "Siamo attivi in Italia, USA, Spagna e altri mercati. Supportiamo 7+ lingue e multiple valute per agenti che operano a livello locale e internazionale.",
        securityTitle: "Privacy e Sicurezza",
        securityBody:
          "I tuoi dati sono al sicuro. Conformita GDPR, crittografia end-to-end e infrastruttura enterprise.",
        privacyLink: "Privacy Policy",
        contact: "Contattaci",
        home: "Torna alla Home",
      }
    : {
        title: "About",
        subtitle: "Our mission: empower agencies with artificial intelligence",
        missionTitle: "Our mission",
        missionBody:
          "PropertyPilot AI was built to give every real estate agency access to AI tools that were once reserved for large players only. We want agents and teams to compete with persuasive listings, intelligent CRM workflows, and automations that save hours of work.",
        whatTitle: "What we do",
        whatBody:
          "AI listing generation, listing audits, multi-language translations, integrated CRM, prospecting, GDPR compliance, and more. Everything in one platform built for both local and international real estate markets.",
        marketsTitle: "Markets",
        marketsBody:
          "We are active in Italy, the USA, Spain, and other markets. We support 7+ languages and multiple currencies for agents working locally and internationally.",
        securityTitle: "Privacy and Security",
        securityBody:
          "Your data stays protected. GDPR compliance, end-to-end encryption, and enterprise-grade infrastructure.",
        privacyLink: "Privacy Policy",
        contact: "Contact us",
        home: "Back to Home",
      };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-primary/30 bg-primary/10 flex items-center justify-center">
            <Heart className="h-7 w-7 text-[#06b6d4]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {copy.title} <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">PropertyPilot AI</span>
            </h1>
            <p className="text-foreground/60 mt-1">{copy.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section className="pp-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#9333ea]" />
            {copy.missionTitle}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{copy.missionBody}</p>
        </section>

        <section className="pp-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#06b6d4]" />
            {copy.whatTitle}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{copy.whatBody}</p>
        </section>

        <section className="pp-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#9333ea]" />
            {copy.marketsTitle}
          </h2>
          <p className="text-foreground/70 leading-relaxed">{copy.marketsBody}</p>
        </section>

        <section className="pp-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#06b6d4]" />
            {copy.securityTitle}
          </h2>
          <p className="text-foreground/70 leading-relaxed">
            {copy.securityBody}{" "}
            <Link href="/privacy" className="text-[#9333ea] hover:text-[#a855f7] underline">
              {copy.privacyLink}
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/contatti">
          <Button className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] border border-border">
            {copy.contact}
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted/30">
            {copy.home}
          </Button>
        </Link>
      </div>
    </main>
  );
}
