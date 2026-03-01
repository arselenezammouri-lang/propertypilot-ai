import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiamondPageHeader } from "@/components/diamond-page-header";
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

export const metadata: Metadata = {
  title: "Features | PropertyPilot AI",
  description: "Scopri tutte le funzionalità AI di PropertyPilot AI: generazione annunci, CRM, compliance, traduzioni e altro.",
};

const features = [
  { icon: Sparkles, title: "Generazione Annunci AI", desc: "Crea annunci immobiliari persuasivi in secondi. Copy ottimizzato e descrizioni che convertono." },
  { icon: FileText, title: "Perfect Copy & Emotional Listing", desc: "Descrizioni che evocano emozioni e vendono. Stile professionale con call-to-action efficaci." },
  { icon: Globe, title: "Traduzioni Multi-lingua", desc: "Traduci annunci in 7+ lingue mantenendo tono e persuasività. Perfetto per mercati internazionali." },
  { icon: BarChart3, title: "Audit Annunci", desc: "Analisi AI del tuo annuncio: punteggio qualità, suggerimenti di miglioramento e best practice." },
  { icon: Bot, title: "Aria Assistant", desc: "Assistente vocale AI che guida agenti e team. Consigli in tempo reale e supporto operativo." },
  { icon: Users, title: "CRM & Lead Management", desc: "Gestione lead integrata, pipeline Kanban, automazioni e scoring per non perdere nessun contatto." },
  { icon: Building2, title: "Prospecting & Scraper", desc: "Trova proprietari da reclamizzare. Scraping intelligente e outreach automatizzato." },
  { icon: Shield, title: "Compliance Center", desc: "Documenti legali pre-compilati, GDPR, DPA. Mantieni la tua agenzia conforme e protetta." },
  { icon: Target, title: "Lead Scoring", desc: "Prioritizza i lead migliori con punteggio AI. Focus su chi converte davvero." },
  { icon: MessageCircle, title: "Follow-up Automatici", desc: "Email di follow-up personalizzate e sequenze automatiche per massimizzare le conversioni." },
  { icon: Brain, title: "Agency Assistant", desc: "Strategie AI per agenzie. Pianificazione, best practice e ottimizzazione processi." },
  { icon: Search, title: "Map Prospecting", desc: "Visualizza e analizza proprietà su mappa. Identifica opportunità nel tuo territorio." },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white diamond-force-black">
      <DiamondPageHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl border border-[#9333ea]/50 bg-[#9333ea]/10 flex items-center justify-center">
              <Zap className="h-7 w-7 text-[#9333ea]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Features <span className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] bg-clip-text text-transparent">PropertyPilot AI</span>
              </h1>
              <p className="text-white/60 mt-1">Tutte le funzionalità AI per far crescere la tua agenzia</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <div key={i} className="diamond-card border border-white/[0.08] rounded-xl p-6 hover:border-white/15 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5 text-[#9333ea]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{f.title}</h2>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-[#9333ea] to-[#06b6d4] border border-white/10">
              Vedi i piani
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
