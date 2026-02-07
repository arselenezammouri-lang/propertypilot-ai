import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { createOpenAIWithTimeout, withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp } from '@/lib/utils/rate-limit';
import { rateLimiter } from '@/lib/utils/rate-limiter-memory';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';
import { z } from 'zod';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const openai = createOpenAIWithTimeout(process.env.OPENAI_API_KEY!);

const TitlesRequestSchema = z.object({
  tipoTransazione: z.enum(['vendita', 'affitto', 'affitto_breve']).optional().default('vendita'),
  tipoImmobile: z.enum(['casa', 'appartamento', 'villa', 'locale', 'terreno', 'ufficio']),
  localita: z.string().min(2, 'La località deve avere almeno 2 caratteri'),
  prezzo: z.string().optional(),
  superficie: z.string().optional(),
  camere: z.string().optional(),
  puntiChiave: z.string().min(10, 'Descrivi almeno i punti chiave dell\'immobile'),
  tono: z.enum(['professionale', 'emotivo', 'luxury']),
});

type TitlesRequest = z.infer<typeof TitlesRequestSchema>;

const TRANSAZIONE_PROMPTS: Record<string, { label: string; focus: string; keywords: string[] }> = {
  vendita: {
    label: 'in Vendita',
    focus: 'ROI, solidità dell\'investimento, valore catastale, potenziale di rivalutazione, qualità costruttiva',
    keywords: ['acquista', 'investi', 'tuo per sempre', 'proprietà', 'patrimonio', 'valore'],
  },
  affitto: {
    label: 'in Affitto',
    focus: 'garanzie contrattuali, target inquilini ideali, vicinanza servizi e trasporti, rapporto qualità-canone',
    keywords: ['affitta', 'canone', 'contratto', 'incluso', 'spese', 'disponibile da'],
  },
  affitto_breve: {
    label: 'in Affitto Breve / Turistico',
    focus: 'esperienza turistica, check-in facile, posizione strategica attrazioni, comfort vacanza, recensioni',
    keywords: ['soggiorno', 'vacanza', 'experience', 'self check-in', 'vicino a', 'perfetto per'],
  },
};

interface TitlesResponse {
  titoli: string[];
  clickbait: string[];
  luxury: string[];
  seo: string[];
  migliore: {
    titolo: string;
    motivazione: string;
  };
}

const TONE_PROMPTS = {
  professionale: `Tono professionale e informativo. Titoli chiari che comunicano immediatamente le caratteristiche principali.
Enfatizza dati concreti: metratura, posizione, numero stanze. Trasmetti affidabilità e serietà.`,
  emotivo: `Tono emotivo e aspirazionale. Titoli che evocano sogni e desideri.
Usa parole come "sogno", "ideale", "perfetto per te", "il tuo nuovo inizio".
Crea connessione emotiva immediata.`,
  luxury: `Tono esclusivo e raffinato per mercato alto. Titoli che comunicano prestigio e unicità.
Usa parole come "esclusivo", "unico", "raro", "prestigioso", "di pregio".
Evoca uno stile di vita d'élite.`,
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  casa: 'Casa',
  appartamento: 'Appartamento',
  villa: 'Villa',
  locale: 'Locale commerciale',
  terreno: 'Terreno',
  ufficio: 'Ufficio',
};

function buildPropertyContext(data: TitlesRequest): string {
  const transazione = TRANSAZIONE_PROMPTS[data.tipoTransazione || 'vendita'];
  const parts = [
    `Tipo Transazione: ${transazione.label}`,
    `Tipo Immobile: ${PROPERTY_TYPE_LABELS[data.tipoImmobile]}`,
    `Località: ${data.localita}`,
    `Punti chiave: ${data.puntiChiave}`,
    `FOCUS SPECIFICO: ${transazione.focus}`,
    `KEYWORDS DA USARE: ${transazione.keywords.join(', ')}`,
  ];
  
  if (data.prezzo) parts.push(`Prezzo/Canone: ${data.prezzo}`);
  if (data.superficie) parts.push(`Superficie: ${data.superficie}`);
  if (data.camere) parts.push(`Camere: ${data.camere}`);
  
  return parts.join('\n');
}

async function generateMainTitles(
  propertyContext: string,
  tonePrompt: string,
  propertyType: string,
  location: string,
  tipoTransazione: string
): Promise<string[]> {
  const transazione = TRANSAZIONE_PROMPTS[tipoTransazione || 'vendita'];
  
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto copywriter immobiliare specializzato in titoli ad alto CTR (Click-Through Rate).
Il tuo obiettivo è creare titoli che massimizzano i click sugli annunci immobiliari.

TIPO DI ANNUNCIO: ${transazione.label}
FOCUS: ${transazione.focus}
USA QUESTE KEYWORDS: ${transazione.keywords.join(', ')}

${tonePrompt}

Regole per titoli ad alto CTR:
- Massimo 60-80 caratteri per titolo (ottimale per portali immobiliari)
- Includi sempre la località e il tipo di immobile
- IMPORTANTE: Adatta il linguaggio al tipo di transazione (${transazione.label})
- Usa numeri quando possibile (es. "3 camere", "120 mq")
- Crea curiosità senza essere fuorviante
- Evita titoli generici o banali
- Ogni titolo deve essere unico e diverso dagli altri
- Scrivi in italiano

Genera esattamente 10 titoli, uno per riga, senza numerazione o altri testi.`,
        },
        {
          role: 'user',
          content: `Genera 10 titoli ad alto CTR per questo immobile:\n\n${propertyContext}`,
        },
      ],
      temperature: 0.85,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || '';
    return content
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 10)
      .slice(0, 10);
  });
}

async function generateClickbaitTitles(
  propertyContext: string,
  propertyType: string,
  location: string,
  tipoTransazione: string
): Promise<string[]> {
  const transazione = TRANSAZIONE_PROMPTS[tipoTransazione || 'vendita'];
  
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto di viral marketing immobiliare. Crea titoli "clickbait soft" che attirano click senza essere spam.

TIPO DI ANNUNCIO: ${transazione.label}
FOCUS: ${transazione.focus}

Regole per clickbait soft:
- Crea curiosità genuina ("Ecco perché...", "Il segreto di...", "Non crederai...")
- Usa domande retoriche adatte al tipo di transazione
- Mantieni la promessa nel titolo (niente false aspettative)
- Aggiungi urgenza soft ("Opportunità rara", "Solo per pochi", "Prima visione")
- Adatta il linguaggio a ${transazione.label}
- Massimo 70 caratteri
- Scrivi in italiano

Genera esattamente 3 titoli clickbait, uno per riga, senza numerazione.`,
        },
        {
          role: 'user',
          content: `Genera 3 titoli clickbait soft per:\n\n${propertyContext}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || '';
    return content
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 10)
      .slice(0, 3);
  });
}

async function generateLuxuryTitles(
  propertyContext: string,
  propertyType: string,
  location: string,
  tipoTransazione: string
): Promise<string[]> {
  const transazione = TRANSAZIONE_PROMPTS[tipoTransazione || 'vendita'];
  
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un copywriter per immobili di lusso e clienti alto-spendenti.

TIPO DI ANNUNCIO: ${transazione.label}
FOCUS: ${transazione.focus}

Regole per titoli luxury:
- Evoca esclusività e prestigio
- Usa parole chiave luxury: "Esclusivo", "Prestigioso", "Di pregio", "Raro", "Unico"
- Adatta il messaggio al tipo di transazione (${transazione.label})
- Suggerisci uno stile di vita raffinato
- Evita riferimenti al prezzo (il lusso non si discute)
- Target: clienti facoltosi, investitori, VIP
- Massimo 70 caratteri
- Scrivi in italiano

Genera esattamente 3 titoli luxury, uno per riga, senza numerazione.`,
        },
        {
          role: 'user',
          content: `Genera 3 titoli luxury per:\n\n${propertyContext}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || '';
    return content
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 10)
      .slice(0, 3);
  });
}

async function generateSEOTitles(
  propertyContext: string,
  propertyType: string,
  location: string,
  tipoTransazione: string
): Promise<string[]> {
  const transazione = TRANSAZIONE_PROMPTS[tipoTransazione || 'vendita'];
  const keywordAction = tipoTransazione === 'affitto' ? 'in affitto' : tipoTransazione === 'affitto_breve' ? 'affitto breve' : 'in vendita';
  
  return withRetryAndTimeout(async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto SEO per portali immobiliari italiani (Immobiliare.it, Idealista, Casa.it).

TIPO DI ANNUNCIO: ${transazione.label}
FOCUS SEO: ${transazione.focus}

Regole per titoli SEO-optimized:
- Includi keyword primarie: "${propertyType} ${keywordAction} ${location}"
- Struttura: [Tipo] + [Caratteristica principale] + [Località]
- Usa long-tail keywords per ${transazione.label}
- Ottimizza per ricerche locali
- Massimo 60 caratteri (ottimale per Google)
- Evita keyword stuffing
- Scrivi in italiano

Genera esattamente 3 titoli ottimizzati SEO, uno per riga, senza numerazione.`,
        },
        {
          role: 'user',
          content: `Genera 3 titoli SEO-optimized per:\n\n${propertyContext}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || '';
    return content
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 10)
      .slice(0, 3);
  });
}

async function selectBestTitle(
  allTitles: string[],
  propertyContext: string,
  tone: string
): Promise<{ titolo: string; motivazione: string }> {
  return withRetryAndTimeout(async () => {
    const titlesText = allTitles.map((t, i) => `${i + 1}. ${t}`).join('\n');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto di marketing immobiliare. Analizza i titoli e scegli il migliore per massimizzare il CTR.

Criteri di valutazione:
- Chiarezza del messaggio
- Capacità di attrarre click
- Rilevanza per il target
- Originalità rispetto alla concorrenza
- Lunghezza ottimale (50-70 caratteri)

Rispondi in questo formato ESATTO:
TITOLO: [il titolo migliore, copiato esattamente]
MOTIVAZIONE: [una spiegazione di 30-50 parole sul perché è il migliore]`,
        },
        {
          role: 'user',
          content: `Immobile:\n${propertyContext}\n\nTono richiesto: ${tone}\n\nTitoli da valutare:\n${titlesText}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    const titoloMatch = content.match(/TITOLO:\s*(.+)/i);
    const motivazioneMatch = content.match(/MOTIVAZIONE:\s*(.+)/is);
    
    return {
      titolo: titoloMatch?.[1]?.trim() || allTitles[0],
      motivazione: motivazioneMatch?.[1]?.trim() || 'Titolo selezionato per il miglior equilibrio tra chiarezza e attrattività.',
    };
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

    const clientIp = getClientIp(request);
    
    // In-memory rate limiting (fast, first line of defense)
    const memoryRateCheck = rateLimiter.check(user.id, 'ai-generation');
    if (!memoryRateCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: memoryRateCheck.message,
          retryAfter: memoryRateCheck.resetIn
        },
        { 
          status: 429,
          headers: { 'Retry-After': String(memoryRateCheck.resetIn) }
        }
      );
    }
    
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
    
    const validationResult = TitlesRequestSchema.safeParse(body);
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
    const propertyTypeLabel = PROPERTY_TYPE_LABELS[data.tipoImmobile];

    const aiCache = getAICacheService();
    const cacheKey = `titles_${propertyContext}_${data.tono}`;
    
    const cachedResponse = await aiCache.get(cacheKey, 'titles');
    if (cachedResponse) {
      logger.debug('[TITLES] Returning cached response');
      return NextResponse.json(cachedResponse);
    }

    logger.debug('[TITLES] Generating new AI titles');
    
    const tipoTrans = data.tipoTransazione || 'vendita';
    const [titoli, clickbait, luxury, seo] = await Promise.all([
      generateMainTitles(propertyContext, tonePrompt, propertyTypeLabel, data.localita, tipoTrans),
      generateClickbaitTitles(propertyContext, propertyTypeLabel, data.localita, tipoTrans),
      generateLuxuryTitles(propertyContext, propertyTypeLabel, data.localita, tipoTrans),
      generateSEOTitles(propertyContext, propertyTypeLabel, data.localita, tipoTrans),
    ]);

    const allTitles = [...titoli, ...clickbait, ...luxury, ...seo];
    const migliore = await selectBestTitle(allTitles, propertyContext, data.tono);

    const response: TitlesResponse = {
      titoli,
      clickbait,
      luxury,
      seo,
      migliore,
    };

    await aiCache.set(cacheKey, 'titles', response);

    return NextResponse.json(response);

  } catch (error: any) {
    logger.error('[TITLES] Error', error as Error, { component: 'generate-titles' });

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
