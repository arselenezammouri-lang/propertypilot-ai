import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';
import { withRetryAndTimeout } from '@/lib/utils/openai-retry';
import type { Automation, FollowupPayload, ReminderPayload, WeeklyContentPayload } from '@/lib/types/database.types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateFollowupEmail(payload: FollowupPayload): Promise<string> {
  const { client_name, property_type, property_location, email_type } = payload;
  
  const emailTypeDescriptions: Record<string, string> = {
    immediate: 'Risposta immediata dopo primo contatto',
    '24h': 'Follow-up dopo 24 ore dal primo contatto',
    '72h': 'Follow-up di 72 ore per riaccendere interesse',
    appointment: 'Email per fissare appuntamento visita',
    'post-visit': 'Follow-up dopo visita immobile',
    luxury: 'Email luxury per clienti alto spendenti',
  };

  const prompt = `Genera un'email di follow-up immobiliare professionale.

Tipo: ${emailTypeDescriptions[email_type]}
Nome cliente: ${client_name}
Tipo immobile: ${property_type}
${property_location ? `Zona: ${property_location}` : ''}

Formato richiesto:
- Oggetto: [oggetto accattivante]
- Corpo: [email professionale 150-200 parole]
- CTA: [call to action chiara]
- PS: [post scriptum opzionale]

L'email deve essere professionale, personale e orientata alla conversione.`;

  const completion = await withRetryAndTimeout(async () => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sei un esperto di email marketing immobiliare italiano. Scrivi email persuasive e professionali.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });
  });

  return completion.choices[0]?.message?.content || 'Errore nella generazione email';
}

async function generateReminderMessage(payload: ReminderPayload): Promise<string> {
  const { client_name, property_type, property_location, visit_date, reminder_type } = payload;
  
  const formattedDate = new Date(visit_date).toLocaleString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const prompt = reminder_type === '3h' 
    ? `Genera un breve SMS/WhatsApp di promemoria (max 160 caratteri) per un appuntamento immobiliare.
Cliente: ${client_name}
Appuntamento: ${formattedDate}
Immobile: ${property_type} in ${property_location}
Tono: professionale ma amichevole, urgente ma cortese.`
    : `Genera un'email di promemoria professionale per una visita immobiliare.
Cliente: ${client_name}
Appuntamento: ${formattedDate}
Immobile: ${property_type} in ${property_location}
Include: dettagli pratici, cosa aspettarsi, suggerimenti per la visita.`;

  const completion = await withRetryAndTimeout(async () => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sei un assistente immobiliare italiano. Comunica in modo professionale e cordiale.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: reminder_type === '3h' ? 100 : 500,
      temperature: 0.6,
    });
  });

  return completion.choices[0]?.message?.content || 'Errore nella generazione promemoria';
}

async function generateWeeklyContent(payload: WeeklyContentPayload): Promise<string> {
  const { content_types, property_focus, target_market } = payload;
  
  const marketContext = target_market === 'usa' 
    ? 'mercato immobiliare americano'
    : target_market === 'international'
    ? 'mercato internazionale'
    : 'mercato immobiliare italiano';

  const contentRequests = content_types.map(type => {
    switch (type) {
      case 'social_post':
        return `- 1 Post Instagram/Facebook professionale con hashtag (per ${marketContext})`;
      case 'newsletter':
        return `- 1 Email newsletter breve con aggiornamenti di mercato (per ${marketContext})`;
      case 'ab_titles':
        return `- 3 Titoli A/B testing per annunci immobiliari`;
      default:
        return '';
    }
  }).join('\n');

  const prompt = `Genera contenuti settimanali per un agente immobiliare.
${property_focus ? `Focus proprietà: ${property_focus}` : ''}
Mercato target: ${marketContext}

Genera:
${contentRequests}

Ogni contenuto deve essere pronto per l'uso, professionale e orientato al business.`;

  const completion = await withRetryAndTimeout(async () => {
    return openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sei un content creator specializzato nel settore immobiliare. Crei contenuti professionali e coinvolgenti.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1200,
      temperature: 0.8,
    });
  });

  return completion.choices[0]?.message?.content || 'Errore nella generazione contenuti';
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato. Effettua il login.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { automation_id } = body;

    if (!automation_id) {
      return NextResponse.json(
        { error: 'ID automazione richiesto.' },
        { status: 400 }
      );
    }

    const { data: automation, error: fetchError } = await supabase
      .from('automations')
      .select('*')
      .eq('id', automation_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !automation) {
      return NextResponse.json(
        { error: 'Automazione non trovata.' },
        { status: 404 }
      );
    }

    if (automation.status !== 'active') {
      return NextResponse.json(
        { error: 'Automazione non attiva.' },
        { status: 400 }
      );
    }

    let result: string;
    const payload = automation.payload;

    try {
      switch (automation.type) {
        case 'followup':
          result = await generateFollowupEmail(payload as FollowupPayload);
          break;
        case 'reminder':
          result = await generateReminderMessage(payload as ReminderPayload);
          break;
        case 'weekly-content':
          result = await generateWeeklyContent(payload as WeeklyContentPayload);
          break;
        default:
          throw new Error('Tipo automazione non supportato');
      }

      let newStatus = automation.status;
      let nextRun: string | null = null;

      if (automation.repeat_interval === 'once') {
        newStatus = 'completed';
      } else if (automation.repeat_interval === 'daily') {
        const next = new Date();
        next.setDate(next.getDate() + 1);
        next.setHours(9, 0, 0, 0);
        nextRun = next.toISOString();
      } else if (automation.repeat_interval === 'weekly') {
        const next = new Date();
        next.setDate(next.getDate() + 7);
        next.setHours(9, 0, 0, 0);
        nextRun = next.toISOString();
      }

      await supabase
        .from('automations')
        .update({
          last_run: new Date().toISOString(),
          last_result: result.substring(0, 5000),
          execution_count: automation.execution_count + 1,
          status: newStatus,
          next_run: nextRun,
          updated_at: new Date().toISOString(),
        })
        .eq('id', automation_id);

      await supabaseService
        .from('automation_logs')
        .insert({
          automation_id: automation_id,
          user_id: user.id,
          status: 'success',
          result: result.substring(0, 5000),
        });

      return NextResponse.json({
        success: true,
        result,
        message: 'Automazione eseguita con successo!',
        next_run: nextRun,
      });
    } catch (execError: any) {
      await supabase
        .from('automations')
        .update({
          last_run: new Date().toISOString(),
          status: 'failed',
          last_result: `Errore: ${execError.message}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', automation_id);

      await supabaseService
        .from('automation_logs')
        .insert({
          automation_id: automation_id,
          user_id: user.id,
          status: 'failed',
          error: execError.message,
        });

      throw execError;
    }
  } catch (error: any) {
    console.error('Automation execute error:', error);
    return NextResponse.json(
      { error: error.message || 'Errore nell\'esecuzione dell\'automazione.' },
      { status: 500 }
    );
  }
}
