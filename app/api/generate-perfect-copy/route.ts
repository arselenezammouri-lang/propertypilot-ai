import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';
import { logger } from '@/lib/utils/safe-logger';

const requestSchema = z.object({
  tipoTransazione: z.enum(['vendita', 'affitto', 'affitto_breve']).optional().default('vendita'),
  tipoImmobile: z.enum(['appartamento', 'casa', 'villa', 'attico', 'loft', 'bilocale', 'trilocale', 'monolocale', 'rustico', 'casale', 'palazzo', 'locale_commerciale', 'ufficio', 'terreno', 'garage', 'box']),
  zona: z.string().min(2, 'Inserisci la zona/località').max(100),
  caratteristiche: z.string().min(10, 'Descrivi almeno le caratteristiche principali').max(2000),
  puntiForzaList: z.string().max(1000).optional(),
  targetCliente: z.enum(['famiglie', 'giovani_coppie', 'investitori', 'studenti', 'professionisti', 'pensionati', 'luxury', 'stranieri', 'turisti', 'aziende']),
  fasciaPrezzo: z.string().max(50).optional(),
  tono: z.enum(['professionale', 'emotivo', 'luxury']),
  portaleTarget: z.enum(['generico', 'immobiliare', 'idealista', 'casa', 'subito', 'zillow']).optional().default('generico'),
});

type RequestData = z.infer<typeof requestSchema>;

interface CopyVariant {
  titolo: string;
  descrizione: string;
  highlights: string[];
  perchéComprarlo: string[];
  cta: string;
  metaDescription: string;
}

interface PerfectCopyResult {
  professionale: CopyVariant;
  emotivo: CopyVariant;
  breve: CopyVariant;
  seo: CopyVariant;
  luxury: CopyVariant;
  consiglioEsperto: string;
  portaleAdattamento?: string;
}

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const userRequestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, isUser: boolean = false): boolean {
  const counts = isUser ? userRequestCounts : ipRequestCounts;
  const limit = isUser ? 10 : 20;
  const now = Date.now();
  const windowMs = 60 * 1000;
  
  const record = counts.get(identifier);
  
  if (!record || now > record.resetTime) {
    counts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

const TARGET_DESCRIPTIONS: Record<string, string> = {
  famiglie: 'famiglie con bambini, spazi ampi, vicinanza scuole e parchi',
  giovani_coppie: 'giovani coppie, moderno, funzionale, buon rapporto qualità-prezzo',
  investitori: 'investitori, rendimento, potenziale di rivalutazione, affitto',
  studenti: 'studenti universitari, vicinanza università, trasporti, prezzo accessibile',
  professionisti: 'professionisti, smart working, connettività, zona servita',
  pensionati: 'pensionati, tranquillità, servizi vicini, accessibilità',
  luxury: 'clientela luxury, esclusività, materiali pregiati, privacy',
  stranieri: 'clienti internazionali, lifestyle italiano, investimento estero',
  turisti: 'turisti e vacanzieri, posizione strategica, servizi turistici, comfort',
  aziende: 'aziende e corporate, spazi professionali, rappresentanza, accessibilità',
};

const TRANSAZIONE_LABELS: Record<string, { tipo: string; azione: string; cliente: string }> = {
  vendita: { tipo: 'in Vendita', azione: 'comprarlo', cliente: 'acquirente' },
  affitto: { tipo: 'in Affitto', azione: 'affittarlo', cliente: 'affittuario' },
  affitto_breve: { tipo: 'in Affitto Breve', azione: 'prenotarlo', cliente: 'ospite' },
};

const PORTALE_GUIDELINES: Record<string, string> = {
  generico: 'stile versatile adatto a qualsiasi portale',
  immobiliare: 'Immobiliare.it: titoli max 80 caratteri, descrizioni strutturate, focus su metratura e caratteristiche tecniche',
  idealista: 'Idealista: titoli accattivanti, descrizioni emozionali, enfasi su zona e servizi',
  casa: 'Casa.it: stile professionale, bullet points chiari, focus su prezzo e condizioni',
  subito: 'Subito.it: titoli diretti, descrizioni brevi e incisive, call-to-action immediata',
  zillow: 'Zillow (USA): stile americano, square feet, neighborhood highlights, investment potential',
};

async function generateProfessionale(openai: OpenAI, data: RequestData): Promise<CopyVariant> {
  const prompt = `Sei un copywriter immobiliare italiano esperto. Genera un annuncio PROFESSIONALE per:

IMMOBILE: ${data.tipoImmobile} a ${data.zona}
CARATTERISTICHE: ${data.caratteristiche}
${data.puntiForzaList ? `PUNTI DI FORZA: ${data.puntiForzaList}` : ''}
TIPO ANNUNCIO: ${TRANSAZIONE_LABELS[data.tipoTransazione || 'vendita'].tipo}
TARGET: ${TARGET_DESCRIPTIONS[data.targetCliente]}
${data.fasciaPrezzo ? `FASCIA PREZZO: ${data.fasciaPrezzo}` : ''}
PORTALE: ${PORTALE_GUIDELINES[data.portaleTarget || 'generico']}

GENERA un annuncio PROFESSIONALE con:
1. TITOLO: max 80 caratteri, informativo e preciso
2. DESCRIZIONE: 150-200 parole, tono formale, dati tecnici precisi, struttura chiara
3. HIGHLIGHTS: 5 punti chiave dell'immobile (bullet points)
4. PERCHÉ COMPRARLO: 4 motivi razionali per l'acquisto
5. CTA: call-to-action professionale
6. META DESCRIPTION: 155 caratteri max per Google

Rispondi SOLO in JSON valido:
{
  "titolo": "...",
  "descrizione": "...",
  "highlights": ["...", "...", "...", "...", "..."],
  "perchéComprarlo": ["...", "...", "...", "..."],
  "cta": "...",
  "metaDescription": "..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateEmotivo(openai: OpenAI, data: RequestData): Promise<CopyVariant> {
  const prompt = `Sei un copywriter immobiliare italiano specializzato in testi EMOZIONALI. Genera un annuncio COINVOLGENTE per:

IMMOBILE: ${data.tipoImmobile} a ${data.zona}
CARATTERISTICHE: ${data.caratteristiche}
${data.puntiForzaList ? `PUNTI DI FORZA: ${data.puntiForzaList}` : ''}
TIPO ANNUNCIO: ${TRANSAZIONE_LABELS[data.tipoTransazione || 'vendita'].tipo}
TARGET: ${TARGET_DESCRIPTIONS[data.targetCliente]}
${data.fasciaPrezzo ? `FASCIA PREZZO: ${data.fasciaPrezzo}` : ''}

GENERA un annuncio EMOTIVO/COINVOLGENTE con:
1. TITOLO: max 80 caratteri, evocativo, crea desiderio
2. DESCRIZIONE: 150-200 parole, storytelling, emozioni, visione del futuro, lifestyle
3. HIGHLIGHTS: 5 esperienze/sensazioni che l'immobile offre
4. PERCHÉ COMPRARLO: 4 motivi emozionali/aspirazionali
5. CTA: call-to-action che crea urgenza emotiva
6. META DESCRIPTION: 155 caratteri max, coinvolgente

Usa tecniche di storytelling, immagini mentali, futuro desiderabile.

Rispondi SOLO in JSON valido:
{
  "titolo": "...",
  "descrizione": "...",
  "highlights": ["...", "...", "...", "...", "..."],
  "perchéComprarlo": ["...", "...", "...", "..."],
  "cta": "...",
  "metaDescription": "..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateBreve(openai: OpenAI, data: RequestData): Promise<CopyVariant> {
  const prompt = `Sei un copywriter immobiliare italiano. Genera un annuncio BREVE e INCISIVO per portali con limiti di caratteri:

IMMOBILE: ${data.tipoImmobile} a ${data.zona}
CARATTERISTICHE: ${data.caratteristiche}
${data.puntiForzaList ? `PUNTI DI FORZA: ${data.puntiForzaList}` : ''}
TIPO ANNUNCIO: ${TRANSAZIONE_LABELS[data.tipoTransazione || 'vendita'].tipo}
TARGET: ${TARGET_DESCRIPTIONS[data.targetCliente]}

GENERA un annuncio BREVE per portali con:
1. TITOLO: max 60 caratteri, diretto e accattivante
2. DESCRIZIONE: max 50 parole, essenziale ma completa
3. HIGHLIGHTS: 3 punti chiave (brevissimi)
4. PERCHÉ COMPRARLO: 2 motivi principali
5. CTA: breve e diretto
6. META DESCRIPTION: 120 caratteri max

Sii conciso ma efficace.

Rispondi SOLO in JSON valido:
{
  "titolo": "...",
  "descrizione": "...",
  "highlights": ["...", "...", "..."],
  "perchéComprarlo": ["...", "..."],
  "cta": "...",
  "metaDescription": "..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateSEO(openai: OpenAI, data: RequestData): Promise<CopyVariant> {
  const prompt = `Sei un esperto SEO per annunci immobiliari italiani. Genera un annuncio OTTIMIZZATO SEO per:

IMMOBILE: ${data.tipoImmobile} a ${data.zona}
CARATTERISTICHE: ${data.caratteristiche}
${data.puntiForzaList ? `PUNTI DI FORZA: ${data.puntiForzaList}` : ''}
TIPO ANNUNCIO: ${TRANSAZIONE_LABELS[data.tipoTransazione || 'vendita'].tipo}
TARGET: ${TARGET_DESCRIPTIONS[data.targetCliente]}
${data.fasciaPrezzo ? `FASCIA PREZZO: ${data.fasciaPrezzo}` : ''}

GENERA un annuncio SEO-OTTIMIZZATO con:
1. TITOLO: max 70 caratteri, keyword principale + località + caratteristica unica
2. DESCRIZIONE: 180-220 parole, keyword density 2-3%, headers impliciti, LSI keywords
3. HIGHLIGHTS: 5 punti con keyword secondarie
4. PERCHÉ COMPRARLO: 4 motivi con keyword long-tail
5. CTA: con keyword transazionale
6. META DESCRIPTION: 155 caratteri, keyword + CTA

Keywords da includere naturalmente:
- "${data.tipoImmobile} ${data.zona}"
- "vendita ${data.tipoImmobile}"
- "${data.tipoImmobile} in vendita"
- varianti locali

Rispondi SOLO in JSON valido:
{
  "titolo": "...",
  "descrizione": "...",
  "highlights": ["...", "...", "...", "...", "..."],
  "perchéComprarlo": ["...", "...", "...", "..."],
  "cta": "...",
  "metaDescription": "..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateLuxury(openai: OpenAI, data: RequestData): Promise<CopyVariant> {
  const prompt = `Sei un copywriter di lusso per immobili esclusivi. Genera un annuncio LUXURY per:

IMMOBILE: ${data.tipoImmobile} a ${data.zona}
CARATTERISTICHE: ${data.caratteristiche}
${data.puntiForzaList ? `PUNTI DI FORZA: ${data.puntiForzaList}` : ''}
TARGET: clientela high-net-worth, acquirenti esigenti, lifestyle esclusivo
${data.fasciaPrezzo ? `FASCIA PREZZO: ${data.fasciaPrezzo}` : ''}

GENERA un annuncio LUXURY con:
1. TITOLO: max 80 caratteri, elegante, esclusivo, evoca prestigio
2. DESCRIZIONE: 200-250 parole, linguaggio sofisticato, dettagli pregiati, esperienza unica
3. HIGHLIGHTS: 5 elementi di lusso e distinzione
4. PERCHÉ COMPRARLO: 4 motivi per chi cerca l'eccellenza
5. CTA: elegante, esclusiva, senza pressione
6. META DESCRIPTION: 155 caratteri, lusso e unicità

Usa vocabolario luxury: prestigio, esclusivo, raffinato, pregiato, unico, distinzione, eccellenza, curato, design, lifestyle.

Rispondi SOLO in JSON valido:
{
  "titolo": "...",
  "descrizione": "...",
  "highlights": ["...", "...", "...", "...", "..."],
  "perchéComprarlo": ["...", "...", "...", "..."],
  "cta": "...",
  "metaDescription": "..."
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.75,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function generateConsiglioEsperto(openai: OpenAI, data: RequestData): Promise<string> {
  const prompt = `Sei un consulente immobiliare esperto. Dai un CONSIGLIO STRATEGICO per vendere questo immobile:

IMMOBILE: ${data.tipoImmobile} a ${data.zona}
CARATTERISTICHE: ${data.caratteristiche}
TIPO ANNUNCIO: ${TRANSAZIONE_LABELS[data.tipoTransazione || 'vendita'].tipo}
TARGET: ${TARGET_DESCRIPTIONS[data.targetCliente]}
TONO SCELTO: ${data.tono}

Fornisci UN consiglio esperto in 2-3 frasi su:
- Quale variante di annuncio funzionerà meglio per questo target
- Un suggerimento pratico per aumentare le visualizzazioni
- Una strategia di prezzo o presentazione

Rispondi in italiano, tono professionale ma amichevole.`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    }, { signal }),
    { timeoutMs: 30000, maxRetries: 2 }
  );

  return response.choices[0].message.content || 'Consiglio non disponibile.';
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json(
      { error: 'Non autorizzato. Effettua il login per continuare.' },
      { status: 401 }
    );
  }

  // SECURITY: Check active subscription
  const subscriptionCheck = await requireActiveSubscription(supabase, user.id);
  if (!subscriptionCheck.allowed) {
    return NextResponse.json(
      { 
        error: subscriptionCheck.error || 'Abbonamento richiesto',
        message: subscriptionCheck.error || 'Questa funzionalità richiede un abbonamento attivo.'
      },
      { status: 403 }
    );
  }

  const clientIP = getClientIP(request);
  
  if (!checkRateLimit(clientIP, false)) {
    return NextResponse.json(
      { error: 'Troppe richieste. Riprova tra un minuto.' },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Richiesta non valida.' },
      { status: 400 }
    );
  }

  const validationResult = requestSchema.safeParse(body);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map(e => e.message).join(', ');
    return NextResponse.json(
      { error: `Dati non validi: ${errorMessages}` },
      { status: 400 }
    );
  }

  const data = validationResult.data;
  
  const cacheKey = `${data.tipoTransazione}:${data.tipoImmobile}:${data.zona}:${data.caratteristiche}:${data.targetCliente}:${data.tono}:${data.portaleTarget}`;
  const cachePromptType = 'perfect-copy';

  try {
    const cacheService = getAICacheService();
    const cachedResult = await cacheService.get(cacheKey, cachePromptType);
    
    if (cachedResult) {
      logger.debug('[Perfect Copy] Cache hit');
      return NextResponse.json(cachedResult);
    }
  } catch (cacheError) {
    logger.warn('[Perfect Copy] Cache read error', { error: cacheError });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return NextResponse.json(
      { error: 'Servizio AI non configurato. Contatta il supporto.' },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });

  try {
    const generatePromises: Promise<CopyVariant | string>[] = [
      generateProfessionale(openai, data),
      generateEmotivo(openai, data),
      generateBreve(openai, data),
      generateSEO(openai, data),
      generateLuxury(openai, data),
      generateConsiglioEsperto(openai, data),
    ];

    const results = await Promise.all(generatePromises);

    const result: PerfectCopyResult = {
      professionale: results[0] as CopyVariant,
      emotivo: results[1] as CopyVariant,
      breve: results[2] as CopyVariant,
      seo: results[3] as CopyVariant,
      luxury: results[4] as CopyVariant,
      consiglioEsperto: results[5] as string,
    };

    if (data.portaleTarget && data.portaleTarget !== 'generico') {
      result.portaleAdattamento = PORTALE_GUIDELINES[data.portaleTarget];
    }

    try {
      const cacheService = getAICacheService();
      await cacheService.set(cacheKey, cachePromptType, result, 24 * 60 * 60 * 1000);
      logger.debug('[Perfect Copy] Cached result');
    } catch (cacheError) {
      logger.warn('[Perfect Copy] Cache write error', { error: cacheError });
    }

    return NextResponse.json(result);

  } catch (error: unknown) {
    logger.error('[Perfect Copy] Generation error', error as Error, { component: 'generate-perfect-copy' });
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        return NextResponse.json(
          { error: 'Il servizio AI impiega troppo tempo. Riprova tra qualche minuto.' },
          { status: 504 }
        );
      }
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Limite richieste AI raggiunto. Riprova tra qualche minuto.' },
          { status: 429 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          { error: 'Crediti AI esauriti. Contatta il supporto.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Errore durante la generazione. Riprova.' },
      { status: 500 }
    );
  }
}
