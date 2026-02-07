import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';

export const dynamic = 'force-dynamic';

/**
 * GET /api/prospecting/stats
 * Recupera statistiche per la dashboard (chiamate oggi, appuntamenti questa settimana)
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

    // Check PRO or AGENCY subscription
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
        },
        { status: 403 }
      );
    }

    // Calcola date
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Inizio settimana (Domenica)

    // Chiamate effettuate oggi (status = 'called' o 'appointment_set' con updated_at oggi)
    const { count: callsToday } = await supabase
      .from('external_listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['called', 'appointment_set'])
      .gte('updated_at', todayStart.toISOString())
      .is('archived_at', null);

    // Appuntamenti fissati questa settimana
    const { count: appointmentsThisWeek } = await supabase
      .from('external_listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'appointment_set')
      .gte('updated_at', weekStart.toISOString())
      .is('archived_at', null);

    // Nuovi listing trovati oggi
    const { count: newListingsToday } = await supabase
      .from('external_listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString())
      .is('archived_at', null);

    // Totale listing attivi
    const { count: totalActive } = await supabase
      .from('external_listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('archived_at', null);

    return NextResponse.json({
      success: true,
      data: {
        calls_today: callsToday || 0,
        appointments_this_week: appointmentsThisWeek || 0,
        new_listings_today: newListingsToday || 0,
        total_active: totalActive || 0,
      },
    });

  } catch (error: any) {
    console.error('[PROSPECTING STATS] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Errore nel recupero delle statistiche',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

