"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Book, Zap, Phone, Box, Target, Building2, Map, FileText, Sparkles, TrendingDown, ArrowRight, Users, CreditCard } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

export const dynamic = "force-static";

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

function getDocSections(it: boolean): DocSection[] {
  return [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Book className="h-5 w-5" />,
    articles: [
      {
        id: 'welcome',
        title: it ? 'Benvenuto in PropertyPilot AI' : 'Welcome to PropertyPilot AI',
        description: it ? 'Guida introduttiva alla piattaforma' : 'Introduction guide to the platform',
        slug: 'getting-started/welcome',
      },
      {
        id: 'first-listing',
        title: it ? 'Crea il tuo primo annuncio' : 'Create your first listing',
        description: it ? 'Genera un annuncio AI in 2 minuti' : 'Generate an AI listing in 2 minutes',
        slug: 'getting-started/first-listing',
      },
      {
        id: 'workspace-setup',
        title: it ? 'Configura il tuo Workspace' : 'Set up your Workspace',
        description: it ? 'Personalizza la dashboard' : 'Customize your dashboard',
        slug: 'getting-started/workspace-setup',
      },
      {
        id: 'perfect-copy-guide',
        title: it ? 'Perfect Copy — guida rapida' : 'Perfect Copy — quick guide',
        description: it
          ? 'Campi del form, varianti e salvataggio in libreria'
          : 'Form fields, variants, and saving to your library',
        slug: 'getting-started/perfect-copy',
      },
    ],
  },
  {
    id: 'crm',
    title: it ? 'CRM & lead' : 'CRM & leads',
    icon: <Users className="h-5 w-5" />,
    articles: [
      {
        id: 'pipeline-guide',
        title: it ? 'Pipeline lead (Kanban)' : 'Lead pipeline (Kanban)',
        description: it
          ? 'Trascina i lead tra le colonne e aggiorna lo stato'
          : 'Drag leads between columns to update status',
        slug: 'crm/pipeline',
      },
    ],
  },
  {
    id: 'account',
    title: it ? 'Account' : 'Account',
    icon: <CreditCard className="h-5 w-5" />,
    articles: [
      {
        id: 'billing-guide',
        title: it ? 'Piano e fatturazione' : 'Plan and billing',
        description: it
          ? 'Upgrade, portale Stripe e stato abbonamento'
          : 'Upgrades, Stripe portal, and subscription status',
        slug: 'account/billing-guide',
      },
    ],
  },
  {
    id: 'prospecting',
    title: 'Prospecting Engine',
    icon: <Zap className="h-5 w-5" />,
    articles: [
      { id: 'scraper-guide', title: it ? 'Guida allo Scraper Globale' : 'Global Scraper Guide', description: it ? 'Come trovare immobili su Idealista, Zillow, Immobiliare.it' : 'How to find properties on Idealista, Zillow, Immobiliare.it', slug: 'prospecting/scraper-guide' },
      { id: 'arbitrage', title: it ? "Guida all'Arbitraggio" : 'Arbitrage Guide', description: it ? 'Identifica opportunità di mercato e calcola il Market Gap' : 'Identify market opportunities and calculate the Market Gap', slug: 'prospecting/arbitrage' },
      { id: 'filters', title: it ? 'Filtri di Ricerca Avanzati' : 'Advanced Search Filters', description: it ? 'Configura filtri automatici per trovare i migliori deal' : 'Set up automatic filters to find the best deals', slug: 'prospecting/filters' },
    ],
  },
  {
    id: 'ai-voice',
    title: 'AI Voice Calling',
    icon: <Phone className="h-5 w-5" />,
    articles: [
      { id: 'voice-setup', title: it ? 'Configurazione Chiamate AI' : 'AI Call Setup', description: it ? 'Imposta Bland AI e inizia a chiamare' : 'Set up Bland AI and start calling', slug: 'ai-voice/voice-setup' },
      { id: 'call-scripts', title: it ? 'Script di Chiamata Personalizzati' : 'Custom Call Scripts', description: it ? 'Crea script efficaci per ottenere mandati' : 'Create effective scripts to win mandates', slug: 'ai-voice/call-scripts' },
      { id: 'obstacle-handling', title: it ? 'Gestione Obiezioni' : 'Objection Handling', description: it ? "Come l'IA gestisce le obiezioni dei proprietari" : 'How AI handles owner objections', slug: 'ai-voice/obstacle-handling' },
    ],
  },
  {
    id: '3d-staging',
    title: '3D Virtual Staging',
    icon: <Box className="h-5 w-5" />,
    articles: [
      { id: 'staging-guide', title: it ? 'Guida al 3D Staging' : '3D Staging Guide', description: it ? 'Genera visioni post-ristrutturazione per convincere i clienti' : 'Generate post-renovation visualizations to convince clients', slug: '3d-staging/staging-guide' },
      { id: 'whatsapp-integration', title: it ? 'Invio via WhatsApp' : 'Send via WhatsApp', description: it ? 'Condividi progetti 3D con proprietari e clienti' : 'Share 3D projects with owners and clients', slug: '3d-staging/whatsapp-integration' },
    ],
  },
  {
    id: 'price-sniper',
    title: 'Price Drop Sniper',
    icon: <Target className="h-5 w-5" />,
    articles: [
      { id: 'sniper-guide', title: it ? 'Come funziona lo Sniper' : 'How the Sniper works', description: it ? 'Rileva ribassi di prezzo in tempo reale' : 'Detect price drops in real time', slug: 'price-sniper/sniper-guide' },
      { id: 'sniper-strategy', title: it ? 'Strategia Sniper' : 'Sniper Strategy', description: it ? 'Approccia proprietari dopo un ribasso' : 'Approach owners after a price drop', slug: 'price-sniper/sniper-strategy' },
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial Intelligence',
    icon: <Building2 className="h-5 w-5" />,
    articles: [
      { id: 'commercial-guide', title: it ? 'Analisi Immobili Commerciali' : 'Commercial Property Analysis', description: it ? 'Identifica attività consigliate e gap di mercato' : 'Identify recommended businesses and market gaps', slug: 'commercial/commercial-guide' },
      { id: 'business-features', title: 'Key Business Features', description: it ? 'Rileva canna fumaria, vetrina, categoria C3' : 'Detect chimney, storefront, C3 category', slug: 'commercial/business-features' },
    ],
  },
  {
    id: 'territory',
    title: 'Territory Commander',
    icon: <Map className="h-5 w-5" />,
    articles: [
      { id: 'territory-guide', title: it ? 'Analisi del Territorio' : 'Territory Analysis', description: it ? 'Domanda, DNA quartiere, velocità vendita' : 'Demand, neighborhood DNA, sales velocity', slug: 'territory/territory-guide' },
      { id: 'map-usage', title: it ? 'Uso della Mappa Tattica' : 'Tactical Map Usage', description: it ? 'Naviga i deal sulla mappa interattiva' : 'Navigate deals on the interactive map', slug: 'territory/map-usage' },
    ],
  },
  {
    id: 'smart-briefing',
    title: 'AI Smart Briefing',
    icon: <FileText className="h-5 w-5" />,
    articles: [
      { id: 'briefing-guide', title: it ? 'Guida al Smart Briefing' : 'Smart Briefing Guide', description: it ? 'Vantaggi, difetti, target automatici' : 'Pros, cons, automatic target audience', slug: 'smart-briefing/briefing-guide' },
      { id: 'client-ready', title: it ? 'Copia per il Cliente' : 'Client-Ready Copy', description: it ? 'Genera riassunti WhatsApp-ready' : 'Generate WhatsApp-ready summaries', slug: 'smart-briefing/client-ready' },
    ],
  },
  {
    id: 'xray',
    title: 'AI X-Ray Vision',
    icon: <Sparkles className="h-5 w-5" />,
    articles: [
      { id: 'xray-guide', title: it ? 'Analisi Tecnica Immagini' : 'Technical Image Analysis', description: it ? "Rileva difetti e pregi con l'IA" : 'Detect defects and features with AI', slug: 'xray/xray-guide' },
      { id: 'renovation-quote', title: it ? 'Budget Riqualificazione' : 'Renovation Budget', description: it ? 'Calcola costi di ristrutturazione' : 'Calculate renovation costs', slug: 'xray/renovation-quote' },
    ],
  },
  {
    id: 'competitor',
    title: 'Competitor Radar',
    icon: <TrendingDown className="h-5 w-5" />,
    articles: [
      { id: 'radar-guide', title: it ? 'Rilevamento Mandati in Scadenza' : 'Expiring Mandate Detection', description: it ? 'Trova immobili fermi da 120+ giorni' : 'Find properties stagnant for 120+ days', slug: 'competitor/radar-guide' },
    ],
  },
  ];
}

export default function DocumentationPage() {
  const { locale } = useLocale();
  const isItalian = locale === "it";
  const [searchQuery, setSearchQuery] = useState("");

  const t = {
    pageTitle: "Documentation Hub",
    pageSubtitle: isItalian
      ? "Guide complete per dominare PropertyPilot AI"
      : "Complete guides to master PropertyPilot AI",
    searchPlaceholder: isItalian ? "Cerca nelle guide..." : "Search guides...",
    articleSingular: isItalian ? "articolo" : "article",
    articlePlural: isItalian ? "articoli" : "articles",
    quickStartTitle: "🚀 Quick Start",
    quickStartDesc: isItalian
      ? "Nuovo su PropertyPilot? Inizia da qui."
      : "New to PropertyPilot? Start here.",
    quickStartBtn: isItalian ? "Inizia qui" : "Start here",
    bestPracticesTitle: "💡 Best Practices",
    bestPracticesDesc: isItalian
      ? "Strategie avanzate per massimizzare i risultati."
      : "Advanced strategies to maximize results.",
    bestPracticesBtn: isItalian ? "Scopri strategie" : "Discover strategies",
    goalsTitle: isItalian ? "🎯 Obiettivi" : "🎯 Goals",
    goalsDesc: isItalian
      ? "Come ottenere mandati con l'IA in 7 giorni."
      : "How to win mandates with AI in 7 days.",
    goalsBtn: isItalian ? "Ottieni mandati" : "Win mandates",
  };

  const docSections = getDocSections(isItalian);

  const filteredSections = docSections.map((section) => ({
    ...section,
    articles: section.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.articles.length > 0);

  return (
    <main id="main-content" className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{t.pageTitle}</h1>
          <p className="text-muted-foreground text-lg">
            {t.pageSubtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t.searchPlaceholder}
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
                  {section.articles.length} {section.articles.length === 1 ? t.articleSingular : t.articlePlural}
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
              <CardTitle className="text-lg text-white">{t.quickStartTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                {t.quickStartDesc}
              </p>
              <Link href="/docs/getting-started/welcome">
                <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                  {t.quickStartBtn}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">{t.bestPracticesTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                {t.bestPracticesDesc}
              </p>
              <Link href="/docs/prospecting/arbitrage">
                <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  {t.bestPracticesBtn}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-[#0a0a0a] to-green-900/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">{t.goalsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                {t.goalsDesc}
              </p>
              <Link href="/docs/ai-voice/call-scripts">
                <Button variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10">
                  {t.goalsBtn}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

