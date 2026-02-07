import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';
import { getUserLocale, getErrorMessage } from '@/lib/i18n/api-locale';
import { logger } from '@/lib/utils/safe-logger';

const requestSchema = z.object({
  tipoTransazione: z.enum(['vendita', 'affitto', 'affitto_breve']).optional().default('vendita'),
  originalText: z.string().min(50, 'Il testo originale deve avere almeno 50 caratteri').max(3000),
  propertyType: z.string().min(3, 'Inserisci il tipo di immobile').max(100),
  location: z.string().min(2, 'Inserisci la località').max(150),
  tone: z.enum(['professional', 'emotional', 'luxury', 'seo']),
});

type RequestData = z.infer<typeof requestSchema>;

const TRANSAZIONE_REFINE: Record<string, { label: string; focus: string; cta: string }> = {
  vendita: {
    label: 'in Vendita',
    focus: 'Enfatizza ROI, solidità costruttiva, potenziale di rivalutazione, dettagli catastali, posizione strategica per valore futuro.',
    cta: 'Prenota subito una visita per scoprire la tua futura casa',
  },
  affitto: {
    label: 'in Affitto',
    focus: 'Enfatizza garanzie contrattuali, vicinanza a servizi e trasporti, ideale per il target inquilino, canone competitivo, cosa è incluso.',
    cta: 'Contattaci oggi per prenotare una visita e bloccare questo appartamento',
  },
  affitto_breve: {
    label: 'in Affitto Breve',
    focus: 'Enfatizza esperienza turistica, check-in semplice, vicinanza attrazioni, comfort e servizi per vacanzieri, recensioni positive.',
    cta: 'Prenota ora il tuo soggiorno indimenticabile',
  },
};

interface RefinedListing {
  titolo: string;
  descrizione: string;
  highlights: string[];
  cta: string;
  metaDescription: string;
}

interface RefineListingResult {
  professional: RefinedListing;
  emotional: RefinedListing;
  luxury: RefinedListing;
  seo: RefinedListing;
  analisiOriginale: string;
}

const TONE_PROMPTS: Record<string, string> = {
  professional: `Stile PROFESSIONAL PERFECTED:
- Tono autorevole ma accessibile
- Focus su dati concreti e vantaggi tangibili
- Linguaggio preciso e credibile
- Struttura logica e chiara
- Trasmette competenza e affidabilità`,
  
  emotional: `Stile EMOTIONAL UPGRADE:
- Tono coinvolgente ed evocativo
- Focus su emozioni e sensazioni
- Linguaggio che tocca il cuore
- Storytelling immersivo
- Trasmette calore e connessione`,
  
  luxury: `Stile LUXURY UPGRADE:
- Tono sofisticato ed esclusivo
- Focus su prestigio e raffinatezza
- Linguaggio ricercato ed elegante
- Evoca uno stile di vita d'élite
- Trasmette esclusività e status`,
  
  seo: `Stile SEO BOOSTED:
- Ottimizzato per motori di ricerca
- Keywords strategiche integrate naturalmente
- Titoli e sottotitoli H1/H2 ottimizzati
- Meta description perfetta
- Massima discoverability online`
};

async function generateProfessionalVersion(openai: OpenAI, data: RequestData): Promise<RefinedListing> {
  const transazione = TRANSAZIONE_REFINE[data.tipoTransazione || 'vendita'];
  
  const prompt = `Sei un copywriter immobiliare senior. Migliora questo annuncio con stile PROFESSIONAL PERFECTED.

TIPO ANNUNCIO: ${transazione.label}
FOCUS SPECIFICO: ${transazione.focus}
CTA CONSIGLIATA: ${transazione.cta}

ANNUNCIO ORIGINALE:
${data.originalText}

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}

${TONE_PROMPTS.professional}

GENERA un annuncio migliorato in JSON:
{
  "titolo": "Titolo professionale e autorevole (max 80 caratteri)",
  "descrizione": "Descrizione professionale migliorata, chiara, con dati concreti e vantaggi tangibili. Struttura logica in paragrafi. (200-350 parole)",
  "highlights": ["5 bullet points professionali che evidenziano i vantaggi chiave dell'immobile in modo credibile e concreto"],
  "cta": "Call-to-action professionale che ispira fiducia e invita all'azione (30-50 parole)",
  "metaDescription": "Meta description SEO ottimizzata per Google, 150-160 caratteri, con keyword principale"
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

async function generateEmotionalVersion(openai: OpenAI, data: RequestData): Promise<RefinedListing> {
  const transazione = TRANSAZIONE_REFINE[data.tipoTransazione || 'vendita'];
  
  const prompt = `Sei un copywriter specializzato in emotional marketing immobiliare. Migliora questo annuncio con stile EMOTIONAL UPGRADE.

TIPO ANNUNCIO: ${transazione.label}
FOCUS SPECIFICO: ${transazione.focus}
CTA CONSIGLIATA: ${transazione.cta}

ANNUNCIO ORIGINALE:
${data.originalText}

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}

${TONE_PROMPTS.emotional}

GENERA un annuncio emozionale migliorato in JSON:
{
  "titolo": "Titolo emozionale ed evocativo che tocca il cuore (max 80 caratteri)",
  "descrizione": "Descrizione emozionale con storytelling, sensazioni, immagini vivide. Fai sentire il lettore già a casa. Coinvolgi i sensi. (200-350 parole)",
  "highlights": ["5 bullet points emozionali che trasformano le caratteristiche in benefici emotivi e esperienze"],
  "cta": "Call-to-action emozionale che crea urgenza emotiva e desiderio (30-50 parole)",
  "metaDescription": "Meta description SEO con appeal emozionale, 150-160 caratteri"
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

async function generateLuxuryVersion(openai: OpenAI, data: RequestData): Promise<RefinedListing> {
  const transazione = TRANSAZIONE_REFINE[data.tipoTransazione || 'vendita'];
  
  const prompt = `Sei un copywriter di ultra-lusso per immobili high-end. Migliora questo annuncio con stile LUXURY UPGRADE.

TIPO ANNUNCIO: ${transazione.label}
FOCUS SPECIFICO: ${transazione.focus}
CTA CONSIGLIATA: ${transazione.cta}

ANNUNCIO ORIGINALE:
${data.originalText}

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}

${TONE_PROMPTS.luxury}

GENERA un annuncio luxury migliorato in JSON:
{
  "titolo": "Titolo luxury elegante e prestigioso (max 80 caratteri)",
  "descrizione": "Descrizione luxury sofisticata, linguaggio ricercato, evoca esclusività e raffinatezza. Materiali pregiati, dettagli di classe. (200-350 parole)",
  "highlights": ["5 bullet points luxury che trasformano le caratteristiche in simboli di prestigio, status e raffinatezza"],
  "cta": "Call-to-action esclusivo per clientela selezionata che comprende il valore dell'eccellenza (30-50 parole)",
  "metaDescription": "Meta description SEO luxury, 150-160 caratteri, evoca esclusività"
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

async function generateSeoVersion(openai: OpenAI, data: RequestData): Promise<RefinedListing> {
  const transazione = TRANSAZIONE_REFINE[data.tipoTransazione || 'vendita'];
  
  const prompt = `Sei un SEO specialist e copywriter immobiliare. Migliora questo annuncio con stile SEO BOOSTED.

TIPO ANNUNCIO: ${transazione.label}
FOCUS SPECIFICO: ${transazione.focus}
CTA CONSIGLIATA: ${transazione.cta}

ANNUNCIO ORIGINALE:
${data.originalText}

IMMOBILE: ${data.propertyType}
LOCALITÀ: ${data.location}

${TONE_PROMPTS.seo}

GENERA un annuncio SEO-ottimizzato in JSON:
{
  "titolo": "Titolo SEO ottimizzato con keyword principale, location, tipo immobile (max 80 caratteri)",
  "descrizione": "Descrizione SEO-friendly con keywords naturalmente integrate, struttura con paragrafi tematici, ottimizzata per snippet Google. Mantieni leggibilità umana. (200-350 parole)",
  "highlights": ["5 bullet points SEO-ottimizzati con keywords secondarie, formattati per featured snippets"],
  "cta": "Call-to-action con micro-conversioni e keywords di intent (30-50 parole)",
  "metaDescription": "Meta description SEO perfetta: 150-160 caratteri esatti, keyword principale all'inizio, call-to-action finale"
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

async function analyzeOriginal(openai: OpenAI, data: RequestData): Promise<string> {
  const prompt = `Analizza brevemente questo annuncio immobiliare e identifica i punti deboli da migliorare:

"${data.originalText.slice(0, 500)}"

Fornisci un'analisi in 2-3 frasi (max 80 parole) che evidenzi:
- Cosa manca o è debole
- Cosa può essere migliorato
- Potenziale non sfruttato

Sii costruttivo e professionale.`;

  const response = await withRetryAndTimeout(
    (signal) => openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    }, { signal }),
    { timeoutMs: 25000, maxRetries: 2 }
  );

  return response.choices[0]?.message?.content || 'Analisi non disponibile';
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
    
    const cacheContent = `refine:${user.id}:${data.originalText.slice(0, 100)}:${data.propertyType}:${data.location}:${data.tone}`;
    
    const cacheService = getAICacheService();
    const cachedResult = await cacheService.get(cacheContent, 'refine-listing') as RefineListingResult | null;
    
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

    const [professional, emotional, luxury, seo, analisi] = await Promise.all([
      generateProfessionalVersion(openai, data),
      generateEmotionalVersion(openai, data),
      generateLuxuryVersion(openai, data),
      generateSeoVersion(openai, data),
      analyzeOriginal(openai, data),
    ]);

    const result: RefineListingResult = {
      professional,
      emotional,
      luxury,
      seo,
      analisiOriginale: analisi,
    };

    await logGeneration(user.id, clientIp);

    await cacheService.set(cacheContent, 'refine-listing', result, 24 * 60 * 60);

    return NextResponse.json({
      ...result,
      cached: false,
    });

  } catch (error) {
    logger.error('Refine listing generation error', error, { endpoint: '/api/refine-listing' });
    
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
    
    // Ottieni lingua per messaggio errore
    const errorLocale = await getUserLocale(request, user?.id, supabase);
    
    return NextResponse.json(
      { error: getErrorMessage(errorLocale, 'internalError') },
      { status: 500 }
    );
  }
}
