import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const notificationSettingsSchema = z.object({
  morning_briefing_enabled: z.boolean(),
  morning_briefing_email: z.boolean(),
  morning_briefing_whatsapp: z.boolean(),
  briefing_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
});

/**
 * GET /api/settings/notifications
 * Recupera le impostazioni di notifica dell'utente
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    // Recupera settings dal profilo o usa defaults
    const { data: profile } = await supabase
      .from('profiles')
      .select('notification_settings')
      .eq('id', user.id)
      .single();

    const defaultSettings = {
      morning_briefing_enabled: false,
      morning_briefing_email: false,
      morning_briefing_whatsapp: false,
      briefing_time: '08:00',
    };

    const settings = profile?.notification_settings || defaultSettings;

    return NextResponse.json({
      success: true,
      data: settings,
    });

  } catch (error: any) {
    console.error('[NOTIFICATIONS SETTINGS GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings/notifications
 * Salva le impostazioni di notifica dell'utente
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
    const validationResult = notificationSettingsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Dati non validi', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const settings = validationResult.data;

    // Salva in notification_settings del profilo
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        notification_settings: settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[NOTIFICATIONS SETTINGS POST] Error updating:', updateError);
      return NextResponse.json(
        { success: false, error: 'Errore nel salvataggio' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Impostazioni salvate con successo',
    });

  } catch (error: any) {
    console.error('[NOTIFICATIONS SETTINGS POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

