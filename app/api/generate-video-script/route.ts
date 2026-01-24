import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';

const requestSchema = z.object({
  type: z.string().min(5, 'Inserisci il tipo di immobile').max(100),
  location: z.string().min(2, 'Inserisci la località').max(150),
  price: z.string().min(1, 'Inserisci il prezzo').max(50),
  features: z.string().min(10, 'Descrivi le caratteristiche principali').max(500),
  strengths: z.string().min(10, 'Descrivi i punti di forza').max(500),
  targetBuyer: z.enum(['famiglie', 'investitori', 'luxury', 'studenti']),
  tone: z.enum(['professionale', 'energico', 'luxury', 'emozionale']),
});

type RequestData = z.infer<typeof requestSchema>;

interface VideoScript {
  hook: string;
  scenes: {
    numero: number;
    timestamp: string;
    testo: string;
    indicazioniVisive: string;
  }[];
  cta: string;
  hashtags: string[];
  durata: string;
}

interface VideoScriptResult {
  script15s: VideoScript;
  script30s: VideoScript;
  script60s: VideoScript;
  scriptLuxury: VideoScript;
  hooksVirali: string[];
  consiglioVideo: string;
}

const TARGET_DESCRIPTIONS: Record<string, string> = {
  famiglie: 'famiglie con bambini, focus su spazi, sicurezza, scuole vicine, giardino',
  investitori: 'investitori immobiliari, focus su ROI, rendimento, potenziale rivalutazione',
  luxury: 'clientela alto profilo, focus su esclusività, design, location premium',
  studenti: 'studenti universitari, focus su prezzo, vicinanza università, trasporti',
};

const TONE_DESCRIPTIONS: Record<string, string> = {
  professionale: 'tono pulito, informativo, credibile, focus sui dati',
  energico: 'tono dinamico, entusiasta, ritmo veloce, perfetto per social',
  luxury: 'tono sofisticato, esclusivo, cinematografico, per immobili premium',
  emozionale: 'tono caldo, storytelling, focus sulle emozioni e lifestyle',
};

async function generateScript15s(openai: OpenAI, data: RequestData): Promise<VideoScript> {
  const prompt = `Sei un video creator specializzato in real estate per social media. Genera uno SCRIPT VIDEO 15 SECONDI per:

IMMOBILE: ${data.type}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
CARATTERISTICHE: ${data.features}
PUNTI DI FORZA: ${data.strengths}
TARGET: ${TARGET_DESCRIPTIONS[data.targetBuyer]}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Lo script deve essere PERFETTO per TikTok/Reels/Shorts (15 secondi).

GENERA:
1. HOOK: Frase d'apertura che cattura in 2 secondi (domanda, affermazione shock, curiosità)
2. SCENE: 3 scene da ~4 secondi ciascuna con:
   - Numero scena
   - Timestamp preciso (es. "0:02-0:06")
   - Testo da dire/mostrare
   - Indicazioni visive (B-roll, transizioni, camera movement)
3. CTA: Call-to-action finale (2 secondi)
4. HASHTAG: 5 hashtag mix virali + nicchia immobiliare

Rispondi SOLO in JSON valido:
{
  "hook": "...",
  "scenes": [
    {"numero": 1, "timestamp": "0:00-0:02", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 2, "timestamp": "0:02-0:06", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 3, "timestamp": "0:06-0:10", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 4, "timestamp": "0:10-0:13", "testo": "...", "indicazioniVisive": "..."}
  ],
  "cta": "...",
  "hashtags": ["...", "...", "...", "...", "..."],
  "durata": "15 secondi"
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

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateScript30s(openai: OpenAI, data: RequestData): Promise<VideoScript> {
  const prompt = `Sei un video creator specializzato in real estate. Genera uno SCRIPT VIDEO 30 SECONDI per:

IMMOBILE: ${data.type}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
CARATTERISTICHE: ${data.features}
PUNTI DI FORZA: ${data.strengths}
TARGET: ${TARGET_DESCRIPTIONS[data.targetBuyer]}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Lo script deve essere perfetto per Instagram Reels / TikTok / YouTube Shorts (30 secondi).

GENERA:
1. HOOK: Frase d'apertura che cattura in 3 secondi
2. SCENE: 5 scene con:
   - Numero scena
   - Timestamp preciso
   - Testo da dire/mostrare
   - Indicazioni visive dettagliate (B-roll, transizioni, angolazioni camera, effetti)
3. CTA: Call-to-action finale con urgenza
4. HASHTAG: 7 hashtag mix virali + nicchia

Rispondi SOLO in JSON valido:
{
  "hook": "...",
  "scenes": [
    {"numero": 1, "timestamp": "0:00-0:03", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 2, "timestamp": "0:03-0:08", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 3, "timestamp": "0:08-0:15", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 4, "timestamp": "0:15-0:22", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 5, "timestamp": "0:22-0:28", "testo": "...", "indicazioniVisive": "..."}
  ],
  "cta": "...",
  "hashtags": ["...", "...", "...", "...", "...", "...", "..."],
  "durata": "30 secondi"
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

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateScript60s(openai: OpenAI, data: RequestData): Promise<VideoScript> {
  const prompt = `Sei un video creator esperto in real estate content. Genera uno SCRIPT VIDEO 45-60 SECONDI per:

IMMOBILE: ${data.type}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
CARATTERISTICHE: ${data.features}
PUNTI DI FORZA: ${data.strengths}
TARGET: ${TARGET_DESCRIPTIONS[data.targetBuyer]}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Lo script deve essere completo per un tour virtuale / video presentazione (45-60 secondi).

GENERA:
1. HOOK: Apertura cinematografica che cattura in 3-5 secondi
2. SCENE: 7-8 scene con:
   - Numero scena
   - Timestamp preciso
   - Testo narrazione/voiceover
   - Indicazioni visive dettagliate (drone shots, gimbal movements, transizioni, B-roll, dettagli da mostrare)
3. CTA: Call-to-action finale memorabile
4. HASHTAG: 10 hashtag strategici

Rispondi SOLO in JSON valido:
{
  "hook": "...",
  "scenes": [
    {"numero": 1, "timestamp": "0:00-0:05", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 2, "timestamp": "0:05-0:12", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 3, "timestamp": "0:12-0:20", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 4, "timestamp": "0:20-0:28", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 5, "timestamp": "0:28-0:36", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 6, "timestamp": "0:36-0:45", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 7, "timestamp": "0:45-0:55", "testo": "...", "indicazioniVisive": "..."}
  ],
  "cta": "...",
  "hashtags": ["...", "...", "...", "...", "...", "...", "...", "...", "...", "..."],
  "durata": "60 secondi"
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

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateScriptLuxury(openai: OpenAI, data: RequestData): Promise<VideoScript> {
  const prompt = `Sei un regista specializzato in video di lusso per immobili high-end. Genera uno SCRIPT VIDEO LUXURY CINEMATOGRAFICO per:

IMMOBILE: ${data.type}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
CARATTERISTICHE: ${data.features}
PUNTI DI FORZA: ${data.strengths}

Questo video è per clientela HNWI (High Net Worth Individuals). Deve essere:
- Cinematografico e raffinato
- Ritmo lento e elegante
- Focus su dettagli premium e lifestyle
- Musica suggerita: orchestra/piano/ambient

GENERA:
1. HOOK: Apertura cinematografica elegante (5 secondi)
2. SCENE: 8 scene luxury con:
   - Numero scena
   - Timestamp preciso
   - Testo voiceover sofisticato
   - Indicazioni visive premium (drone cinematico, slow motion, golden hour, dettagli design, lifestyle shots)
3. CTA: Invito esclusivo discreto
4. HASHTAG: 8 hashtag luxury real estate

Rispondi SOLO in JSON valido:
{
  "hook": "...",
  "scenes": [
    {"numero": 1, "timestamp": "0:00-0:05", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 2, "timestamp": "0:05-0:12", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 3, "timestamp": "0:12-0:20", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 4, "timestamp": "0:20-0:28", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 5, "timestamp": "0:28-0:38", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 6, "timestamp": "0:38-0:48", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 7, "timestamp": "0:48-0:55", "testo": "...", "indicazioniVisive": "..."},
    {"numero": 8, "timestamp": "0:55-1:05", "testo": "...", "indicazioniVisive": "..."}
  ],
  "cta": "...",
  "hashtags": ["...", "...", "...", "...", "...", "...", "...", "..."],
  "durata": "65 secondi"
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

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateViralHooks(openai: OpenAI, data: RequestData): Promise<string[]> {
  const prompt = `Sei un esperto di viral content per real estate su TikTok e Instagram. Genera 5 HOOKS VIRALI per video immobiliare:

IMMOBILE: ${data.type}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
CARATTERISTICHE: ${data.features}
TARGET: ${TARGET_DESCRIPTIONS[data.targetBuyer]}

Gli hooks devono:
- Catturare l'attenzione nei primi 2 secondi
- Creare curiosità o emozione
- Essere adatti al target specifico
- Funzionare su TikTok/Reels

TIPI DI HOOK DA GENERARE:
1. DOMANDA PROVOCATORIA (es. "Sapevi che...?")
2. AFFERMAZIONE SHOCK (es. "Questa casa costa meno di...")
3. SFIDA/TREND (es. "POV: Stai cercando casa a...")
4. CURIOSITÀ (es. "Aspetta di vedere cosa c'è dentro...")
5. EMOTIVO (es. "Immagina svegliarti ogni mattina con...")

Rispondi SOLO con un array JSON di 5 stringhe:
["hook1", "hook2", "hook3", "hook4", "hook5"]`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 30000, maxRetries: 2 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : parsed.hooks || [];
}

async function generateVideoAdvice(openai: OpenAI, data: RequestData): Promise<string> {
  const prompt = `Sei un consulente di video marketing immobiliare.
Basandoti su questi dati dell'immobile:
- Tipo: ${data.type}
- Località: ${data.location}
- Prezzo: ${data.price}
- Target: ${data.targetBuyer}
- Tono: ${data.tone}

Dai UN CONSIGLIO STRATEGICO personalizzato per creare il video perfetto per questo immobile.
Massimo 80 parole. Sii concreto e actionable. Focus su cosa filmare e come.`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }, { signal }),
    { timeoutMs: 30000, maxRetries: 2 }
  );

  return response.choices[0]?.message?.content || 'Consiglio non disponibile';
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Devi effettuare il login per utilizzare questa funzione.' },
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

    const userRateLimit = await checkUserRateLimit(user.id);
    if (!userRateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Limite raggiunto',
          message: userRateLimit.message || 'Troppi tentativi. Riprova tra 1 minuto.',
          resetAt: userRateLimit.resetAt
        },
        { status: 429 }
      );
    }

    const clientIp = getClientIp(request);
    if (clientIp) {
      const ipRateLimit = await checkIpRateLimit(clientIp);
      if (!ipRateLimit.allowed) {
        return NextResponse.json(
          { 
            error: 'Limite raggiunto',
            message: 'Troppi tentativi da questo indirizzo IP. Riprova tra 1 minuto.'
          },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    
    const validationResult = requestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: `Dati non validi: ${errors}` },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    
    const cacheContent = `video-script:${user.id}:${data.type.slice(0, 20)}:${data.location}:${data.targetBuyer}:${data.tone}`;
    
    const cacheService = getAICacheService();
    const cachedResult = await cacheService.get(cacheContent, 'video-scripts') as VideoScriptResult | null;
    
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        cached: true,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configurazione AI mancante. Contatta il supporto.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const [
      script15s,
      script30s,
      script60s,
      scriptLuxury,
      hooksVirali,
      consiglio
    ] = await Promise.all([
      generateScript15s(openai, data),
      generateScript30s(openai, data),
      generateScript60s(openai, data),
      generateScriptLuxury(openai, data),
      generateViralHooks(openai, data),
      generateVideoAdvice(openai, data),
    ]);

    const result: VideoScriptResult = {
      script15s,
      script30s,
      script60s,
      scriptLuxury,
      hooksVirali,
      consiglioVideo: consiglio,
    };

    await logGeneration(user.id, clientIp);

    await cacheService.set(cacheContent, 'video-scripts', result, 24 * 60 * 60);

    return NextResponse.json({
      ...result,
      cached: false,
    });

  } catch (error) {
    console.error('Video script generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        return NextResponse.json(
          { error: 'Il servizio AI sta impiegando troppo tempo. Riprova tra qualche secondo.' },
          { status: 504 }
        );
      }
      if (error.message.includes('rate') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'Limite di richieste AI raggiunto. Riprova tra qualche minuto.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Errore nella generazione degli script video. Riprova.' },
      { status: 500 }
    );
  }
}
