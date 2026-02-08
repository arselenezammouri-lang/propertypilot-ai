"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Book, Zap, Phone, Box, Target, Building2, Map, FileText, Sparkles, TrendingDown, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  articles: Array<{
    id: string;
    title: string;
    description: string;
    slug: string;
  }>;
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Book className="h-5 w-5" />,
    articles: [
      {
        id: 'welcome',
        title: 'Benvenuto in PropertyPilot AI',
        description: 'Guida introduttiva alla piattaforma',
        slug: 'getting-started/welcome',
      },
      {
        id: 'first-listing',
        title: 'Crea il tuo primo annuncio',
        description: 'Genera un annuncio AI in 2 minuti',
        slug: 'getting-started/first-listing',
      },
      {
        id: 'workspace-setup',
        title: 'Configura il tuo Workspace',
        description: 'Personalizza la dashboard',
        slug: 'getting-started/workspace-setup',
      },
    ],
  },
  {
    id: 'prospecting',
    title: 'Prospecting Engine',
    icon: <Zap className="h-5 w-5" />,
    articles: [
      {
        id: 'scraper-guide',
        title: 'Guida allo Scraper Globale',
        description: 'Come trovare immobili su Idealista, Zillow, Immobiliare.it',
        slug: 'prospecting/scraper-guide',
      },
      {
        id: 'arbitrage',
        title: 'Guida all\'Arbitraggio',
        description: 'Identifica opportunità di mercato e calcola il Market Gap',
        slug: 'prospecting/arbitrage',
      },
      {
        id: 'filters',
        title: 'Filtri di Ricerca Avanzati',
        description: 'Configura filtri automatici per trovare i migliori deal',
        slug: 'prospecting/filters',
      },
    ],
  },
  {
    id: 'ai-voice',
    title: 'AI Voice Calling',
    icon: <Phone className="h-5 w-5" />,
    articles: [
      {
        id: 'voice-setup',
        title: 'Configurazione Chiamate AI',
        description: 'Imposta Bland AI e inizia a chiamare',
        slug: 'ai-voice/voice-setup',
      },
      {
        id: 'call-scripts',
        title: 'Script di Chiamata Personalizzati',
        description: 'Crea script efficaci per ottenere mandati',
        slug: 'ai-voice/call-scripts',
      },
      {
        id: 'obstacle-handling',
        title: 'Gestione Obiezioni',
        description: 'Come l\'IA gestisce le obiezioni dei proprietari',
        slug: 'ai-voice/obstacle-handling',
      },
    ],
  },
  {
    id: '3d-staging',
    title: '3D Virtual Staging',
    icon: <Box className="h-5 w-5" />,
    articles: [
      {
        id: 'staging-guide',
        title: 'Guida al 3D Staging',
        description: 'Genera visioni post-ristrutturazione per convincere i clienti',
        slug: '3d-staging/staging-guide',
      },
      {
        id: 'whatsapp-integration',
        title: 'Invio via WhatsApp',
        description: 'Condividi progetti 3D con proprietari e clienti',
        slug: '3d-staging/whatsapp-integration',
      },
    ],
  },
  {
    id: 'price-sniper',
    title: 'Price Drop Sniper',
    icon: <Target className="h-5 w-5" />,
    articles: [
      {
        id: 'sniper-guide',
        title: 'Come funziona lo Sniper',
        description: 'Rileva ribassi di prezzo in tempo reale',
        slug: 'price-sniper/sniper-guide',
      },
      {
        id: 'sniper-strategy',
        title: 'Strategia Sniper',
        description: 'Approccia proprietari dopo un ribasso',
        slug: 'price-sniper/sniper-strategy',
      },
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial Intelligence',
    icon: <Building2 className="h-5 w-5" />,
    articles: [
      {
        id: 'commercial-guide',
        title: 'Analisi Immobili Commerciali',
        description: 'Identifica attività consigliate e gap di mercato',
        slug: 'commercial/commercial-guide',
      },
      {
        id: 'business-features',
        title: 'Key Business Features',
        description: 'Rileva canna fumaria, vetrina, categoria C3',
        slug: 'commercial/business-features',
      },
    ],
  },
  {
    id: 'territory',
    title: 'Territory Commander',
    icon: <Map className="h-5 w-5" />,
    articles: [
      {
        id: 'territory-guide',
        title: 'Analisi del Territorio',
        description: 'Domanda, DNA quartiere, velocità vendita',
        slug: 'territory/territory-guide',
      },
      {
        id: 'map-usage',
        title: 'Uso della Mappa Tattica',
        description: 'Naviga i deal sulla mappa interattiva',
        slug: 'territory/map-usage',
      },
    ],
  },
  {
    id: 'smart-briefing',
    title: 'AI Smart Briefing',
    icon: <FileText className="h-5 w-5" />,
    articles: [
      {
        id: 'briefing-guide',
        title: 'Guida al Smart Briefing',
        description: 'Vantaggi, difetti, target automatici',
        slug: 'smart-briefing/briefing-guide',
      },
      {
        id: 'client-ready',
        title: 'Copia per il Cliente',
        description: 'Genera riassunti WhatsApp-ready',
        slug: 'smart-briefing/client-ready',
      },
    ],
  },
  {
    id: 'xray',
    title: 'AI X-Ray Vision',
    icon: <Sparkles className="h-5 w-5" />,
    articles: [
      {
        id: 'xray-guide',
        title: 'Analisi Tecnica Immagini',
        description: 'Rileva difetti e pregi con l\'IA',
        slug: 'xray/xray-guide',
      },
      {
        id: 'renovation-quote',
        title: 'Budget Riqualificazione',
        description: 'Calcola costi di ristrutturazione',
        slug: 'xray/renovation-quote',
      },
    ],
  },
  {
    id: 'competitor',
    title: 'Competitor Radar',
    icon: <TrendingDown className="h-5 w-5" />,
    articles: [
      {
        id: 'radar-guide',
        title: 'Rilevamento Mandati in Scadenza',
        description: 'Trova immobili fermi da 120+ giorni',
        slug: 'competitor/radar-guide',
      },
    ],
  },
];

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = docSections.map((section) => ({
    ...section,
    articles: section.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.articles.length > 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Documentation Hub</h1>
          <p className="text-muted-foreground text-lg">
            Guide complete per dominare PropertyPilot AI
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Cerca nelle guide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background/50 border-purple-500/30 focus:border-purple-500 text-white"
            />
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section) => (
            <Card
              key={section.id}
              className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10 hover:border-purple-500/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    {section.icon}
                  </div>
                  <CardTitle className="text-xl text-white">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  {section.articles.length} {section.articles.length === 1 ? 'articolo' : 'articoli'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/docs/${article.slug}`}
                      className="block p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-purple-500/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-400">{article.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="border-cyan-500/30 bg-gradient-to-br from-[#0a0a0a] to-cyan-900/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">🚀 Quick Start</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Nuovo su PropertyPilot? Inizia da qui.
              </p>
              <Link href="/docs/getting-started/welcome">
                <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                  Inizia qui
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">💡 Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Strategie avanzate per massimizzare i risultati.
              </p>
              <Link href="/docs/prospecting/arbitrage">
                <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  Scopri strategie
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-[#0a0a0a] to-green-900/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">🎯 Obiettivi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Come ottenere mandati con l'IA in 7 giorni.
              </p>
              <Link href="/docs/ai-voice/call-scripts">
                <Button variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10">
                  Ottieni mandati
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

