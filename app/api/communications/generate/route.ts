import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { requireActiveSubscription } from '@/lib/utils/subscription-check';
import type { Lead, CommunicationChannel, CommunicationTone } from '@/lib/types/database.types';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateSchema = z.object({
  lead_id: z.string().uuid(),
  channel: z.enum(['email', 'whatsapp', 'sms']),
  context: z.string().optional(),
  tone: z.enum(['professional', 'emotional', 'luxury', 'casual', 'urgent']).optional().default('professional'),
  purpose: z.enum(['follow_up', 'first_contact', 'appointment', 'offer', 'thank_you', 'reminder']).optional().default('follow_up'),
});

const TONE_DESCRIPTIONS: Record<CommunicationTone, string> = {
  professional: 'formale, cortese e professionale',
  emotional: 'empatico, caloroso e coinvolgente',
  luxury: 'esclusivo, raffinato e di alto livello',
  casual: 'amichevole, informale ma rispettoso',
  urgent: 'diretto, incisivo e con senso di urgenza',
};

const CHANNEL_LIMITS: Record<CommunicationChannel, { maxLength: number; description: string }> = {
  email: { maxLength: 2000, description: 'email professionale completa con oggetto' },
  whatsapp: { maxLength: 500, description: 'messaggio WhatsApp breve e diretto' },
  sms: { maxLength: 160, description: 'SMS conciso di massimo 160 caratteri' },
};

async function generateAIMessage(
  lead: Lead,
  channel: CommunicationChannel,
  tone: CommunicationTone,
  purpose: string,
  context?: string
): Promise<{ subject?: string; message: string; variants?: string[] }> {
  const channelInfo = CHANNEL_LIMITS[channel];
  const toneDescription = TONE_DESCRIPTIONS[tone];
  
  const leadInfo = `
Nome: ${lead.nome || 'Cliente'}
Email: ${lead.email || 'N/A'}
Telefono: ${lead.telefono || 'N/A'}
Messaggio originale: ${lead.messaggio || 'Nessun messaggio'}
Priorità: ${lead.priorita || 'medium'}
Status: ${lead.status || 'new'}
Mercato: ${lead.market || 'italy'}
  `.trim();

  const systemPrompt = channel === 'sms' 
    ? `Sei un esperto agente immobiliare italiano. Genera un SMS di MASSIMO 160 caratteri. Conta ogni carattere. Il messaggio deve essere completo e avere senso. NON usare placeholder come [Nome] - usa direttamente il nome del cliente. Tono: ${toneDescription}.`
    : `Sei un esperto agente immobiliare italiano. Genera ${channelInfo.description}. Tono: ${toneDescription}. NON usare placeholder come [Nome] - usa direttamente il nome del cliente se disponibile.`;

  const userPrompt = `
Genera un ${channelInfo.description} per questo lead:

${leadInfo}

Scopo: ${purpose}
${context ? `Contesto aggiuntivo: ${context}` : ''}

${channel === 'email' ? 'Rispondi in formato JSON: {"subject": "oggetto email", "message": "corpo email"}' : ''}
${channel === 'whatsapp' ? 'Rispondi in formato JSON: {"message": "messaggio WhatsApp", "variants": ["variante1", "variante2"]}' : ''}
${channel === 'sms' ? 'Rispondi in formato JSON: {"message": "SMS di max 160 caratteri"}' : ''}
  `.trim();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: channel === 'sms' ? 100 : 1000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Nessuna risposta da OpenAI');
    }

    const parsed = JSON.parse(content);
    
    if (channel === 'sms' && parsed.message && parsed.message.length > 160) {
      parsed.message = parsed.message.substring(0, 157) + '...';
    }

    return {
      subject: parsed.subject,
      message: parsed.message || '',
      variants: parsed.variants,
    };
  } catch (error) {
    console.error('Error generating AI message:', error);
    throw new Error('Errore nella generazione del messaggio AI');
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = generateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Dati non validi', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    const { lead_id, channel, context, tone, purpose } = validationResult.data;

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead non trovato' }, { status: 404 });
    }

    const cacheKey = `comm_${channel}_${lead_id}_${tone}_${purpose}`;
    const { data: cachedResponse } = await supabase
      .from('ai_response_cache')
      .select('response')
      .eq('cache_key', cacheKey)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (cachedResponse?.response) {
      return NextResponse.json({ 
        ...cachedResponse.response,
        cached: true,
        character_count: cachedResponse.response.message?.length || 0,
      });
    }

    const result = await generateAIMessage(lead as Lead, channel, tone, purpose, context);

    try {
      await supabase
        .from('ai_response_cache')
        .upsert({
          cache_key: cacheKey,
          prompt_type: `communication_${channel}`,
          response: result,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });
    } catch (cacheError) {
      console.warn('Failed to cache AI response:', cacheError);
    }

    return NextResponse.json({
      ...result,
      cached: false,
      character_count: result.message?.length || 0,
    });
  } catch (error) {
    console.error('Error in POST /api/communications/generate:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Errore interno del server' 
    }, { status: 500 });
  }
}
