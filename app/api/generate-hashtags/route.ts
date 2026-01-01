import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';

const requestSchema = z.object({
  propertyType: z.string().min(3, 'Inserisci il tipo di immobile').max(100),
  location: z.string().min(2, 'Inserisci la località').max(150),
  strengths: z.string().min(10, 'Descrivi i punti di forza').max(500),
  price: z.string().min(1, 'Inserisci il prezzo').max(50),
  tone: z.enum(['professionale', 'emozionale', 'luxury', 'virale']),
  market: z.enum(['italy', 'usa']),
});

type RequestData = z.infer<typeof requestSchema>;

interface HashtagResult {
  virali: string[];
  nicchia: string[];
  localSeo: string[];
  usa: string[];
  consiglioStrategico: string;
  mixA: string[];
  mixB: string[];
  mixC: string[];
}

const TONE_DESCRIPTIONS: Record<string, string> = {
  professionale: 'hashtag professionali e credibili, adatti a LinkedIn e clienti corporate',
  emozionale: 'hashtag emotivi che evocano lifestyle e sogni, perfetti per Instagram',
  luxury: 'hashtag esclusivi per immobili premium e clientela HNWI',
  virale: 'hashtag trending e virali per massimizzare reach su TikTok e Reels',
};

async function generateViralHashtags(openai: OpenAI, data: RequestData): Promise<string[]> {
  const marketContext = data.market === 'usa' 
    ? 'per il mercato USA, usando hashtag in inglese popolari su Instagram/TikTok americano'
    : 'per il mercato italiano, mix italiano/inglese per massimo reach';

  const prompt = `Sei un esperto di social media marketing immobiliare. Genera 15 HASHTAG VIRALI ${marketContext}:

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
PUNTI DI FORZA: ${data.strengths}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Gli hashtag virali devono:
- Avere alto volume di ricerca
- Essere trending nel settore immobiliare
- Includere 5 hashtag generici viral (es. #fyp, #viral, #trending)
- Includere 5 hashtag real estate popolari
- Includere 5 hashtag lifestyle/aspirazionali

Rispondi SOLO con un array JSON di 15 stringhe (con #):
["#hashtag1", "#hashtag2", ...]`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 30000, maxRetries: 2 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : parsed.hashtags || parsed.virali || [];
}

async function generateNicheHashtags(openai: OpenAI, data: RequestData): Promise<string[]> {
  const marketContext = data.market === 'usa' 
    ? 'per il mercato USA, hashtag specifici per nicchia immobiliare americana'
    : 'per il mercato italiano, hashtag specifici per nicchia immobiliare italiana';

  const prompt = `Sei un esperto di social media marketing immobiliare. Genera 15 HASHTAG DI NICCHIA ${marketContext}:

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
PUNTI DI FORZA: ${data.strengths}
TONO: ${TONE_DESCRIPTIONS[data.tone]}

Gli hashtag di nicchia devono:
- Essere specifici per il tipo di immobile
- Targetizzare buyer specifici
- Includere 5 hashtag per tipologia immobile (es. #attico, #villa, #penthouse)
- Includere 5 hashtag per target buyer (es. #primacasa, #investimento, #relocating)
- Includere 5 hashtag per caratteristiche uniche (es. #vistammare, #terrazzo, #piscina)

Rispondi SOLO con un array JSON di 15 stringhe (con #):
["#hashtag1", "#hashtag2", ...]`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 30000, maxRetries: 2 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : parsed.hashtags || parsed.nicchia || [];
}

async function generateLocalSeoHashtags(openai: OpenAI, data: RequestData): Promise<string[]> {
  const marketContext = data.market === 'usa' 
    ? 'per local SEO USA (città, quartieri, stato)'
    : 'per local SEO Italia (città, quartieri, provincia, regione)';

  const prompt = `Sei un esperto di local SEO immobiliare. Genera 10 HASHTAG LOCAL SEO ${marketContext}:

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}

Gli hashtag local SEO devono:
- Includere nome città esatto
- Includere quartieri/zone della città
- Includere provincia/regione o stato
- Combinare località + tipo immobile
- Essere ricercabili localmente

Esempi formato:
${data.market === 'usa' 
  ? '#MiamiRealEstate #LuxuryMiami #SouthBeachCondos #FloridaHomes #MiamiBeachLife'
  : '#ImmobiliMilano #CasaMilano #AtticoMilano #MilanoCentro #LombardiaCasa'}

Rispondi SOLO con un array JSON di 10 stringhe (con #):
["#hashtag1", "#hashtag2", ...]`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 30000, maxRetries: 2 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : parsed.hashtags || parsed.localSeo || [];
}

async function generateUsaHashtags(openai: OpenAI, data: RequestData): Promise<string[]> {
  const prompt = `Sei un esperto di social media marketing immobiliare USA. Genera 15 HASHTAG specifici per il MERCATO AMERICANO:

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
PUNTI DI FORZA: ${data.strengths}

Gli hashtag USA devono:
- Essere in inglese americano
- Includere hashtag trending su Instagram/TikTok USA
- Includere 5 hashtag real estate USA (#realestate, #realtor, #justlisted, #homesweethome, #dreamhome)
- Includere 5 hashtag lifestyle americano (#americandream, #homeowner, #housegoals)
- Includere 5 hashtag specifici mercato USA (#forsale, #openhouse, #newlisting, #househunting)

Rispondi SOLO con un array JSON di 15 stringhe (con #):
["#hashtag1", "#hashtag2", ...]`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 30000, maxRetries: 2 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : parsed.hashtags || parsed.usa || [];
}

async function generateStrategicAdvice(openai: OpenAI, data: RequestData): Promise<string> {
  const prompt = `Sei un consulente di social media marketing immobiliare.
Basandoti su questi dati dell'immobile:
- Tipo: ${data.propertyType}
- Località: ${data.location}
- Prezzo: ${data.price}
- Mercato: ${data.market === 'usa' ? 'USA' : 'Italia'}
- Tono: ${data.tone}

Dai UN CONSIGLIO STRATEGICO personalizzato per l'uso degli hashtag su questo immobile.
Includi: piattaforma migliore, orario posting, numero hashtag ottimale, mix consigliato.
Massimo 60 parole. Sii concreto e actionable.`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }, { signal }),
    { timeoutMs: 25000, maxRetries: 2 }
  );

  return response.choices[0]?.message?.content || 'Consiglio non disponibile';
}

async function generateHashtagMixes(
  virali: string[], 
  nicchia: string[], 
  localSeo: string[],
  usa: string[],
  market: string
): Promise<{ mixA: string[]; mixB: string[]; mixC: string[] }> {
  const allHashtags = market === 'usa' 
    ? [...virali, ...nicchia, ...localSeo, ...usa]
    : [...virali, ...nicchia, ...localSeo];

  const uniqueHashtags = [...new Set(allHashtags)];

  // Mix A: Focus Virale (più virali + alcuni nicchia)
  const mixA = [
    ...virali.slice(0, 8),
    ...nicchia.slice(0, 4),
    ...localSeo.slice(0, 3),
  ].slice(0, 15);

  // Mix B: Focus Nicchia (equilibrato)
  const mixB = [
    ...nicchia.slice(0, 6),
    ...localSeo.slice(0, 5),
    ...virali.slice(0, 4),
  ].slice(0, 15);

  // Mix C: Focus Local SEO (più locale)
  const mixC = [
    ...localSeo.slice(0, 6),
    ...nicchia.slice(0, 5),
    ...virali.slice(0, 4),
  ].slice(0, 15);

  return { mixA, mixB, mixC };
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
    
    const cacheContent = `hashtags:${user.id}:${data.propertyType.slice(0, 20)}:${data.location}:${data.tone}:${data.market}`;
    
    const cacheService = getAICacheService();
    const cachedResult = await cacheService.get(cacheContent, 'hashtags') as HashtagResult | null;
    
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

    // Generate all hashtag types in parallel
    const [virali, nicchia, localSeo, usa, consiglio] = await Promise.all([
      generateViralHashtags(openai, data),
      generateNicheHashtags(openai, data),
      generateLocalSeoHashtags(openai, data),
      data.market === 'usa' 
        ? generateUsaHashtags(openai, data) 
        : Promise.resolve([]),
      generateStrategicAdvice(openai, data),
    ]);

    // Generate optimized mixes
    const { mixA, mixB, mixC } = await generateHashtagMixes(
      virali, nicchia, localSeo, usa, data.market
    );

    const result: HashtagResult = {
      virali,
      nicchia,
      localSeo,
      usa,
      consiglioStrategico: consiglio,
      mixA,
      mixB,
      mixC,
    };

    await logGeneration(user.id, clientIp);

    await cacheService.set(cacheContent, 'hashtags', result, 24 * 60 * 60);

    return NextResponse.json({
      ...result,
      cached: false,
    });

  } catch (error) {
    console.error('Hashtag generation error:', error);
    
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
      { error: 'Errore nella generazione degli hashtag. Riprova.' },
      { status: 500 }
    );
  }
}
