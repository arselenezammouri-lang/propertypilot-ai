import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { checkUserRateLimit } from '@/lib/utils/rate-limit';
import type { Automation, InsertAutomation, AutomationType, AutomationRepeatInterval } from '@/lib/types/database.types';

export const dynamic = 'force-dynamic';

const followupPayloadSchema = z.object({
  client_name: z.string().min(1).max(100),
  client_email: z.string().email(),
  property_type: z.string().min(1).max(100),
  property_location: z.string().max(200).optional(),
  delay_hours: z.coerce.number().min(1).max(168),
  email_type: z.enum(['immediate', '24h', '72h', 'appointment', 'post-visit', 'luxury']),
});

const reminderPayloadSchema = z.object({
  client_name: z.string().min(1).max(100),
  client_email: z.string().email(),
  property_type: z.string().min(1).max(100),
  property_location: z.string().min(1).max(200),
  visit_date: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: "Data non valida" }),
  reminder_type: z.enum(['3h', '24h']),
});

const weeklyContentPayloadSchema = z.object({
  content_types: z.array(z.enum(['social_post', 'newsletter', 'ab_titles'])).min(1),
  property_focus: z.string().max(200).optional(),
  target_market: z.enum(['ita', 'usa', 'international']).optional().default('ita'),
});

const createAutomationSchema = z.object({
  type: z.enum(['followup', 'reminder', 'weekly-content']),
  name: z.string().min(1).max(255),
  payload: z.union([followupPayloadSchema, reminderPayloadSchema, weeklyContentPayloadSchema]),
  next_run: z.string().datetime().optional(),
  repeat_interval: z.enum(['once', 'daily', 'weekly']),
});

function calculateNextRun(type: AutomationType, payload: any, repeatInterval: AutomationRepeatInterval): Date {
  const now = new Date();
  
  if (type === 'followup') {
    const hoursToAdd = payload.delay_hours || 24;
    return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  }
  
  if (type === 'reminder') {
    const visitDate = new Date(payload.visit_date);
    const reminderType = payload.reminder_type;
    const hoursBeforeVisit = reminderType === '3h' ? 3 : 24;
    return new Date(visitDate.getTime() - hoursBeforeVisit * 60 * 60 * 1000);
  }
  
  if (type === 'weekly-content') {
    if (repeatInterval === 'weekly') {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(9, 0, 0, 0);
      return nextWeek;
    }
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
  
  return now;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato. Effettua il login.' },
        { status: 401 }
      );
    }

    // Check PRO or AGENCY subscription (Automazioni AI is a premium feature)
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
          message: subscriptionCheck.error || 'Le Automazioni AI sono una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = supabase
      .from('automations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status && ['active', 'paused', 'completed', 'failed'].includes(status)) {
      query = query.eq('status', status);
    }

    if (type && ['followup', 'reminder', 'weekly-content'].includes(type)) {
      query = query.eq('type', type);
    }

    const { data: automations, error } = await query;

    if (error) {
      console.error('Error fetching automations:', error);
      return NextResponse.json(
        { error: 'Errore nel recupero delle automazioni.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ automations: automations || [] });
  } catch (error) {
    console.error('Automations GET error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
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

    // Check PRO or AGENCY subscription (Automazioni AI is a premium feature)
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
          message: subscriptionCheck.error || 'Le Automazioni AI sono una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const rateCheck = await checkUserRateLimit(user.id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Limite di richieste raggiunto. Riprova tra qualche minuto.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = createAutomationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { type, name, payload, repeat_interval } = validation.data;

    let validatedPayload;
    if (type === 'followup') {
      const result = followupPayloadSchema.safeParse(payload);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Payload follow-up non valido', details: result.error.flatten() },
          { status: 400 }
        );
      }
      validatedPayload = result.data;
    } else if (type === 'reminder') {
      const result = reminderPayloadSchema.safeParse(payload);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Payload reminder non valido', details: result.error.flatten() },
          { status: 400 }
        );
      }
      validatedPayload = result.data;
    } else {
      const result = weeklyContentPayloadSchema.safeParse(payload);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Payload weekly-content non valido', details: result.error.flatten() },
          { status: 400 }
        );
      }
      validatedPayload = result.data;
    }

    const nextRun = calculateNextRun(type, validatedPayload, repeat_interval);

    const { data: automation, error } = await supabase
      .from('automations')
      .insert({
        user_id: user.id,
        type,
        name,
        payload: validatedPayload,
        next_run: nextRun.toISOString(),
        repeat_interval,
        status: 'active',
        execution_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating automation:', error);
      return NextResponse.json(
        { error: 'Errore nella creazione dell\'automazione.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      automation,
      message: `Automazione "${name}" creata con successo!`,
    });
  } catch (error) {
    console.error('Automations POST error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato. Effettua il login.' },
        { status: 401 }
      );
    }

    // Check PRO or AGENCY subscription (Automazioni AI is a premium feature)
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
          message: subscriptionCheck.error || 'Le Automazioni AI sono una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const automationId = searchParams.get('id');

    if (!automationId) {
      return NextResponse.json(
        { error: 'ID automazione richiesto.' },
        { status: 400 }
      );
    }

    const { data: existingAutomation, error: fetchError } = await supabase
      .from('automations')
      .select('id')
      .eq('id', automationId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingAutomation) {
      return NextResponse.json(
        { error: 'Automazione non trovata.' },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from('automations')
      .delete()
      .eq('id', automationId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting automation:', deleteError);
      return NextResponse.json(
        { error: 'Errore nell\'eliminazione dell\'automazione.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Automazione eliminata con successo.',
    });
  } catch (error) {
    console.error('Automations DELETE error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID automazione richiesto.' },
        { status: 400 }
      );
    }

    if (!status || !['active', 'paused'].includes(status)) {
      return NextResponse.json(
        { error: 'Status non valido. Usa "active" o "paused".' },
        { status: 400 }
      );
    }

    const { data: existingAutomation, error: fetchError } = await supabase
      .from('automations')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingAutomation) {
      return NextResponse.json(
        { error: 'Automazione non trovata.' },
        { status: 404 }
      );
    }

    const { data: automation, error: updateError } = await supabase
      .from('automations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating automation:', updateError);
      return NextResponse.json(
        { error: 'Errore nell\'aggiornamento dell\'automazione.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      automation,
      message: status === 'active' ? 'Automazione attivata!' : 'Automazione messa in pausa.',
    });
  } catch (error) {
    console.error('Automations PATCH error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    );
  }
}
