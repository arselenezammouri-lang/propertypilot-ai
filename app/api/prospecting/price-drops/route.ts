import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';

/**
 * GET /api/prospecting/price-drops
 * Restituisce statistiche sui ribassi di prezzo rilevati oggi
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

    // Calcola data 48 ore fa
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    // Recupera listings con price_drop_percentage nelle ultime 48h
    const { data: listings, error: listingsError } = await supabase
      .from('external_listings')
      .select('ai_summary, updated_at')
      .eq('user_id', user.id)
      .gte('updated_at', twoDaysAgo.toISOString())
      .is('archived_at', null);

    if (listingsError) {
      console.error('[PRICE DROPS] Error:', listingsError);
      return NextResponse.json(
        { success: false, error: 'Errore nel recupero' },
        { status: 500 }
      );
    }

    // Conta ribassi
    const priceDropsToday = (listings || []).filter(
      (listing) => listing.ai_summary?.price_drop_percentage && listing.ai_summary.price_drop_percentage > 0
    ).length;

    // Conta opportunità di scadenza (stale listings)
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 120);

    const { count: expiredCount } = await supabase
      .from('external_listings')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lt('updated_at', daysAgo.toISOString())
      .is('archived_at', null);

    return NextResponse.json({
      success: true,
      data: {
        price_drops_today: priceDropsToday,
        expiration_opportunities: expiredCount || 0,
      },
    });

  } catch (error: any) {
    console.error('[PRICE DROPS] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

