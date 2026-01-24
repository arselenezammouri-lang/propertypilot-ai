import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import type { Lead } from '@/lib/types/database.types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const followupRequestSchema = z.object({
  tone: z.enum(['persuasivo', 'gentile', 'emozionale']).default('gentile'),
});

type FollowupTone = 'persuasivo' | 'gentile' | 'emozionale';

interface PropertyDetails {
  title?: string;
  location?: string;
  price?: string;
  surface?: string;
  rooms?: string;
  url?: string;
}

interface FollowUpMessages {
  whatsapp: {
    message: string;
    suggested_reply?: string;
  };
  email: {
    subject: string;
    body: string;
    cta: string;
    ps?: string;
  };
  sms: {
    message: string;
  };
  metadata: {
    categoria: 'hot' | 'warm' | 'cold';
    lead_score: number;
    tone: FollowupTone;
    property_included: boolean;
  };
}

// Determina categoria dal lead_score
function getCategoriaFromScore(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 80) return 'hot';
  if (score >= 50) return 'warm';
  return 'cold';
}

// Recupera property details se property_url match saved_listings
async function getPropertyDetails(
  supabase: ReturnType<typeof createClient>,
  propertyUrl: string | null
): Promise<PropertyDetails> {
  if (!propertyUrl) {
    return { url: undefined };
  }

  try {
    // Cerca match in saved_listings per source_url
    const { data: listing } = await supabase
      .from('saved_listings')
      .select('title, property_data, source_url')
      .eq('source_url', propertyUrl)
      .single();

    if (listing && listing.property_data) {
      const propertyData = listing.property_data as any;
      return {
        title: listing.title || propertyData.location || undefined,
        location: propertyData.location || undefined,
        price: propertyData.price || undefined,
        surface: propertyData.size ? `${propertyData.size} mq` : undefined,
        rooms: propertyData.rooms ? `${propertyData.rooms} locali` : undefined,
        url: propertyUrl,
      };
    }
  } catch (error) {
    console.warn('[FOLLOWUP] Error fetching property details:', error);
  }

  // Se non match, ritorna solo URL
  return { url: propertyUrl };
}

// Tone descriptions per prompt
const TONE_DESCRIPTIONS: Record<FollowupTone, string> = {
  persuasivo: 'persuasivo, orientato alla conversione, usa argomenti razionali e benefici concreti',
  gentile: 'gentile, empatico, cortese, orientato alla relazione e al supporto',
  emozionale: 'emozionale, coinvolgente, usa storytelling e connessione sentimentale',
};

// Categoria descriptions per prompt
const CATEGORIA_STRATEGIES: Record<'hot' | 'warm' | 'cold', string> = {
  hot: 'HOT LEAD (80-100): Alta urgenza, pronti all\'acquisto. Usa linguaggio diretto, crea urgenza ("Disponibile oggi pomeriggio?"), menziona scarsità ("Altri 3 interessati"), CTA immediato.',
  warm: 'WARM LEAD (50-79): Interessato ma ha bisogno di nurturing. Aggiungi valore ("Ho altri 2 immobili simili"), personalizza proposta, tempistica soft ("Questo weekend disponibile").',
  cold: 'COLD LEAD (0-49): Ricerca esplorativa, richiede qualificazione. Usa approccio educativo ("La zona è in forte crescita"), qualifica interesse ("Cosa cerchi esattamente?"), CTA soft.',
};

// Genera prompt per WhatsApp
function buildWhatsAppPrompt(
  lead: Lead,
  property: PropertyDetails,
  categoria: 'hot' | 'warm' | 'cold',
  tone: FollowupTone
): string {
  const categoriaStrategy = CATEGORIA_STRATEGIES[categoria];
  const toneDesc = TONE_DESCRIPTIONS[tone];

  let propertyInfo = '';
  if (property.title) {
    propertyInfo = `\nImmobile: ${property.title}`;
    if (property.location) propertyInfo += ` a ${property.location}`;
    if (property.price) propertyInfo += ` - ${property.price}`;
    if (property.url) propertyInfo += `\nLink: ${property.url}`;
  } else if (property.url) {
    propertyInfo = `\nLink immobile: ${property.url}`;
  }

  return `Sei un agente immobiliare esperto italiano. Genera un messaggio WhatsApp di MASSIMO 300 caratteri (conta ogni carattere!).

LEAD:
Nome: ${lead.nome}
Messaggio originale: ${lead.messaggio || 'Nessun messaggio specifico'}
Score: ${lead.lead_score} - Categoria: ${categoria.toUpperCase()}
${propertyInfo}

REGOLE:
- Usa MASSIMO 300 caratteri totali (conta ogni carattere!)
- Usa emoji appropriati (max 3-4)
- Linguaggio diretto e conversazionale
- NON usare placeholder [Nome] - usa direttamente "${lead.nome}"
- Tono: ${toneDesc}
- Strategia categoria: ${categoriaStrategy}

Per HOT: "Disponibile oggi pomeriggio? Altri 3 interessati questo weekend."
Per WARM: "Ho altri 2 immobili simili da mostrarti, questo weekend disponibile?"
Per COLD: "Cosa cerchi esattamente? Possiamo parlarne?"

Rispondi SOLO in JSON valido:
{
  "message": "...",
  "suggested_reply": "..." (reazione prevista del lead in 1 frase)
}`;
}

// Genera prompt per Email
function buildEmailPrompt(
  lead: Lead,
  property: PropertyDetails,
  categoria: 'hot' | 'warm' | 'cold',
  tone: FollowupTone
): string {
  const categoriaStrategy = CATEGORIA_STRATEGIES[categoria];
  const toneDesc = TONE_DESCRIPTIONS[tone];

  let propertyInfo = '';
  if (property.title) {
    propertyInfo = `\n\nIMMOBILE DI INTERESSE:
Titolo: ${property.title}`;
    if (property.location) propertyInfo += `\nLocalità: ${property.location}`;
    if (property.price) propertyInfo += `\nPrezzo: ${property.price}`;
    if (property.surface) propertyInfo += `\nSuperficie: ${property.surface}`;
    if (property.rooms) propertyInfo += `\nLocali: ${property.rooms}`;
    if (property.url) propertyInfo += `\nLink dettagli: ${property.url}`;
  } else if (property.url) {
    propertyInfo = `\n\nLINK IMMOBILE DI INTERESSE:\n${property.url}`;
  }

  return `Sei un copywriter immobiliare professionale italiano. Genera un'EMAIL professionale di 150-200 parole.

LEAD:
Nome: ${lead.nome}
Email: ${lead.email || 'N/A'}
Messaggio originale: ${lead.messaggio || 'Nessun messaggio specifico'}
Score: ${lead.lead_score} - Categoria: ${categoria.toUpperCase()}${propertyInfo}

REGOLE:
- Email professionale di 150-200 parole
- Formale ma accessibile
- Focus sui dettagli dell'immobile (se disponibili)
- CTA chiara e convincente
- Tono: ${toneDesc}
- Strategia categoria: ${categoriaStrategy}
- NON usare placeholder [Nome] - usa direttamente "${lead.nome}"

Per HOT: Oggetto con urgenza, proposta visita immediata, menziona scarsità
Per WARM: Oggetto informativo, aggiungi dettagli extra, proposta weekend
Per COLD: Oggetto educativo, invita a qualificazione, CTA soft

Rispondi SOLO in JSON valido:
{
  "subject": "Oggetto email (max 60 caratteri)",
  "body": "Corpo email (150-200 parole)",
  "cta": "Call-to-action chiara",
  "ps": "Post scriptum opzionale per urgenza/scarsità"
}`;
}

// Genera prompt per SMS
function buildSMSPrompt(
  lead: Lead,
  property: PropertyDetails,
  categoria: 'hot' | 'warm' | 'cold',
  tone: FollowupTone
): string {
  const categoriaStrategy = CATEGORIA_STRATEGIES[categoria];
  const toneDesc = TONE_DESCRIPTIONS[tone];

  let propertyInfo = '';
  if (property.title) {
    propertyInfo = `\nImmobile: ${property.title}`;
    if (property.location) propertyInfo += ` (${property.location})`;
    if (property.url) propertyInfo += `\nLink: ${property.url}`;
  } else if (property.url) {
    propertyInfo = `\nLink: ${property.url}`;
  }

  return `Sei un agente immobiliare esperto italiano. Genera un SMS di MASSIMO 160 caratteri (CONTA OGNI CARATTERE!).

LEAD:
Nome: ${lead.nome}
Messaggio: ${lead.messaggio || 'Nessun messaggio specifico'}
Score: ${lead.lead_score} - Categoria: ${categoria.toUpperCase()}${propertyInfo}

REGOLE:
- MASSIMO 160 caratteri totali (conta ogni carattere, incluso spazio!)
- Conciso e diretto
- Solo informazioni essenziali
- CTA breve e chiara
- NO placeholder [Nome] - usa direttamente "${lead.nome}"
- Tono: ${toneDesc}
- Strategia categoria: ${categoriaStrategy}

Per HOT: "Ciao ${lead.nome}, disponibile oggi pomeriggio per visita? Altri interessati."
Per WARM: "Ciao ${lead.nome}, disponibile questo weekend? Ho altri immobili simili."
Per COLD: "Ciao ${lead.nome}, possiamo parlarne al telefono? Ti chiamo?"

Rispondi SOLO in JSON valido:
{
  "message": "SMS di max 160 caratteri (conta ogni carattere!)"
}`;
}

// Genera messaggi per tutti e 3 i canali
async function generateFollowUpMessages(
  lead: Lead,
  property: PropertyDetails,
  categoria: 'hot' | 'warm' | 'cold',
  tone: FollowupTone
): Promise<FollowUpMessages> {
  const [whatsappResponse, emailResponse, smsResponse] = await Promise.all([
    withRetryAndTimeout(
      async (signal) => {
        const response = await openai.chat.completions.create(
          {
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'Sei un agente immobiliare esperto italiano. Generi messaggi WhatsApp professionali e conversazionali.',
              },
              { role: 'user', content: buildWhatsAppPrompt(lead, property, categoria, tone) },
            ],
            temperature: 0.7,
            max_tokens: 300,
            response_format: { type: 'json_object' },
          },
          { signal }
        );
        return response;
      },
      { timeoutMs: 30000, maxRetries: 2 }
    ),
    withRetryAndTimeout(
      async (signal) => {
        const response = await openai.chat.completions.create(
          {
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'Sei un copywriter immobiliare professionale italiano. Generi email persuasive e professionali.',
              },
              { role: 'user', content: buildEmailPrompt(lead, property, categoria, tone) },
            ],
            temperature: 0.7,
            max_tokens: 800,
            response_format: { type: 'json_object' },
          },
          { signal }
        );
        return response;
      },
      { timeoutMs: 45000, maxRetries: 2 }
    ),
    withRetryAndTimeout(
      async (signal) => {
        const response = await openai.chat.completions.create(
          {
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'Sei un agente immobiliare esperto italiano. Generi SMS concisi di massimo 160 caratteri.',
              },
              { role: 'user', content: buildSMSPrompt(lead, property, categoria, tone) },
            ],
            temperature: 0.7,
            max_tokens: 100,
            response_format: { type: 'json_object' },
          },
          { signal }
        );
        return response;
      },
      { timeoutMs: 30000, maxRetries: 2 }
    ),
  ]);

  const whatsappContent = whatsappResponse.choices[0]?.message?.content;
  const emailContent = emailResponse.choices[0]?.message?.content;
  const smsContent = smsResponse.choices[0]?.message?.content;

  if (!whatsappContent || !emailContent || !smsContent) {
    throw new Error('Errore nella generazione dei messaggi AI');
  }

  const whatsappParsed = JSON.parse(whatsappContent);
  const emailParsed = JSON.parse(emailContent);
  const smsParsed = JSON.parse(smsContent);

  // Validazione lunghezza SMS
  if (smsParsed.message && smsParsed.message.length > 160) {
    smsParsed.message = smsParsed.message.substring(0, 157) + '...';
  }

  return {
    whatsapp: {
      message: whatsappParsed.message || '',
      suggested_reply: whatsappParsed.suggested_reply,
    },
    email: {
      subject: emailParsed.subject || '',
      body: emailParsed.body || '',
      cta: emailParsed.cta || '',
      ps: emailParsed.ps,
    },
    sms: {
      message: smsParsed.message || '',
    },
    metadata: {
      categoria,
      lead_score: lead.lead_score,
      tone,
      property_included: !!property.title || !!property.url,
    },
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // STEP 0: Check PRO or AGENCY subscription (CRITICAL SECURITY CHECK)
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
          message: subscriptionCheck.error || 'Il Follow-up AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY per sbloccare i messaggi personalizzati.',
        },
        { status: 403 }
      );
    }

    const leadId = params.id;
    const body = await request.json();
    const validationResult = followupRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Dati non validi';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const { tone } = validationResult.data;

    // Rate limiting
    const clientIp = getClientIp(request);
    const userRateLimit = await checkUserRateLimit(user.id);
    if (!userRateLimit.allowed) {
      const retryAfter = userRateLimit.resetAt
        ? Math.ceil((userRateLimit.resetAt.getTime() - Date.now()) / 1000)
        : 60;

      return NextResponse.json(
        {
          success: false,
          error: userRateLimit.message || 'Limite di richieste raggiunto',
          retryAfter,
        },
        { status: 429 }
      );
    }

    if (clientIp) {
      const ipRateLimit = await checkIpRateLimit(clientIp);
      if (!ipRateLimit.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: 'Troppe richieste da questo IP',
            retryAfter: 60,
          },
          { status: 429 }
        );
      }
    }

    // Recupera lead dal database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { success: false, error: 'Lead non trovato' },
        { status: 404 }
      );
    }

    // Recupera property details
    const property = await getPropertyDetails(supabase, lead.property_url || null);

    // Determina categoria dal lead_score
    const categoria = getCategoriaFromScore(lead.lead_score || 0);

    // Cache key
    const cacheKey = `followup:${leadId}:${lead.lead_score}:${tone}:${lead.updated_at || lead.created_at}`;
    const cacheService = getAICacheService();
    const cachedResult = await cacheService.get(cacheKey, 'followup_messages') as FollowUpMessages | null;

    if (cachedResult) {
      console.log('[FOLLOWUP API] Cache hit');
      await logGeneration(user.id, clientIp);

      return NextResponse.json({
        success: true,
        data: cachedResult,
        cached: true,
        processingTimeMs: Date.now() - startTime,
      });
    }

    console.log(`[FOLLOWUP API] Generating messages for lead ${leadId}, categoria: ${categoria}, tone: ${tone}`);

    // Genera messaggi
    const messages = await generateFollowUpMessages(lead as Lead, property, categoria, tone);

    // Salva in cache (24 ore)
    try {
      await cacheService.set(cacheKey, 'followup_messages', messages, 24 * 60 * 60);
      console.log('[FOLLOWUP API] Cached result');
    } catch (cacheError) {
      console.warn('[FOLLOWUP API] Cache write error:', cacheError);
    }

    await logGeneration(user.id, clientIp);

    const processingTimeMs = Date.now() - startTime;
    console.log(`[FOLLOWUP API] Successfully generated messages in ${processingTimeMs}ms`);

    return NextResponse.json({
      success: true,
      data: messages,
      cached: false,
      processingTimeMs,
    });

  } catch (error: any) {
    console.error('[FOLLOWUP API] Unexpected error:', error);

    if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        {
          success: false,
          error: 'Il servizio AI sta impiegando troppo tempo. Riprova tra qualche secondo.',
        },
        { status: 504 }
      );
    }

    if (error.message?.includes('rate') || error.message?.includes('quota')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Limite di richieste AI raggiunto. Riprova tra qualche minuto.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Errore nella generazione dei messaggi. Riprova più tardi.',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

