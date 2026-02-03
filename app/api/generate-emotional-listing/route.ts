import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';

const requestSchema = z.object({
  tipoTransazione: z.enum(['vendita', 'affitto', 'affitto_breve']).optional().default('vendita'),
  propertyType: z.string().min(3, 'Inserisci il tipo di immobile').max(100),
  location: z.string().min(2, 'Inserisci la località').max(150),
  features: z.string().min(10, 'Descrivi le caratteristiche').max(800),
  strengths: z.string().min(10, 'Descrivi i punti di forza').max(500),
  price: z.string().min(1, 'Inserisci il prezzo').max(50),
  targetBuyer: z.enum(['famiglie', 'giovani', 'investitori', 'luxury', 'turisti']),
  tone: z.enum(['emozionale', 'luxury', 'caldo']),
});

type RequestData = z.infer<typeof requestSchema>;

const TRANSAZIONE_EMOTIONAL: Record<string, { label: string; emotion: string; narrative: string }> = {
  vendita: {
    label: 'in Vendita',
    emotion: 'senso di possesso, radici, investimento emotivo, il sogno di una vita, patrimonio da tramandare',
    narrative: 'Racconta la storia di chi sta per scrivere un nuovo capitolo della propria vita, mettendo radici in un luogo che diventerà il cuore della famiglia.',
  },
  affitto: {
    label: 'in Affitto',
    emotion: 'libertà, flessibilità, nuova avventura, casa pronta ad accoglierti, zero pensieri',
    narrative: 'Racconta la comodità di vivere senza vincoli, in uno spazio che ti aspetta già perfetto, pronto per le tue storie quotidiane.',
  },
  affitto_breve: {
    label: 'in Affitto Breve / Turistico',
    emotion: 'esperienza indimenticabile, vacanza da sogno, scoperta, relax totale, momenti magici',
    narrative: 'Trasporta il lettore in una vacanza perfetta: sveglie con vista, colazioni al sole, serate romantiche, avventure da ricordare.',
  },
};

interface EmotionalListing {
  titolo: string;
  aperturaEmozionale: string;
  testoSensoriale: string;
  descrizioneNarrativa: string;
  emotionalHighlights: string[];
  sezioneImmagina: string;
  ctaEmozionale: string;
}

interface EmotionalListingResult {
  storytelling: EmotionalListing;
  luxury: EmotionalListing;
  familyWarm: EmotionalListing;
  consiglioCreativo: string;
}

const TARGET_CONTEXT: Record<string, string> = {
  famiglie: 'famiglie con bambini, focus su sicurezza, spazi per crescere, ricordi da creare, scuole vicine, giardino per giocare',
  giovani: 'giovani professionisti e coppie, focus su lifestyle moderno, aperitivi sul terrazzo, connessione, design contemporaneo',
  investitori: 'investitori immobiliari, focus su potenziale, rendimento, qualità costruttiva, valore nel tempo',
  luxury: 'clientela HNWI, focus su esclusività assoluta, prestigio, materiali pregiati, privacy, lifestyle élite',
  turisti: 'turisti e viaggiatori, focus su esperienza vacanza, attrazioni vicine, comfort, check-in facile, recensioni top',
};

const TONE_CONTEXT: Record<string, string> = {
  emozionale: 'narrativo e coinvolgente, evoca emozioni profonde, usa metafore e immagini vivide',
  luxury: 'sofisticato ed esclusivo, elegante, evoca raffinatezza e prestigio, linguaggio ricercato',
  caldo: 'accogliente e familiare, evoca calore domestico, intimità, comfort, sensazione di casa',
};

async function generateStorytellingVersion(openai: OpenAI, data: RequestData): Promise<EmotionalListing> {
  const transazione = TRANSAZIONE_EMOTIONAL[data.tipoTransazione || 'vendita'];
  
  const prompt = `Sei un copywriter di lusso specializzato in real estate storytelling. Crea una descrizione EMOTIONAL STORYTELLING per:

TIPO ANNUNCIO: ${transazione.label}
EMOZIONI DA EVOCARE: ${transazione.emotion}
STILE NARRATIVO: ${transazione.narrative}

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
CARATTERISTICHE: ${data.features}
PUNTI DI FORZA: ${data.strengths}
TARGET: ${TARGET_CONTEXT[data.targetBuyer]}
TONO: ${TONE_CONTEXT[data.tone]}

La versione STORYTELLING deve:
- Raccontare una storia emotiva dell'immobile
- Creare connessione profonda con il lettore
- Usare tecniche di storytelling immersivo
- Far "vivere" l'esperienza dell'immobile

GENERA in JSON:
{
  "titolo": "Titolo evocativo e memorabile (max 80 caratteri)",
  "aperturaEmozionale": "Prima frase d'impatto che cattura l'attenzione con un'emozione forte (40-60 parole)",
  "testoSensoriale": "Descrizione che coinvolge i 5 sensi: vista, udito, olfatto, tatto, gusto. Fai sentire al lettore di essere lì (80-100 parole)",
  "descrizioneNarrativa": "La storia di questa casa: chi l'ha amata, i momenti che custodisce, la vita che ospita. Narrativa coinvolgente (100-150 parole)",
  "emotionalHighlights": ["5 bullet points emotivi che trasformano le caratteristiche in benefici emotivi. Ogni punto deve evocare un'emozione specifica"],
  "sezioneImmagina": "Sezione 'Immagina questo...' - scenario vivido e desiderabile di vita quotidiana in questa casa (60-80 parole)",
  "ctaEmozionale": "Call-to-action emozionale che spinge all'azione con urgenza emotiva (25-35 parole)"
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateLuxuryVersion(openai: OpenAI, data: RequestData): Promise<EmotionalListing> {
  const transazione = TRANSAZIONE_EMOTIONAL[data.tipoTransazione || 'vendita'];
  
  const prompt = `Sei un copywriter di ultra-lusso per immobili high-end. Crea una descrizione LUXURY EMOTIONAL per:

TIPO ANNUNCIO: ${transazione.label}
EMOZIONI DA EVOCARE: ${transazione.emotion}
STILE NARRATIVO: ${transazione.narrative}

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
CARATTERISTICHE: ${data.features}
PUNTI DI FORZA: ${data.strengths}
TARGET: Clientela HNWI, collezionisti, élite internazionale
TONO: Sofisticato, esclusivo, raffinato

La versione LUXURY deve:
- Evocare esclusività e prestigio
- Usare un linguaggio elegante e ricercato
- Far sentire il lettore parte di un'élite
- Trasmettere valore e raffinatezza assoluta

GENERA in JSON:
{
  "titolo": "Titolo luxury elegante e prestigioso (max 80 caratteri)",
  "aperturaEmozionale": "Apertura sofisticata che evoca esclusività e raffinatezza (40-60 parole)",
  "testoSensoriale": "Descrizione sensoriale luxury: materiali pregiati, luce dorata, profumi di legni nobili, sensazioni tattili di superfici pregiate (80-100 parole)",
  "descrizioneNarrativa": "Narrativa che evoca uno stile di vita esclusivo, momenti di pura eleganza, la quintessenza del vivere raffinato (100-150 parole)",
  "emotionalHighlights": ["5 bullet points luxury che trasformano le caratteristiche in simboli di prestigio e status. Ogni punto evoca esclusività"],
  "sezioneImmagina": "Sezione 'Immagina questo...' - scenario di vita luxury: champagne al tramonto, colazioni vista panoramica, serate esclusive (60-80 parole)",
  "ctaEmozionale": "CTA esclusivo che crea urgenza per chi comprende il valore dell'eccellenza (25-35 parole)"
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

async function generateFamilyWarmVersion(openai: OpenAI, data: RequestData): Promise<EmotionalListing> {
  const transazione = TRANSAZIONE_EMOTIONAL[data.tipoTransazione || 'vendita'];
  
  const prompt = `Sei un copywriter specializzato in comunicazione per famiglie. Crea una descrizione FAMILY WARM per:

TIPO ANNUNCIO: ${transazione.label}
EMOZIONI DA EVOCARE: ${transazione.emotion}
STILE NARRATIVO: ${transazione.narrative}

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}
PREZZO: ${data.price}
CARATTERISTICHE: ${data.features}
PUNTI DI FORZA: ${data.strengths}
TARGET: Famiglie, genitori, coppie che vogliono mettere radici
TONO: Caldo, accogliente, rassicurante, familiare

La versione FAMILY WARM deve:
- Evocare calore domestico e sicurezza
- Far sentire il lettore "a casa"
- Parlare di momenti familiari, ricordi, crescita
- Trasmettere stabilità e amore

GENERA in JSON:
{
  "titolo": "Titolo caldo e accogliente che parla al cuore delle famiglie (max 80 caratteri)",
  "aperturaEmozionale": "Apertura che evoca il concetto di 'casa' come rifugio d'amore e sicurezza (40-60 parole)",
  "testoSensoriale": "Descrizione sensoriale familiare: profumo di biscotti appena sfornati, risate dei bambini, luce calda del mattino, abbracci sul divano (80-100 parole)",
  "descrizioneNarrativa": "Narrativa che racconta la vita familiare: primi passi, colazioni domenicali, feste di compleanno, momenti preziosi da custodire (100-150 parole)",
  "emotionalHighlights": ["5 bullet points family-oriented che trasformano le caratteristiche in benefici per la famiglia. Ogni punto evoca amore e sicurezza"],
  "sezioneImmagina": "Sezione 'Immagina questo...' - scenario di vita familiare: bambini che giocano, cene insieme, domeniche pigre, albero di Natale (60-80 parole)",
  "ctaEmozionale": "CTA che parla al cuore dei genitori, evocando il desiderio di dare il meglio alla propria famiglia (25-35 parole)"
}`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      response_format: { type: 'json_object' },
    }, { signal }),
    { timeoutMs: 45000, maxRetries: 3 }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Nessuna risposta dall\'AI');
  
  return JSON.parse(content);
}

async function generateCreativeAdvice(openai: OpenAI, data: RequestData): Promise<string> {
  const prompt = `Sei un consulente di marketing emozionale immobiliare.
Basandoti su questi dati dell'immobile:
- Tipo: ${data.propertyType}
- Località: ${data.location}
- Target: ${data.targetBuyer}
- Tono: ${data.tone}

Dai UN CONSIGLIO CREATIVO personalizzato per massimizzare l'impatto emozionale di questa inserzione.
Suggerisci: quale versione usare per quale canale, elementi visivi da abbinare, timing migliore.
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
    
    const cacheContent = `emotional:${user.id}:${data.propertyType.slice(0, 20)}:${data.location}:${data.targetBuyer}:${data.tone}`;
    
    const cacheService = getAICacheService();
    const cachedResult = await cacheService.get(cacheContent, 'emotional-listing') as EmotionalListingResult | null;
    
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

    const [storytelling, luxury, familyWarm, consiglio] = await Promise.all([
      generateStorytellingVersion(openai, data),
      generateLuxuryVersion(openai, data),
      generateFamilyWarmVersion(openai, data),
      generateCreativeAdvice(openai, data),
    ]);

    const result: EmotionalListingResult = {
      storytelling,
      luxury,
      familyWarm,
      consiglioCreativo: consiglio,
    };

    await logGeneration(user.id, clientIp);

    await cacheService.set(cacheContent, 'emotional-listing', result, 24 * 60 * 60);

    return NextResponse.json({
      ...result,
      cached: false,
    });

  } catch (error) {
    console.error('Emotional listing generation error:', error);
    
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
      { error: 'Errore nella generazione della descrizione emozionale. Riprova.' },
      { status: 500 }
    );
  }
}
