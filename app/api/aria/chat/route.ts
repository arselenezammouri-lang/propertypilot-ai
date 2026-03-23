import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildAriaPrompt } from '@/lib/ai/aria-brain';
import OpenAI from 'openai';
import { z } from 'zod';
import { logger } from '@/lib/utils/safe-logger';
import type { SupportedLocale } from '@/lib/i18n/dictionary';

const SUPPORTED_LOCALES: SupportedLocale[] = ['it', 'en', 'es', 'fr', 'de', 'pt', 'ar'];
function toSupportedLocale(s: string): SupportedLocale {
  return (SUPPORTED_LOCALES.includes(s as SupportedLocale) ? s : 'it') as SupportedLocale;
}

export const dynamic = 'force-dynamic';

const ariaChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
  context: z.object({
    locale: z.string().optional(),
    userLocation: z.string().optional(),
    userName: z.string().optional(),
    userPlan: z.string().optional(),
    currentPage: z.string().optional(),
    recentActivity: z.union([z.string(), z.array(z.string())]).optional(),
  }).optional(),
  locale: z.string().optional(),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/aria/chat
 * Endpoint per la chat con Aria
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = ariaChatRequestSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Invalid aria chat request', { errors: validation.error.errors, endpoint: '/api/aria/chat' });
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { message, context, locale } = validation.data;

    // Usa la lingua passata o rileva da context, default 'it'
    const userLocale = toSupportedLocale(locale || context?.locale || 'it');

    // Recupera profilo utente per contesto
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, subscription_plan, location, city, country')
      .eq('id', user.id)
      .single();

    // Costruisci location string da profilo o context
    const userLocation = context?.userLocation || 
      (profile?.location || profile?.city || profile?.country || undefined);

    const recentActivityRaw = context?.recentActivity;
    const recentActivity: string[] | undefined = recentActivityRaw == null
      ? undefined
      : Array.isArray(recentActivityRaw)
        ? recentActivityRaw
        : [recentActivityRaw];

    const ariaContext = {
      userName: profile?.full_name || context?.userName,
      userPlan: (profile?.subscription_plan || context?.userPlan || 'free') as 'free' | 'starter' | 'pro' | 'agency',
      currentPage: context?.currentPage,
      recentActivity,
      userLocation,
      locale: userLocale,
    };

    // Costruisci prompt per Aria con lingua
    const prompt = buildAriaPrompt(message, ariaContext, userLocale);

    // Chiama OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    // Messaggi fallback tradotti
    const fallbackMessages: Record<string, string> = {
      it: "Scusa, non ho capito. Puoi riformulare?",
      en: "Sorry, I didn't understand. Can you rephrase?",
      es: "Lo siento, no entendí. ¿Puedes reformular?",
      fr: "Désolé, je n'ai pas compris. Pouvez-vous reformuler?",
      de: "Entschuldigung, ich habe es nicht verstanden. Können Sie es umformulieren?",
      ar: "عذراً، لم أفهم. هل يمكنك إعادة الصياغة؟",
    };
    
    const response = completion.choices[0]?.message?.content || (fallbackMessages[userLocale] || fallbackMessages['it']);

    // Estrai link a documentazione se presente
    let docLink: string | null = null;
    const docPatterns: Record<string, string> = {
      'sniper': '/docs/price-sniper/sniper-guide',
      'arbitraggio': '/docs/prospecting/arbitrage',
      'arbitrage': '/docs/prospecting/arbitrage',
      '3d staging': '/docs/3d-staging/staging-guide',
      'virtual staging': '/docs/3d-staging/staging-guide',
      'ai voice': '/docs/ai-voice/call-scripts',
      'chiamate': '/docs/ai-voice/call-scripts',
      'commercial': '/docs/commercial/commercial-guide',
      'territory': '/docs/territory/territory-guide',
      'smart briefing': '/docs/smart-briefing/briefing-guide',
      'x-ray': '/docs/xray/xray-guide',
      'xray': '/docs/xray/xray-guide',
      'aura vr': '/docs/aura-vr/vr-guide',
      'aura-vr': '/docs/aura-vr/vr-guide',
      'aiuto': '/docs',
      'help': '/docs',
      'supporto': '/docs',
      'documenti': '/docs',
      'documentazione': '/docs',
    };

    const userMessageLower = message.toLowerCase();
    for (const [keyword, link] of Object.entries(docPatterns)) {
      if (userMessageLower.includes(keyword)) {
        docLink = link;
        break;
      }
    }

    return NextResponse.json({
      success: true,
      response,
      docLink, // Link opzionale alla documentazione
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

