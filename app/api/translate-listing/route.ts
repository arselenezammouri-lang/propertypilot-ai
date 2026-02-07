import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import { getAICacheService } from '@/lib/cache/ai-cache';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';
import { getUserLocale, getErrorMessage, SupportedLocale } from '@/lib/i18n/api-locale';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', country: 'USA/UK' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', country: 'Francia' },
  { code: 'es', name: 'Español', flag: '🇪🇸', country: 'Spagna' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', country: 'Germania' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', country: 'Portogallo/Brasile' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', country: 'Italia' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪', country: 'Paesi Arabi' },
  { code: 'zh', name: '中文', flag: '🇨🇳', country: 'Cina' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', country: 'Russia' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', country: 'Paesi Bassi' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', country: 'Polonia' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', country: 'Turchia' },
] as const;

const languageCodes = SUPPORTED_LANGUAGES.map(l => l.code) as [string, ...string[]];

const translateRequestSchema = z.object({
  tipoTransazione: z.enum(['vendita', 'affitto', 'affitto_breve']).optional().default('vendita'),
  titolo: z.string().min(5, 'Il titolo deve avere almeno 5 caratteri').max(200),
  descrizione: z.string().min(20, 'La descrizione deve avere almeno 20 caratteri').max(5000),
  caratteristiche: z.string().max(1000).optional(),
  linguaTarget: z.enum(languageCodes),
  tono: z.enum(['standard', 'luxury']).default('standard'),
});

type TranslateRequest = z.infer<typeof translateRequestSchema>;

const TRANSAZIONE_TRANSLATE: Record<string, { label: string; context: string }> = {
  vendita: {
    label: 'For Sale',
    context: 'Annuncio di vendita immobiliare. Focus su: investimento, proprietà, valore, acquisto, patrimonio.',
  },
  affitto: {
    label: 'For Rent',
    context: 'Annuncio di affitto a lungo termine. Focus su: canone mensile, contratto, garanzie, inquilino, disponibilità.',
  },
  affitto_breve: {
    label: 'Short-Term Rental / Holiday Let',
    context: 'Annuncio per affitto turistico/vacanza. Focus su: soggiorno, notti, esperienza, check-in, attrazioni vicine.',
  },
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

function getLanguageInfo(code: string) {
  return SUPPORTED_LANGUAGES.find(l => l.code === code);
}

async function translateTitle(
  openai: OpenAI,
  titolo: string,
  linguaTarget: string,
  tono: string,
  tipoTransazione: string
): Promise<string> {
  const langInfo = getLanguageInfo(linguaTarget);
  const transazione = TRANSAZIONE_TRANSLATE[tipoTransazione || 'vendita'];
  const toneInstruction = tono === 'luxury' 
    ? 'Usa un linguaggio esclusivo, sofisticato e prestigioso, tipico del mercato immobiliare di lusso.'
    : 'Usa un linguaggio professionale, chiaro e accattivante per il mercato immobiliare.';

  const response = await withRetryAndTimeout(() => 
    openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un traduttore esperto specializzato nel settore immobiliare internazionale. 
Traduci i titoli degli annunci immobiliari in ${langInfo?.name} (${langInfo?.country}).
TIPO ANNUNCIO: ${transazione.label}
CONTESTO: ${transazione.context}
${toneInstruction}
NON tradurre letteralmente - adatta il titolo alle convenzioni del mercato immobiliare locale.
Rispondi SOLO con il titolo tradotto, senza spiegazioni.`
        },
        {
          role: 'user',
          content: `Traduci questo titolo immobiliare in ${langInfo?.name}:\n\n"${titolo}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    })
  );

  return response.choices[0]?.message?.content?.trim() || titolo;
}

async function translateDescription(
  openai: OpenAI,
  descrizione: string,
  caratteristiche: string,
  linguaTarget: string,
  tono: string
): Promise<string> {
  const langInfo = getLanguageInfo(linguaTarget);
  const toneInstruction = tono === 'luxury' 
    ? 'Usa un linguaggio esclusivo e raffinato, enfatizzando prestigio e unicità.'
    : 'Usa un linguaggio professionale e coinvolgente.';

  const fullText = caratteristiche 
    ? `${descrizione}\n\nCaratteristiche: ${caratteristiche}`
    : descrizione;

  const response = await withRetryAndTimeout(() => 
    openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un traduttore esperto specializzato nel settore immobiliare internazionale.
Traduci le descrizioni degli annunci immobiliari in ${langInfo?.name} (${langInfo?.country}).
${toneInstruction}
IMPORTANTE:
- NON tradurre letteralmente
- Adatta le espressioni alle convenzioni locali del mercato immobiliare
- Mantieni le unità di misura appropriate (mq vs sqft, € vs $, ecc.)
- Usa la terminologia immobiliare corretta per ${langInfo?.country}
Rispondi SOLO con la descrizione tradotta.`
        },
        {
          role: 'user',
          content: `Traduci questa descrizione immobiliare in ${langInfo?.name}:\n\n${fullText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })
  );

  return response.choices[0]?.message?.content?.trim() || descrizione;
}

async function generateSEOVersion(
  openai: OpenAI,
  titolo: string,
  descrizioneTraddotta: string,
  linguaTarget: string
): Promise<string> {
  const langInfo = getLanguageInfo(linguaTarget);

  const response = await withRetryAndTimeout(() => 
    openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto SEO specializzato nel settore immobiliare per ${langInfo?.country}.
Crea una versione ottimizzata SEO del testo per i motori di ricerca locali.
Include:
- Keywords immobiliari popolari in ${langInfo?.name}
- Struttura ottimizzata per rich snippets
- Call-to-action efficaci per il mercato locale
Rispondi SOLO con il testo SEO ottimizzato (max 300 parole).`
        },
        {
          role: 'user',
          content: `Titolo: ${titolo}\n\nDescrizione:\n${descrizioneTraddotta}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })
  );

  return response.choices[0]?.message?.content?.trim() || descrizioneTraddotta;
}

async function generateVocabularyAdaptation(
  openai: OpenAI,
  linguaTarget: string
): Promise<string[]> {
  const langInfo = getLanguageInfo(linguaTarget);

  const response = await withRetryAndTimeout(() => 
    openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un esperto di terminologia immobiliare internazionale.
Fornisci 10 termini immobiliari chiave tradotti dall'italiano al ${langInfo?.name}.
Formato: "termine italiano → traduzione (nota contestuale)"
Includi termini come: bilocale, trilocale, mansarda, box auto, cantina, terrazzo, ecc.`
        },
        {
          role: 'user',
          content: `Fornisci 10 termini immobiliari italiani tradotti in ${langInfo?.name} per ${langInfo?.country}.`
        }
      ],
      temperature: 0.5,
      max_tokens: 500,
    })
  );

  const content = response.choices[0]?.message?.content?.trim() || '';
  return content.split('\n').filter(line => line.trim().length > 0).slice(0, 10);
}

async function generateCulturalNotes(
  openai: OpenAI,
  linguaTarget: string,
  tono: string
): Promise<string[]> {
  const langInfo = getLanguageInfo(linguaTarget);

  const response = await withRetryAndTimeout(() => 
    openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sei un consulente immobiliare internazionale esperto del mercato ${langInfo?.country}.
Fornisci 5 note di adattamento culturale per vendere immobili italiani a clienti ${langInfo?.country}.
Ogni nota deve essere pratica e actionable.
Formato: una nota per riga, max 50 parole ciascuna.`
        },
        {
          role: 'user',
          content: `Note culturali per vendere immobili italiani a clienti ${langInfo?.name} (tono: ${tono}).`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })
  );

  const content = response.choices[0]?.message?.content?.trim() || '';
  return content.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Ottieni lingua utente
    const userLocale = await getUserLocale(request, user?.id, supabase);

    if (userError || !user) {
      return NextResponse.json(
        { error: getErrorMessage(userLocale, 'unauthorized') },
        { status: 401 }
      );
    }

    // SECURITY: Check active subscription
    const subscriptionCheck = await requireActiveSubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        { 
          error: subscriptionCheck.error || getErrorMessage(userLocale, 'subscriptionRequired'),
          message: subscriptionCheck.error || getErrorMessage(userLocale, 'subscriptionRequired')
        },
        { status: 403 }
      );
    }

    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimitKey = user ? `user:${user.id}` : `ip:${clientIP}`;
    
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { 
          error: getErrorMessage(userLocale, 'rateLimit'),
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    const validationResult = translateRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      return NextResponse.json(
        { 
          error: `${getErrorMessage(userLocale, 'invalidData')}: ${errors}`,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    const { titolo, descrizione, caratteristiche, linguaTarget, tono } = validationResult.data;

    const cacheContent = `${linguaTarget}:${tono}:${titolo}:${descrizione}:${caratteristiche || ''}`;
    const cachePromptType = 'translate';
    
    try {
      const cacheService = getAICacheService();
      const cachedResult = await cacheService.get(cacheContent, cachePromptType);
      if (cachedResult) {
        return NextResponse.json({
          ...cachedResult,
          cached: true
        });
      }
    } catch (cacheError) {
      logger.warn('Cache read error (continuing without cache)', { endpoint: '/api/translate-listing' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Configurazione OpenAI mancante. Contatta il supporto.',
          code: 'OPENAI_CONFIG_ERROR'
        },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const langInfo = getLanguageInfo(linguaTarget);

    const tipoTransazione = validationResult.data.tipoTransazione || 'vendita';
    
    const [
      titoloTradotto,
      descrizioneTradotta,
      vocabolario,
      noteCulturali
    ] = await Promise.all([
      translateTitle(openai, titolo, linguaTarget, tono, tipoTransazione),
      translateDescription(openai, descrizione, caratteristiche || '', linguaTarget, tono),
      generateVocabularyAdaptation(openai, linguaTarget),
      generateCulturalNotes(openai, linguaTarget, tono),
    ]);

    const versioneSEO = await generateSEOVersion(openai, titoloTradotto, descrizioneTradotta, linguaTarget);

    const result = {
      linguaTarget: {
        code: linguaTarget,
        name: langInfo?.name || linguaTarget,
        flag: langInfo?.flag || '🌐',
        country: langInfo?.country || '',
      },
      tono,
      titoloOriginale: titolo,
      titoloTradotto,
      descrizioneOriginale: descrizione,
      descrizioneTradotta,
      versioneSEO,
      vocabolarioAdattato: vocabolario,
      noteCulturali,
      timestamp: new Date().toISOString(),
    };

    try {
      const cacheService = getAICacheService();
      await cacheService.set(cacheContent, cachePromptType, result);
    } catch (cacheError) {
      logger.warn('Cache write error (result still returned)', { endpoint: '/api/translate-listing' });
    }

    return NextResponse.json(result);

  } catch (error) {
    logger.error('Translation error', error, { endpoint: '/api/translate-listing' });
    
    if (error instanceof Error) {
      // Ottieni lingua per messaggi errore
      const errorLocale = await getUserLocale(request, undefined, supabase);
      
      if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
        const timeoutMessages: Record<SupportedLocale, string> = {
          it: 'La traduzione sta richiedendo troppo tempo. Riprova con un testo più breve.',
          en: 'Translation is taking too long. Please try with a shorter text.',
          es: 'La traducción está tardando demasiado. Intenta con un texto más corto.',
          fr: 'La traduction prend trop de temps. Veuillez réessayer avec un texte plus court.',
          de: 'Die Übersetzung dauert zu lange. Bitte versuchen Sie es mit einem kürzeren Text.',
          ar: 'الترجمة تستغرق وقتاً طويلاً. يرجى المحاولة بنص أقصر.',
        };
        return NextResponse.json(
          { 
            error: timeoutMessages[errorLocale] || timeoutMessages['it'],
            code: 'TIMEOUT_ERROR'
          },
          { status: 504 }
        );
      }
      
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        const rateLimitMessages: Record<SupportedLocale, string> = {
          it: 'Servizio AI temporaneamente sovraccarico. Riprova tra qualche minuto.',
          en: 'AI service temporarily overloaded. Please try again in a few minutes.',
          es: 'Servicio AI temporalmente sobrecargado. Intenta de nuevo en unos minutos.',
          fr: 'Service IA temporairement surchargé. Veuillez réessayer dans quelques minutes.',
          de: 'KI-Service vorübergehend überlastet. Bitte versuchen Sie es in ein paar Minuten erneut.',
          ar: 'الخدمة الذكية مثقلة مؤقتاً. يرجى المحاولة مرة أخرى بعد بضع دقائق.',
        };
        return NextResponse.json(
          { 
            error: rateLimitMessages[errorLocale] || rateLimitMessages['it'],
            code: 'OPENAI_RATE_LIMIT'
          },
          { status: 429 }
        );
      }

      if (error.message.includes('quota') || error.message.includes('billing')) {
        const quotaMessages: Record<SupportedLocale, string> = {
          it: 'Quota AI esaurita. Contatta il supporto.',
          en: 'AI quota exhausted. Please contact support.',
          es: 'Cuota AI agotada. Contacta con soporte.',
          fr: 'Quota IA épuisée. Veuillez contacter le support.',
          de: 'KI-Quote erschöpft. Bitte kontaktieren Sie den Support.',
          ar: 'تم استنفاد حصة الذكاء الاصطناعي. يرجى الاتصال بالدعم.',
        };
        return NextResponse.json(
          { 
            error: quotaMessages[errorLocale] || quotaMessages['it'],
            code: 'OPENAI_QUOTA_ERROR'
          },
          { status: 503 }
        );
      }
    }

    const errorLocale = await getUserLocale(request, undefined, supabase);
    return NextResponse.json(
      { 
        error: getErrorMessage(errorLocale, 'internalError'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    languages: SUPPORTED_LANGUAGES,
    tones: [
      { value: 'standard', label: 'Standard', description: 'Professionale e chiaro' },
      { value: 'luxury', label: 'Luxury', description: 'Esclusivo e prestigioso' },
    ],
  });
}
