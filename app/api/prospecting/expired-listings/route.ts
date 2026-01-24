import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { generateSmartBriefing } from '@/lib/ai/smart-briefing';

/**
 * GET /api/prospecting/expired-listings
 * Restituisce immobili rimossi o fermi da 120+ giorni
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

    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        { success: false, error: subscriptionCheck.error || 'Piano Premium richiesto' },
        { status: 403 }
      );
    }

    // Calcola data 120 giorni fa
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 120);

    // Recupera listings che non sono stati aggiornati da 120+ giorni
    const { data: staleListings, error: staleError } = await supabase
      .from('external_listings')
      .select('*')
      .eq('user_id', user.id)
      .lt('updated_at', daysAgo.toISOString())
      .is('archived_at', null)
      .order('updated_at', { ascending: true })
      .limit(20);

    if (staleError) {
      console.error('[EXPIRED LISTINGS] Error:', staleError);
      return NextResponse.json(
        { success: false, error: 'Errore nel recupero' },
        { status: 500 }
      );
    }

    // Genera AI note per ogni listing
    const expiredListings = (staleListings || []).map((listing) => {
      const daysOffline = Math.floor(
        (new Date().getTime() - new Date(listing.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determina se è stato rimosso o è solo fermo
      const isRemoved = listing.status === 'rejected' || daysOffline > 180;
      const status: 'removed' | 'stale' = isRemoved ? 'removed' : 'stale';

      // Genera nota AI
      let aiNote = '';
      if (isRemoved) {
        aiNote = 'Probabile mandato in scadenza o proprietario insoddisfatto. Opportunità per nuovo mandato esclusivo.';
      } else {
        aiNote = 'Immobile fermo sul mercato da oltre 120 giorni. Proprietario potrebbe essere aperto a nuove proposte o riduzione prezzo.';
      }

      return {
        id: listing.id,
        title: listing.title,
        location: listing.location,
        price: listing.price,
        source_url: listing.source_url,
        days_offline: daysOffline,
        ai_note: aiNote,
        status,
      };
    });

    return NextResponse.json({
      success: true,
      data: expiredListings,
    });

  } catch (error: any) {
    console.error('[EXPIRED LISTINGS] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

