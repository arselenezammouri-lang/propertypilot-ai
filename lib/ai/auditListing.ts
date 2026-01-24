import OpenAI from 'openai';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface StructuralAudit {
  titolo: {
    valutazione: string;
    punteggio: number;
    problemi: string[];
    suggerimenti: string[];
  };
  apertura: {
    valutazione: string;
    punteggio: number;
    problemi: string[];
    suggerimenti: string[];
  };
  corpo: {
    valutazione: string;
    punteggio: number;
    problemi: string[];
    suggerimenti: string[];
  };
  callToAction: {
    valutazione: string;
    punteggio: number;
    problemi: string[];
    suggerimenti: string[];
  };
}

export interface SEOAudit {
  punteggioSEO: number;
  keywordsMancanti: string[];
  ottimizzazioneH1: {
    presente: boolean;
    valutazione: string;
    suggerimento: string;
  };
  problemiLeggibilita: string[];
  metaDescriptionConsigliata: string;
  keywordsPresenti: string[];
  densitaKeywords: string;
}

export interface EmotionalAudit {
  tono: {
    attuale: string;
    ideale: string;
    valutazione: string;
  };
  puntiDeboli: string[];
  sensazioniMancanti: string[];
  opportunitaNarrative: string[];
  connessioneEmotiva: number;
}

export interface RedFlag {
  gravita: 'critica' | 'alta' | 'media';
  problema: string;
  soluzione: string;
  impatto: string;
}

export interface AISuggestion {
  titolo: string;
  descrizione: string;
  priorita: number;
  impattoPrevisto: string;
}

export interface OptimizedVersion {
  titolo: string;
  descrizione: string;
  highlights: string[];
  callToAction: string;
  metaDescription: string;
}

export interface AuditResult {
  qualityScore: number;
  scoreBreakdown: {
    struttura: number;
    seo: number;
    emozioni: number;
    persuasivita: number;
  };
  structuralAudit: StructuralAudit;
  seoAudit: SEOAudit;
  emotionalAudit: EmotionalAudit;
  redFlags: RedFlag[];
  suggestions: AISuggestion[];
  optimizedVersion: OptimizedVersion;
  targetBuyer: string;
  mercatoAnalisi: string;
}

export interface AuditOptions {
  mercato: 'italia' | 'usa';
  obiettivo: 'seo' | 'vendita' | 'luxury' | 'social';
  imageUrl?: string;
}

const MARKET_CONTEXT = {
  italia: {
    portali: ['Immobiliare.it', 'Idealista', 'Casa.it', 'Subito.it'],
    keywords: ['bilocale', 'trilocale', 'ristrutturato', 'luminoso', 'vista', 'balcone', 'terrazzo', 'box auto', 'cantina', 'ascensore'],
    style: 'professionale ma caldo, descrittivo, enfasi su dettagli pratici e posizione',
    currency: '€',
  },
  usa: {
    portali: ['Zillow', 'Realtor.com', 'Redfin', 'Trulia'],
    keywords: ['bedrooms', 'bathrooms', 'sq ft', 'updated', 'open floor plan', 'hardwood floors', 'stainless appliances', 'curb appeal', 'move-in ready'],
    style: 'direct, benefit-focused, lifestyle-oriented, uses power words',
    currency: '$',
  },
};

const OBJECTIVE_PROMPTS = {
  seo: 'Massimizza visibilità sui motori di ricerca e portali immobiliari. Focus su keyword density, long-tail keywords, e ottimizzazione per algoritmi.',
  vendita: 'Massimizza conversioni e contatti. Focus su persuasione, urgency, benefici concreti e call-to-action efficaci.',
  luxury: 'Target clientela alto spendente. Focus su esclusività, lifestyle, dettagli premium, tono sofisticato e storytelling emotivo.',
  social: 'Ottimizza per engagement social media. Focus su hook iniziale, contenuto visivo, hashtag strategy e viral potential.',
};

async function generateQualityScore(
  listingText: string,
  options: AuditOptions
): Promise<{ score: number; breakdown: { struttura: number; seo: number; emozioni: number; persuasivita: number } }> {
  const marketInfo = MARKET_CONTEXT[options.mercato];
  
  const response = await withRetryAndTimeout(async (signal) => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto auditor immobiliare per il mercato ${options.mercato === 'italia' ? 'italiano' : 'americano'}.
Valuta la qualità dell'annuncio su 4 dimensioni, ognuna da 0 a 25 punti:

1. STRUTTURA (0-25): Organizzazione, titolo, apertura, corpo, CTA
2. SEO (0-25): Keywords, ottimizzazione per ${marketInfo.portali.join(', ')}
3. EMOZIONI (0-25): Connessione emotiva, storytelling, appeal
4. PERSUASIVITÀ (0-25): Capacità di generare interesse e contatti

Obiettivo specifico: ${OBJECTIVE_PROMPTS[options.obiettivo]}

Rispondi SOLO in JSON valido:
{
  "score": [totale 0-100],
  "struttura": [0-25],
  "seo": [0-25],
  "emozioni": [0-25],
  "persuasivita": [0-25]
}`
        },
        {
          role: 'user',
          content: `Valuta questo annuncio:\n\n${listingText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    }, { signal });
  }, { timeoutMs: 30000 });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  return {
    score: Math.min(100, Math.max(0, result.score || 0)),
    breakdown: {
      struttura: Math.min(25, Math.max(0, result.struttura || 0)),
      seo: Math.min(25, Math.max(0, result.seo || 0)),
      emozioni: Math.min(25, Math.max(0, result.emozioni || 0)),
      persuasivita: Math.min(25, Math.max(0, result.persuasivita || 0)),
    }
  };
}

async function generateStructuralAudit(
  listingText: string,
  options: AuditOptions
): Promise<StructuralAudit> {
  const response = await withRetryAndTimeout(async (signal) => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto di copywriting immobiliare per il mercato ${options.mercato === 'italia' ? 'italiano' : 'americano'}.
Analizza la STRUTTURA dell'annuncio su 4 elementi chiave:

1. TITOLO: Efficacia, lunghezza, keywords, hook
2. APERTURA: Primi 1-2 paragrafi, capacità di catturare attenzione
3. CORPO: Organizzazione informazioni, dettagli, flow
4. CALL-TO-ACTION: Presenza, efficacia, urgency

Per ogni elemento fornisci:
- valutazione: analisi dettagliata (2-3 frasi)
- punteggio: 1-10
- problemi: lista di problemi specifici (max 3)
- suggerimenti: consigli migliorativi (max 3)

Rispondi in JSON:
{
  "titolo": { "valutazione": "...", "punteggio": 7, "problemi": [...], "suggerimenti": [...] },
  "apertura": { "valutazione": "...", "punteggio": 6, "problemi": [...], "suggerimenti": [...] },
  "corpo": { "valutazione": "...", "punteggio": 8, "problemi": [...], "suggerimenti": [...] },
  "callToAction": { "valutazione": "...", "punteggio": 5, "problemi": [...], "suggerimenti": [...] }
}`
        },
        {
          role: 'user',
          content: `Analizza la struttura di questo annuncio:\n\n${listingText}`
        }
      ],
      temperature: 0.5,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
    }, { signal });
  }, { timeoutMs: 45000 });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateSEOAudit(
  listingText: string,
  options: AuditOptions
): Promise<SEOAudit> {
  const marketInfo = MARKET_CONTEXT[options.mercato];
  
  const response = await withRetryAndTimeout(async (signal) => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto SEO specializzato in portali immobiliari ${options.mercato === 'italia' ? 'italiani' : 'americani'}.
Portali di riferimento: ${marketInfo.portali.join(', ')}
Keywords tipiche del mercato: ${marketInfo.keywords.join(', ')}

Analizza l'annuncio dal punto di vista SEO e fornisci:

1. punteggioSEO: score 0-100
2. keywordsMancanti: lista di keyword importanti assenti (max 8)
3. ottimizzazioneH1: { presente: boolean, valutazione: "...", suggerimento: "..." }
4. problemiLeggibilita: lista di problemi di leggibilità (max 5)
5. metaDescriptionConsigliata: meta description ottimizzata (max 160 caratteri)
6. keywordsPresenti: keywords rilevanti già presenti (max 8)
7. densitaKeywords: valutazione della densità

Rispondi in JSON valido.`
        },
        {
          role: 'user',
          content: `Analizza SEO di questo annuncio:\n\n${listingText}`
        }
      ],
      temperature: 0.5,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    }, { signal });
  }, { timeoutMs: 45000 });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateEmotionalAudit(
  listingText: string,
  options: AuditOptions
): Promise<EmotionalAudit> {
  const response = await withRetryAndTimeout(async (signal) => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto di psicologia del consumatore e neuromarketing immobiliare.
Analizza l'IMPATTO EMOTIVO dell'annuncio considerando:

1. TONO: Analizza il tono attuale, suggerisci quello ideale per l'obiettivo ${options.obiettivo}
2. PUNTI DEBOLI EMOTIVI: Dove l'annuncio non connette emotivamente (max 5)
3. SENSAZIONI MANCANTI: Emozioni che dovrebbero essere evocate ma assenti (max 5)
4. OPPORTUNITÀ NARRATIVE: Come migliorare lo storytelling (max 5)
5. CONNESSIONE EMOTIVA: Score 1-100 della capacità di creare connessione

Rispondi in JSON:
{
  "tono": { "attuale": "...", "ideale": "...", "valutazione": "..." },
  "puntiDeboli": ["...", "..."],
  "sensazioniMancanti": ["...", "..."],
  "opportunitaNarrative": ["...", "..."],
  "connessioneEmotiva": 65
}`
        },
        {
          role: 'user',
          content: `Analizza l'impatto emotivo di questo annuncio:\n\n${listingText}`
        }
      ],
      temperature: 0.6,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    }, { signal });
  }, { timeoutMs: 45000 });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateRedFlags(
  listingText: string,
  options: AuditOptions
): Promise<RedFlag[]> {
  const response = await withRetryAndTimeout(async (signal) => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un quality assurance manager per annunci immobiliari.
Identifica i RED FLAGS (errori critici) che potrebbero danneggiare le performance dell'annuncio.

Cerca:
- Errori grammaticali o di battitura
- Informazioni contraddittorie
- Claim non credibili o esagerati
- Mancanza di informazioni essenziali
- Problemi di formattazione gravi
- Elementi che potrebbero scoraggiare i contatti
- Violazioni delle best practices del settore

Per ogni red flag indica:
- gravita: "critica" | "alta" | "media"
- problema: descrizione del problema
- soluzione: come risolverlo
- impatto: conseguenza negativa se non risolto

Rispondi in JSON: { "redFlags": [...] }
Massimo 6 red flags, ordinati per gravità.`
        },
        {
          role: 'user',
          content: `Identifica i red flags di questo annuncio:\n\n${listingText}`
        }
      ],
      temperature: 0.4,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    }, { signal });
  }, { timeoutMs: 45000 });

  const result = JSON.parse(response.choices[0].message.content || '{"redFlags":[]}');
  return Array.isArray(result.redFlags) ? result.redFlags : [];
}

async function generateAISuggestions(
  listingText: string,
  options: AuditOptions
): Promise<AISuggestion[]> {
  const response = await withRetryAndTimeout(async (signal) => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un consulente strategico per agenzie immobiliari.
Obiettivo dell'utente: ${OBJECTIVE_PROMPTS[options.obiettivo]}
Mercato: ${options.mercato === 'italia' ? 'Italia' : 'USA'}

Fornisci 5 SUGGERIMENTI STRATEGICI per massimizzare le performance dell'annuncio.
Ogni suggerimento deve essere:
- Specifico e attuabile
- Prioritizzato (1 = più importante)
- Con impatto previsto stimato

Rispondi in JSON:
{
  "suggestions": [
    { "titolo": "...", "descrizione": "...", "priorita": 1, "impattoPrevisto": "..." },
    ...
  ]
}`
        },
        {
          role: 'user',
          content: `Fornisci suggerimenti per migliorare questo annuncio:\n\n${listingText}`
        }
      ],
      temperature: 0.6,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    }, { signal });
  }, { timeoutMs: 45000 });

  const result = JSON.parse(response.choices[0].message.content || '{"suggestions":[]}');
  return Array.isArray(result.suggestions) ? result.suggestions.slice(0, 5) : [];
}

async function generateOptimizedVersion(
  listingText: string,
  options: AuditOptions
): Promise<OptimizedVersion> {
  const marketInfo = MARKET_CONTEXT[options.mercato];
  
  const response = await withRetryAndTimeout(async (signal) => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un copywriter immobiliare d'élite per il mercato ${options.mercato === 'italia' ? 'italiano' : 'americano'}.
Obiettivo: ${OBJECTIVE_PROMPTS[options.obiettivo]}
Stile: ${marketInfo.style}

Riscrivi l'annuncio in versione OTTIMIZZATA mantenendo tutti i fatti ma migliorando drasticamente:
- Titolo: accattivante, con keyword primaria, max 70 caratteri
- Descrizione: 200-300 parole, persuasiva, ben strutturata
- Highlights: 5 punti chiave bullet point
- Call to Action: urgente ma non aggressivo
- Meta Description: ottimizzata SEO, max 160 caratteri

NON inventare informazioni. Usa solo dati presenti nell'originale.

Rispondi in JSON:
{
  "titolo": "...",
  "descrizione": "...",
  "highlights": ["...", "...", "...", "...", "..."],
  "callToAction": "...",
  "metaDescription": "..."
}`
        },
        {
          role: 'user',
          content: `Riscrivi in versione ottimizzata:\n\n${listingText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
    }, { signal });
  }, { timeoutMs: 45000 });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function analyzeTargetBuyer(
  listingText: string,
  options: AuditOptions
): Promise<string> {
  const response = await withRetryAndTimeout(async (signal) => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un analista di mercato immobiliare esperto del mercato ${options.mercato === 'italia' ? 'italiano' : 'americano'}.
Analizza l'annuncio e identifica il profilo dell'acquirente ideale in 100-150 parole.
Include: demografia, motivazioni, capacità di spesa, lifestyle, priorità.`
        },
        {
          role: 'user',
          content: `Analizza il target buyer:\n\n${listingText}`
        }
      ],
      temperature: 0.6,
      max_tokens: 400,
    }, { signal });
  }, { timeoutMs: 30000 });

  return response.choices[0].message.content || '';
}

async function analyzeMarketContext(
  listingText: string,
  options: AuditOptions
): Promise<string> {
  const marketInfo = MARKET_CONTEXT[options.mercato];
  
  const response = await withRetryAndTimeout(async (signal) => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto del mercato immobiliare ${options.mercato === 'italia' ? 'italiano' : 'americano'}.
Portali di riferimento: ${marketInfo.portali.join(', ')}

Analizza come questo annuncio si posiziona nel contesto di mercato attuale.
Fornisci insight su: competitività, posizionamento prezzo, appeal per il target, differenziazione.
Risposta: 80-120 parole, pratica e actionable.`
        },
        {
          role: 'user',
          content: `Analizza contesto di mercato:\n\n${listingText}`
        }
      ],
      temperature: 0.6,
      max_tokens: 300,
    }, { signal });
  }, { timeoutMs: 30000 });

  return response.choices[0].message.content || '';
}

export async function auditListing(
  listingText: string,
  options: AuditOptions = { mercato: 'italia', obiettivo: 'vendita' }
): Promise<AuditResult> {
  if (!listingText || listingText.trim().length < 50) {
    throw new Error('Il testo dell\'annuncio deve contenere almeno 50 caratteri');
  }


  const [
    qualityResult,
    structuralAudit,
    seoAudit,
    emotionalAudit,
    redFlags,
    suggestions,
    optimizedVersion,
    targetBuyer,
    mercatoAnalisi,
  ] = await Promise.all([
    generateQualityScore(listingText, options),
    generateStructuralAudit(listingText, options),
    generateSEOAudit(listingText, options),
    generateEmotionalAudit(listingText, options),
    generateRedFlags(listingText, options),
    generateAISuggestions(listingText, options),
    generateOptimizedVersion(listingText, options),
    analyzeTargetBuyer(listingText, options),
    analyzeMarketContext(listingText, options),
  ]);


  return {
    qualityScore: qualityResult.score,
    scoreBreakdown: qualityResult.breakdown,
    structuralAudit,
    seoAudit,
    emotionalAudit,
    redFlags,
    suggestions,
    optimizedVersion,
    targetBuyer,
    mercatoAnalisi,
  };
}

export async function auditListingLegacy(listingText: string): Promise<{
  qualityScore: number;
  professionalAnalysis: {
    tone: string;
    clarity: string;
    structure: string;
    commercialInterest: string;
    descriptionEffectiveness: string;
  };
  seoAnalysis: string;
  weaknesses: string[];
  improvements: string[];
  optimizedRewrite: string;
  targetBuyer: string;
  persuasionTips: string[];
}> {
  const result = await auditListing(listingText, { mercato: 'italia', obiettivo: 'vendita' });
  
  return {
    qualityScore: result.qualityScore,
    professionalAnalysis: {
      tone: result.emotionalAudit.tono.valutazione,
      clarity: result.structuralAudit.corpo.valutazione,
      structure: `Titolo: ${result.structuralAudit.titolo.punteggio}/10, Apertura: ${result.structuralAudit.apertura.punteggio}/10, Corpo: ${result.structuralAudit.corpo.punteggio}/10, CTA: ${result.structuralAudit.callToAction.punteggio}/10`,
      commercialInterest: result.mercatoAnalisi,
      descriptionEffectiveness: result.structuralAudit.corpo.valutazione,
    },
    seoAnalysis: `Punteggio SEO: ${result.seoAudit.punteggioSEO}/100. Keywords mancanti: ${result.seoAudit.keywordsMancanti.join(', ')}. ${result.seoAudit.densitaKeywords}`,
    weaknesses: result.redFlags.map(rf => rf.problema),
    improvements: result.suggestions.map(s => `${s.titolo}: ${s.descrizione}`),
    optimizedRewrite: `${result.optimizedVersion.titolo}\n\n${result.optimizedVersion.descrizione}\n\n${result.optimizedVersion.highlights.map(h => `• ${h}`).join('\n')}\n\n${result.optimizedVersion.callToAction}`,
    targetBuyer: result.targetBuyer,
    persuasionTips: result.emotionalAudit.opportunitaNarrative,
  };
}
