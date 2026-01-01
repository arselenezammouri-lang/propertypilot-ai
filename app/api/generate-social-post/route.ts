import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { createOpenAIWithTimeout, withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp } from '@/lib/utils/rate-limit';
import { z } from 'zod';

const openai = createOpenAIWithTimeout(process.env.OPENAI_API_KEY!);

const SocialPostRequestSchema = z.object({
  titolo: z.string().min(5, 'Il titolo deve avere almeno 5 caratteri'),
  descrizione: z.string().min(20, 'La descrizione deve avere almeno 20 caratteri'),
  prezzo: z.string().optional(),
  superficie: z.string().optional(),
  camere: z.string().optional(),
  bagni: z.string().optional(),
  localita: z.string().optional(),
  tono: z.enum(['professionale', 'emotivo', 'luxury']),
  lunghezza: z.enum(['breve', 'standard', 'lunga']),
});

type SocialPostRequest = z.infer<typeof SocialPostRequestSchema>;

interface SocialPostResponse {
  instagramPost: string;
  facebookPost: string;
  hashtags: string[];
  tiktokScript: string;
}

const TONE_PROMPTS = {
  professionale: `Tono professionale e autorevole. Usa un linguaggio formale ma accessibile. 
Enfatizza i dati tecnici e le caratteristiche oggettive. Trasmetti affidabilità e competenza.`,
  emotivo: `Tono emotivo e coinvolgente. Evoca sensazioni e immagini vivide.
Parla della "casa dei sogni", della "vita che merita", del "futuro che aspetta".
Usa domande retoriche e inviti all'azione emotivi.`,
  luxury: `Tono esclusivo e sofisticato per immobili di alto livello.
Usa termini come "esclusivo", "prestigioso", "unico", "raro".
Evoca uno stile di vita raffinato. Parla di "opportunità irripetibili" e "clientela selezionata".`,
};

const LENGTH_CONFIGS = {
  breve: { igWords: 30, fbWords: 50, tiktokSeconds: 15 },
  standard: { igWords: 60, fbWords: 100, tiktokSeconds: 30 },
  lunga: { igWords: 100, fbWords: 180, tiktokSeconds: 60 },
};

function buildPropertyContext(data: SocialPostRequest): string {
  const parts = [`Titolo: ${data.titolo}`, `Descrizione: ${data.descrizione}`];
  
  if (data.prezzo) parts.push(`Prezzo: ${data.prezzo}`);
  if (data.superficie) parts.push(`Superficie: ${data.superficie}`);
  if (data.camere) parts.push(`Camere: ${data.camere}`);
  if (data.bagni) parts.push(`Bagni: ${data.bagni}`);
  if (data.localita) parts.push(`Località: ${data.localita}`);
  
  return parts.join('\n');
}

async function generateInstagramPost(
  propertyContext: string,
  tonePrompt: string,
  maxWords: number
): Promise<string> {
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto social media manager specializzato in immobiliare italiano.
Scrivi post Instagram accattivanti e ottimizzati per l'engagement.

${tonePrompt}

Regole per Instagram:
- Massimo ${maxWords} parole
- Inizia con un hook potente (emoji o frase accattivante)
- Usa emoji strategiche (🏠 🌟 ✨ 📍 💎) ma non esagerare
- Includi una CTA chiara ("Contattami", "Scopri di più", "Link in bio")
- Formatta con spazi e a capo per leggibilità
- Non includere hashtag (li genero separatamente)
- Scrivi in italiano`,
        },
        {
          role: 'user',
          content: `Crea un post Instagram per questo immobile:\n\n${propertyContext}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    return completion.choices[0]?.message?.content || '';
  });
}

async function generateFacebookPost(
  propertyContext: string,
  tonePrompt: string,
  maxWords: number
): Promise<string> {
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto social media manager specializzato in immobiliare italiano.
Scrivi post Facebook professionali che generano lead qualificati.

${tonePrompt}

Regole per Facebook:
- Massimo ${maxWords} parole
- Inizia con una domanda o affermazione coinvolgente
- Struttura il post in paragrafi brevi
- Includi i dettagli chiave dell'immobile in modo chiaro
- Usa emoji con moderazione (max 3-4)
- CTA forte finale ("Chiama ora", "Prenota una visita", "Scrivi per info")
- Puoi usare elenchi puntati per le caratteristiche
- Scrivi in italiano`,
        },
        {
          role: 'user',
          content: `Crea un post Facebook per questo immobile:\n\n${propertyContext}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    return completion.choices[0]?.message?.content || '';
  });
}

async function generateHashtags(
  propertyContext: string,
  tone: string
): Promise<string[]> {
  return withRetryAndTimeout(async () => {
    const luxuryExtra = tone === 'luxury' 
      ? 'Includi hashtag per mercato luxury: #luxuryrealestate #luxuryhomes #premiumproperties' 
      : '';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto di SEO e hashtag per social media immobiliari.
Genera hashtag ottimizzati per massimizzare la visibilità.

Regole:
- Genera esattamente 15 hashtag
- Mix di hashtag popolari e di nicchia
- Includi hashtag locali italiani (#immobiliare #caseinvendita #realestateitaly)
- Includi hashtag specifici per tipo di immobile
- Formato: un hashtag per riga, senza altri testi
${luxuryExtra}`,
        },
        {
          role: 'user',
          content: `Genera hashtag per questo immobile:\n\n${propertyContext}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || '';
    const hashtags = content
      .split('\n')
      .map(h => h.trim())
      .filter(h => h.startsWith('#'))
      .slice(0, 15);

    return hashtags;
  });
}

async function generateTikTokScript(
  propertyContext: string,
  tonePrompt: string,
  durationSeconds: number
): Promise<string> {
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un creator TikTok/Reels esperto di immobiliare.
Scrivi script brevi, dinamici e virali per video immobiliari.

${tonePrompt}

Regole per TikTok/Reels (${durationSeconds} secondi):
- Scrivi uno script parlato, non didascalie
- Hook nei primi 3 secondi ("Aspetta...", "Devi vedere questo...", "La casa più...")
- Ritmo veloce e dinamico
- Frasi brevi e punchy
- Indica [PAUSA] dove fare pause drammatiche
- Indica [TRANSIZIONE] per cambio scena
- CTA finale chiaro ("Seguimi per altre case", "Scrivi HOME nei commenti")
- Usa linguaggio naturale da parlato, non formale
- Scrivi in italiano

Formato:
[HOOK - 0-3s] ...
[BODY - contenuto principale]
[CTA - ultimi 3s] ...`,
        },
        {
          role: 'user',
          content: `Crea uno script TikTok/Reels per questo immobile:\n\n${propertyContext}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato. Effettua il login per continuare.' },
        { status: 401 }
      );
    }

    const clientIp = getClientIp(request);
    
    if (clientIp) {
      const ipLimitResult = await checkIpRateLimit(clientIp);
      if (!ipLimitResult.allowed) {
        return NextResponse.json(
          { 
            error: ipLimitResult.message || 'Troppe richieste dal tuo indirizzo IP. Riprova tra qualche minuto.'
          },
          { status: 429 }
        );
      }
    }

    const userLimitResult = await checkUserRateLimit(user.id);
    if (!userLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: userLimitResult.message || 'Hai raggiunto il limite di richieste. Riprova tra qualche minuto.'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    const validationResult = SocialPostRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Dati non validi',
          details: validationResult.error.errors.map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const propertyContext = buildPropertyContext(data);
    const tonePrompt = TONE_PROMPTS[data.tono];
    const lengthConfig = LENGTH_CONFIGS[data.lunghezza];

    const aiCache = getAICacheService();
    const cacheKey = `${propertyContext}_${data.tono}_${data.lunghezza}`;
    
    const cachedResponse = await aiCache.get(cacheKey, 'social_post');
    if (cachedResponse) {
      console.log('[SOCIAL POST] Returning cached response');
      return NextResponse.json(cachedResponse);
    }

    console.log('[SOCIAL POST] Generating new AI content');
    
    const [instagramPost, facebookPost, hashtags, tiktokScript] = await Promise.all([
      generateInstagramPost(propertyContext, tonePrompt, lengthConfig.igWords),
      generateFacebookPost(propertyContext, tonePrompt, lengthConfig.fbWords),
      generateHashtags(propertyContext, data.tono),
      generateTikTokScript(propertyContext, tonePrompt, lengthConfig.tiktokSeconds),
    ]);

    const response: SocialPostResponse = {
      instagramPost,
      facebookPost,
      hashtags,
      tiktokScript,
    };

    await aiCache.set(cacheKey, 'social_post', response);

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('[SOCIAL POST] Error:', error);

    if (error.status === 429 || error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'OpenAI è temporaneamente sovraccarico. Riprova tra qualche minuto.' },
        { status: 429 }
      );
    }

    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Crediti OpenAI esauriti. Contatta il supporto.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Si è verificato un errore nella generazione. Riprova.' },
      { status: 500 }
    );
  }
}
