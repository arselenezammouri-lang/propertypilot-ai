"use client";

import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock content - in produzione: CMS o file markdown
const docContent: Record<string, { title: string; content: string }> = {
  'getting-started/welcome': {
    title: 'Benvenuto in PropertyPilot AI',
    content: `
# Benvenuto in PropertyPilot AI

PropertyPilot AI è la piattaforma numero 1 per agenti immobiliari d'elite. Con l'IA, puoi trovare, analizzare e ottenere mandati 24/7.

## Cosa puoi fare

- **Scraper Globale**: Scansiona Idealista, Zillow, Immobiliare.it automaticamente
- **AI Voice Calling**: Chiamate automatiche con Bland AI
- **3D Virtual Staging**: Genera visioni post-ristrutturazione
- **Price Drop Sniper**: Rileva ribassi in tempo reale
- **Commercial Intelligence**: Analizza immobili commerciali

## Prossimi passi

1. Configura il tuo workspace
2. Crea il tuo primo annuncio AI
3. Attiva lo Scraper per trovare deal
    `,
  },
  'prospecting/arbitrage': {
    title: 'Guida all\'Arbitraggio',
    content: `
# Guida all'Arbitraggio

L'arbitraggio immobiliare consiste nell'identificare immobili venduti sotto il prezzo di mercato.

## Come funziona

1. **Market Gap**: Calcoliamo la differenza tra prezzo annuncio e media zona
2. **Opportunità**: Se il gap è > 15%, è un TOP DEAL
3. **Strategia**: Usa il Market Gap per negoziare con il proprietario

## Esempio

- Prezzo annuncio: €200.000
- Media zona: €250.000
- **Market Gap: -20%** 🏆

Questo è un affare d'oro!
    `,
  },
  'price-sniper/sniper-guide': {
    title: 'Come funziona lo Sniper',
    content: `
# Price Drop Sniper

Lo Sniper rileva automaticamente quando un immobile subisce un ribasso di prezzo.

## Funzionalità

- **Rilevamento 48h**: Notifica immediata dopo un ribasso
- **Grafico Prezzo**: Visualizza la storia dei cambiamenti
- **Script Aggiornato**: Script di chiamata ottimizzato per ribassi

## Strategia

Quando rilevi un ribasso:
1. Contatta immediatamente il proprietario
2. Usa lo script: "Ho visto che ha riposizionato l'immobile..."
3. Proponi una visita rapida
    `,
  },
  'ai-voice/call-scripts': {
    title: 'Script di Chiamata Personalizzati',
    content: `
# Script di Chiamata per Ottenere Mandati

Uno script efficace può trasformare una chiamata in un mandato.

## Template Base

"Buongiorno, chiamo da PropertyPilot AI. Abbiamo notato il suo annuncio per l'immobile a [Location]. Avremmo un cliente molto interessato; sarebbe disponibile per un sopralluogo rapido dopodomani?"

## Varianti

- **Per Market Gap**: "Sappiamo che il suo immobile ha un potenziale inespresso..."
- **Per Ribasso**: "Ho visto che ha riposizionato l'immobile sul mercato..."
- **Per Urgenza**: "Notiamo che l'immobile è online da tempo..."

## Obiezioni Comuni

- "Non voglio agenzie" → "Capisco, ma abbiamo clienti già pronti"
- "Non ho fretta" → "Il mercato cambia velocemente, meglio agire ora"
    `,
  },
};

export default function DocArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = Array.isArray(resolvedParams.slug) 
    ? resolvedParams.slug.join('/') 
    : resolvedParams.slug;
  
  const article = docContent[slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/docs">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alla documentazione
          </Button>
        </Link>

        {/* Article */}
        <Card className="border-purple-500/30 bg-gradient-to-br from-[#0a0a0a] to-purple-900/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Book className="h-6 w-6 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">{article.title}</h1>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                {article.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

