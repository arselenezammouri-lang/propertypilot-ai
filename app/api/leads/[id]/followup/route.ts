import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { checkUserRateLimit, checkIpRateLimit, getClientIp, logGeneration } from '@/lib/utils/rate-limit';
import type { Lead } from '@/lib/types/database.types';
import { getUserLocale, SupportedLocale } from '@/lib/i18n/api-locale';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

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
  supabase: Awaited<ReturnType<typeof createClient>>,
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
    logger.warn('Error fetching property details', { endpoint: '/api/leads/[id]/followup' });
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
  tone: FollowupTone,
  locale: SupportedLocale = 'it'
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

  // Traduzioni prompt email per lingua
  const emailTemplates: Record<SupportedLocale, string> = {
    it: `Sei un copywriter immobiliare professionale italiano. Genera un'EMAIL professionale di 150-200 parole.

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
}`,
    en: `You are a professional real estate copywriter. Generate a professional EMAIL of 150-200 words.

LEAD:
Name: ${lead.nome}
Email: ${lead.email || 'N/A'}
Original message: ${lead.messaggio || 'No specific message'}
Score: ${lead.lead_score} - Category: ${categoria.toUpperCase()}${propertyInfo}

RULES:
- Professional email of 150-200 words
- Formal but accessible
- Focus on property details (if available)
- Clear and convincing CTA
- Tone: ${toneDesc}
- Category strategy: ${categoriaStrategy}
- DO NOT use placeholder [Name] - use directly "${lead.nome}"

For HOT: Subject with urgency, immediate visit proposal, mention scarcity
For WARM: Informative subject, add extra details, weekend proposal
For COLD: Educational subject, invite qualification, soft CTA

Respond ONLY in valid JSON:
{
  "subject": "Email subject (max 60 characters)",
  "body": "Email body (150-200 words)",
  "cta": "Clear call-to-action",
  "ps": "Optional postscript for urgency/scarcity"
}`,
    es: `Eres un redactor inmobiliario profesional. Genera un CORREO ELECTRÓNICO profesional de 150-200 palabras.

LEAD:
Nombre: ${lead.nome}
Email: ${lead.email || 'N/A'}
Mensaje original: ${lead.messaggio || 'Sin mensaje específico'}
Puntuación: ${lead.lead_score} - Categoría: ${categoria.toUpperCase()}${propertyInfo}

REGLAS:
- Correo profesional de 150-200 palabras
- Formal pero accesible
- Enfoque en detalles de la propiedad (si están disponibles)
- CTA clara y convincente
- Tono: ${toneDesc}
- Estrategia categoría: ${categoriaStrategy}
- NO uses placeholder [Nombre] - usa directamente "${lead.nome}"

Para HOT: Asunto con urgencia, propuesta de visita inmediata, menciona escasez
Para WARM: Asunto informativo, agrega detalles extra, propuesta de fin de semana
Para COLD: Asunto educativo, invita a calificación, CTA suave

Responde SOLO en JSON válido:
{
  "subject": "Asunto del correo (máx 60 caracteres)",
  "body": "Cuerpo del correo (150-200 palabras)",
  "cta": "Llamada a la acción clara",
  "ps": "Postdata opcional para urgencia/escasez"
}`,
    fr: `Vous êtes un rédacteur immobilier professionnel. Générez un EMAIL professionnel de 150-200 mots.

LEAD:
Nom: ${lead.nome}
Email: ${lead.email || 'N/A'}
Message original: ${lead.messaggio || 'Aucun message spécifique'}
Score: ${lead.lead_score} - Catégorie: ${categoria.toUpperCase()}${propertyInfo}

RÈGLES:
- Email professionnel de 150-200 mots
- Formel mais accessible
- Focus sur les détails de la propriété (si disponibles)
- CTA claire et convaincante
- Ton: ${toneDesc}
- Stratégie catégorie: ${categoriaStrategy}
- N'utilisez PAS de placeholder [Nom] - utilisez directement "${lead.nome}"

Pour HOT: Objet avec urgence, proposition de visite immédiate, mentionnez la rareté
Pour WARM: Objet informatif, ajoutez des détails supplémentaires, proposition de week-end
Pour COLD: Objet éducatif, invitez à la qualification, CTA douce

Répondez UNIQUEMENT en JSON valide:
{
  "subject": "Objet de l'email (max 60 caractères)",
  "body": "Corps de l'email (150-200 mots)",
  "cta": "Appel à l'action clair",
  "ps": "Post-scriptum optionnel pour urgence/rareté"
}`,
    de: `Du bist ein professioneller Immobilien-Copywriter. Generiere eine professionelle E-MAIL von 150-200 Wörtern.

LEAD:
Name: ${lead.nome}
Email: ${lead.email || 'N/A'}
Ursprüngliche Nachricht: ${lead.messaggio || 'Keine spezifische Nachricht'}
Punktzahl: ${lead.lead_score} - Kategorie: ${categoria.toUpperCase()}${propertyInfo}

REGELN:
- Professionelle E-Mail von 150-200 Wörtern
- Formal aber zugänglich
- Fokus auf Immobiliendetails (falls verfügbar)
- Klarer und überzeugender CTA
- Ton: ${toneDesc}
- Kategorienstrategie: ${categoriaStrategy}
- Verwende KEINEN Platzhalter [Name] - verwende direkt "${lead.nome}"

Für HOT: Betreff mit Dringlichkeit, sofortiger Besichtigungsvorschlag, erwähne Knappheit
Für WARM: Informative Betreffzeile, füge zusätzliche Details hinzu, Wochenendvorschlag
Für COLD: Pädagogischer Betreff, lade zur Qualifizierung ein, sanfter CTA

Antworte NUR in gültigem JSON:
{
  "subject": "E-Mail-Betreff (max 60 Zeichen)",
  "body": "E-Mail-Text (150-200 Wörter)",
  "cta": "Klarer Call-to-Action",
  "ps": "Optionales Postskriptum für Dringlichkeit/Knappheit"
}`,
    ar: `أنت كاتب إعلانات عقارية محترف. أنشئ بريد إلكتروني احترافي من 150-200 كلمة.

LEAD:
الاسم: ${lead.nome}
البريد الإلكتروني: ${lead.email || 'N/A'}
الرسالة الأصلية: ${lead.messaggio || 'لا توجد رسالة محددة'}
النقاط: ${lead.lead_score} - الفئة: ${categoria.toUpperCase()}${propertyInfo}

القواعد:
- بريد إلكتروني احترافي من 150-200 كلمة
- رسمي لكن سهل الوصول
- التركيز على تفاصيل العقار (إن كانت متاحة)
- دعوة واضحة ومقنعة للعمل
- النبرة: ${toneDesc}
- استراتيجية الفئة: ${categoriaStrategy}
- لا تستخدم placeholder [الاسم] - استخدم مباشرة "${lead.nome}"

للـ HOT: موضوع مع إلحاح، اقتراح زيارة فورية، اذكر الندرة
للـ WARM: موضوع إعلامي، أضف تفاصيل إضافية، اقتراح نهاية الأسبوع
للـ COLD: موضوع تعليمي، ادع إلى التأهيل، دعوة ناعمة للعمل

أجب فقط بصيغة JSON صالحة:
{
  "subject": "موضوع البريد الإلكتروني (حد أقصى 60 حرفاً)",
  "body": "نص البريد الإلكتروني (150-200 كلمة)",
  "cta": "دعوة واضحة للعمل",
  "ps": "ملاحظة اختيارية للإلحاح/الندرة"
}`,
  };

  return emailTemplates[locale] || emailTemplates['it'];
}

// Genera prompt per SMS
function buildSMSPrompt(
  lead: Lead,
  property: PropertyDetails,
  categoria: 'hot' | 'warm' | 'cold',
  tone: FollowupTone,
  locale: SupportedLocale = 'it'
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

  // Traduzioni prompt SMS per lingua
  const smsTemplates: Record<SupportedLocale, string> = {
    it: `Sei un agente immobiliare esperto italiano. Genera un SMS di MASSIMO 160 caratteri (CONTA OGNI CARATTERE!).

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
}`,
    en: `You are an experienced real estate agent. Generate an SMS of MAXIMUM 160 characters (COUNT EVERY CHARACTER!).

LEAD:
Name: ${lead.nome}
Message: ${lead.messaggio || 'No specific message'}
Score: ${lead.lead_score} - Category: ${categoria.toUpperCase()}${propertyInfo}

RULES:
- MAXIMUM 160 total characters (count every character, including space!)
- Concise and direct
- Only essential information
- Short and clear CTA
- NO placeholder [Name] - use directly "${lead.nome}"
- Tone: ${toneDesc}
- Category strategy: ${categoriaStrategy}

For HOT: "Hi ${lead.nome}, available this afternoon for a visit? Other interested parties."
For WARM: "Hi ${lead.nome}, available this weekend? I have other similar properties."
For COLD: "Hi ${lead.nome}, can we talk about it on the phone? I'll call you?"

Respond ONLY in valid JSON:
{
  "message": "SMS of max 160 characters (count every character!)"
}`,
    es: `Eres un agente inmobiliario experimentado. Genera un SMS de MÁXIMO 160 caracteres (¡CUENTA CADA CARÁCTER!).

LEAD:
Nombre: ${lead.nome}
Mensaje: ${lead.messaggio || 'Sin mensaje específico'}
Puntuación: ${lead.lead_score} - Categoría: ${categoria.toUpperCase()}${propertyInfo}

REGLAS:
- MÁXIMO 160 caracteres totales (¡cuenta cada carácter, incluido el espacio!)
- Conciso y directo
- Solo información esencial
- CTA breve y clara
- NO uses placeholder [Nombre] - usa directamente "${lead.nome}"
- Tono: ${toneDesc}
- Estrategia categoría: ${categoriaStrategy}

Para HOT: "Hola ${lead.nome}, ¿disponible esta tarde para visita? Otros interesados."
Para WARM: "Hola ${lead.nome}, ¿disponible este fin de semana? Tengo otras propiedades similares."
Para COLD: "Hola ${lead.nome}, ¿podemos hablar por teléfono? Te llamo?"

Responde SOLO en JSON válido:
{
  "message": "SMS de máx 160 caracteres (¡cuenta cada carácter!)"
}`,
    fr: `Vous êtes un agent immobilier expérimenté. Générez un SMS de MAXIMUM 160 caractères (COMPTEZ CHAQUE CARACTÈRE!).

LEAD:
Nom: ${lead.nome}
Message: ${lead.messaggio || 'Aucun message spécifique'}
Score: ${lead.lead_score} - Catégorie: ${categoria.toUpperCase()}${propertyInfo}

RÈGLES:
- MAXIMUM 160 caractères au total (comptez chaque caractère, y compris l'espace!)
- Concis et direct
- Seulement les informations essentielles
- CTA courte et claire
- PAS de placeholder [Nom] - utilisez directement "${lead.nome}"
- Ton: ${toneDesc}
- Stratégie catégorie: ${categoriaStrategy}

Pour HOT: "Bonjour ${lead.nome}, disponible cet après-midi pour une visite? Autres intéressés."
Pour WARM: "Bonjour ${lead.nome}, disponible ce week-end? J'ai d'autres propriétés similaires."
Pour COLD: "Bonjour ${lead.nome}, pouvons-nous en parler au téléphone? Je vous appelle?"

Répondez UNIQUEMENT en JSON valide:
{
  "message": "SMS de max 160 caractères (comptez chaque caractère!)"
}`,
    de: `Du bist ein erfahrener Immobilienmakler. Generiere eine SMS von MAXIMAL 160 Zeichen (ZÄHLE JEDES ZEICHEN!).

LEAD:
Name: ${lead.nome}
Nachricht: ${lead.messaggio || 'Keine spezifische Nachricht'}
Punktzahl: ${lead.lead_score} - Kategorie: ${categoria.toUpperCase()}${propertyInfo}

REGELN:
- MAXIMAL 160 Zeichen insgesamt (zähle jedes Zeichen, einschließlich Leerzeichen!)
- Prägnant und direkt
- Nur wesentliche Informationen
- Kurzer und klarer CTA
- KEIN Platzhalter [Name] - verwende direkt "${lead.nome}"
- Ton: ${toneDesc}
- Kategorienstrategie: ${categoriaStrategy}

Für HOT: "Hallo ${lead.nome}, heute Nachmittag für eine Besichtigung verfügbar? Andere Interessenten."
Für WARM: "Hallo ${lead.nome}, dieses Wochenende verfügbar? Ich habe andere ähnliche Immobilien."
Für COLD: "Hallo ${lead.nome}, können wir am Telefon darüber sprechen? Ich rufe dich an?"

Antworte NUR in gültigem JSON:
{
  "message": "SMS von max 160 Zeichen (zähle jedes Zeichen!)"
}`,
    ar: `أنت وكيل عقاري خبير. أنشئ رسالة SMS بحد أقصى 160 حرفاً (عد كل حرف!).

LEAD:
الاسم: ${lead.nome}
الرسالة: ${lead.messaggio || 'لا توجد رسالة محددة'}
النقاط: ${lead.lead_score} - الفئة: ${categoria.toUpperCase()}${propertyInfo}

القواعد:
- حد أقصى 160 حرفاً إجمالي (عد كل حرف، بما في ذلك المسافة!)
- موجز ومباشر
- معلومات أساسية فقط
- دعوة قصيرة وواضحة للعمل
- لا تستخدم placeholder [الاسم] - استخدم مباشرة "${lead.nome}"
- النبرة: ${toneDesc}
- استراتيجية الفئة: ${categoriaStrategy}

للـ HOT: "مرحباً ${lead.nome}، متاح هذا المساء للزيارة؟ مهتمون آخرون."
للـ WARM: "مرحباً ${lead.nome}، متاح نهاية الأسبوع؟ لدي عقارات مشابهة أخرى."
للـ COLD: "مرحباً ${lead.nome}، هل يمكننا التحدث عبر الهاتف؟ سأتصل بك؟"

أجب فقط بصيغة JSON صالحة:
{
  "message": "SMS بحد أقصى 160 حرفاً (عد كل حرف!)"
}`,
  };

  return smsTemplates[locale] || smsTemplates['it'];
}

// Genera messaggi per tutti e 3 i canali
async function generateFollowUpMessages(
  lead: Lead,
  property: PropertyDetails,
  categoria: 'hot' | 'warm' | 'cold',
  tone: FollowupTone,
  locale: SupportedLocale = 'it'
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
                content: SYSTEM_PROMPTS[locale]?.whatsapp || SYSTEM_PROMPTS['it'].whatsapp,
              },
              { role: 'user', content: buildWhatsAppPrompt(lead, property, categoria, tone, locale) },
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
                content: SYSTEM_PROMPTS[locale]?.email || SYSTEM_PROMPTS['it'].email,
              },
              { role: 'user', content: buildEmailPrompt(lead, property, categoria, tone, locale) },
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
                content: SYSTEM_PROMPTS[locale]?.sms || SYSTEM_PROMPTS['it'].sms,
              },
              { role: 'user', content: buildSMSPrompt(lead, property, categoria, tone, locale) },
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id: leadId } = await params;
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
      logger.debug('Follow-up API cache hit', { leadId, categoria, tone });
      await logGeneration(user.id, clientIp);

      return NextResponse.json({
        success: true,
        data: cachedResult,
        cached: true,
        processingTimeMs: Date.now() - startTime,
      });
    }

    logger.debug('Generating follow-up messages', { leadId, categoria, tone });

    // Genera messaggi
    const messages = await generateFollowUpMessages(lead as Lead, property, categoria, tone, userLocale);

    // Salva in cache (24 ore)
    try {
      await cacheService.set(cacheKey, 'followup_messages', messages, 24 * 60 * 60);
      logger.debug('Follow-up messages cached', { leadId });
    } catch (cacheError) {
      logger.warn('Cache write error', { endpoint: '/api/leads/[id]/followup' });
    }

    await logGeneration(user.id, clientIp);

    const processingTimeMs = Date.now() - startTime;
    logger.debug('Follow-up messages generated', { leadId, processingTimeMs });

    return NextResponse.json({
      success: true,
      data: messages,
      cached: false,
      processingTimeMs,
    });

  } catch (error: any) {
    logger.error('Follow-up API unexpected error', error, { endpoint: '/api/leads/[id]/followup' });

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

