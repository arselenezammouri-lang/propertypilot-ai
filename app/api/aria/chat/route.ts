import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildAriaPrompt } from '@/lib/ai/aria-brain';
import OpenAI from 'openai';

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
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Messaggio non valido' },
        { status: 400 }
      );
    }

    // Recupera profilo utente per contesto
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, subscription_plan, location, city, country')
      .eq('id', user.id)
      .single();

    // Costruisci location string da profilo o context
    const userLocation = context?.userLocation || 
      (profile?.location || profile?.city || profile?.country || undefined);

    const ariaContext = {
      userName: profile?.full_name || context?.userName,
      userPlan: (profile?.subscription_plan || context?.userPlan || 'free') as 'free' | 'starter' | 'pro' | 'agency',
      currentPage: context?.currentPage,
      recentActivity: context?.recentActivity,
      userLocation,
    };

    // Costruisci prompt per Aria
    const prompt = buildAriaPrompt(message, ariaContext);

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

    const response = completion.choices[0]?.message?.content || "Scusa, non ho capito. Puoi riformulare?";

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

