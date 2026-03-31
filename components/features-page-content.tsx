"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale as useLocaleContext } from "@/lib/i18n/locale-context";
import {
  Sparkles,
  FileText,
  Zap,
  Globe,
  BarChart3,
  Shield,
  Bot,
  Users,
  Building2,
  Target,
  MessageCircle,
  Brain,
  Search,
} from "lucide-react";

const featureIcons = [
  Sparkles,
  FileText,
  Globe,
  BarChart3,
  Bot,
  Users,
  Building2,
  Shield,
  Target,
  MessageCircle,
  Brain,
  Search,
];

export function FeaturesPageContent() {
  const { locale } = useLocaleContext();
  const isItalian = locale === "it";

  const features = isItalian
    ? [
        { title: "Generazione Annunci AI", desc: "Crea annunci immobiliari persuasivi in secondi. Copy ottimizzato e descrizioni che convertono." },
        { title: "Perfect Copy & Emotional Listing", desc: "Descrizioni che evocano emozioni e vendono. Stile professionale con call-to-action efficaci." },
        { title: "Traduzioni Multi-lingua", desc: "Traduci annunci in 7+ lingue mantenendo tono e persuasività. Perfetto per mercati internazionali." },
        { title: "Audit Annunci", desc: "Analisi AI del tuo annuncio: punteggio qualità, suggerimenti di miglioramento e best practice." },
        { title: "Aria Assistant", desc: "Assistente vocale AI che guida agenti e team. Consigli in tempo reale e supporto operativo." },
        { title: "CRM & Lead Management", desc: "Gestione lead integrata, pipeline Kanban, automazioni e scoring per non perdere nessun contatto." },
        { title: "Prospecting & Scraper", desc: "Trova proprietari da reclamizzare. Scraping intelligente e outreach automatizzato." },
        { title: "Compliance Center", desc: "Documenti legali pre-compilati, GDPR, DPA. Mantieni la tua agenzia conforme e protetta." },
        { title: "Lead Scoring", desc: "Prioritizza i lead migliori con punteggio AI. Focus su chi converte davvero." },
        { title: "Follow-up Automatici", desc: "Email di follow-up personalizzate e sequenze automatiche per massimizzare le conversioni." },
        { title: "Agency Assistant", desc: "Strategie AI per agenzie. Pianificazione, best practice e ottimizzazione processi." },
        { title: "Map Prospecting", desc: "Visualizza e analizza proprietà su mappa. Identifica opportunità nel tuo territorio." },
      ]
    : [
        { title: "AI Listing Generation", desc: "Create persuasive property listings in seconds with optimized copy that converts." },
        { title: "Perfect Copy & Emotional Listing", desc: "Descriptions that create emotion and sell, with professional tone and effective calls to action." },
        { title: "Multi-language Translations", desc: "Translate listings into 7+ languages while preserving tone and persuasiveness for international markets." },
        { title: "Listing Audit", desc: "AI analysis of your listing with quality score, improvement suggestions, and best practices." },
        { title: "Aria Assistant", desc: "AI voice assistant that guides agents and teams with real-time advice and operational support." },
        { title: "CRM & Lead Management", desc: "Integrated lead management, Kanban pipeline, automations, and scoring so you never lose a contact." },
        { title: "Prospecting & Scraper", desc: "Find owners to target with smart scraping and automated outreach." },
        { title: "Compliance Center", desc: "Pre-filled legal documents, GDPR, and DPA tools to keep your agency compliant and protected." },
        { title: "Lead Scoring", desc: "Prioritize the best leads with AI scoring and focus on the contacts most likely to convert." },
        { title: "Automated Follow-ups", desc: "Personalized follow-up emails and automated sequences to maximize conversions." },
        { title: "Agency Assistant", desc: "AI strategies for agencies: planning, best practices, and process optimization." },
        { title: "Map Prospecting", desc: "View and analyze properties on a map to identify opportunities in your territory." },
      ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#9333ea]/50 bg-[#9333ea]/10 flex items-center justify-center">
            <Zap className="h-7 w-7 text-[#9333ea]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {isItalian ? "Funzionalità" : "Features"}{" "}
              <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">PropertyPilot AI</span>
            </h1>
            <p className="text-foreground/60 mt-1">
              {isItalian
                ? "Tutte le funzionalità AI per far crescere la tua agenzia"
                : "All the AI capabilities to grow your agency"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((feature, i) => {
          const Icon = featureIcons[i] ?? Sparkles;
          return (
            <div key={i} className="pp-card border border-border rounded-xl p-6 hover:border-border transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg border border-border bg-muted/30 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[#9333ea]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{feature.title}</h2>
                  <p className="text-foreground/60 text-sm mt-2 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] border border-border">
            {isItalian ? "Vedi i piani" : "View pricing"}
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted/30">
            {isItalian ? "Torna alla Home" : "Back to Home"}
          </Button>
        </Link>
      </div>
    </main>
  );
}
