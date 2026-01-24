import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { generateSmartBriefing } from '@/lib/ai/smart-briefing';

/**
 * GET /api/notifications/briefing
 * Restituisce le top 3 opportunità per il briefing mattutino
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

    // Recupera listings delle ultime 24 ore
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: listings, error: listingsError } = await supabase
      .from('external_listings')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', yesterday.toISOString())
      .is('archived_at', null)
      .order('lead_score', { ascending: false, nullsFirst: false })
      .limit(50);

    if (listingsError) {
      console.error('[BRIEFING API] Error fetching listings:', listingsError);
      return NextResponse.json(
        { success: false, error: 'Errore nel recupero degli annunci' },
        { status: 500 }
      );
    }

    // Calcola market gap e filtra per top 3
    const listingsWithGap = (listings || []).map((listing) => {
      const surface = listing.raw_data?.surface || listing.ai_summary?.surface;
      let marketGap: number | null = null;

      if (listing.price && surface && surface > 0) {
        const pricePerSqm = listing.price / surface;
        const marketAvgPricePerSqm = pricePerSqm * 1.22; // Mock: 22% sopra
        const gap = ((marketAvgPricePerSqm - pricePerSqm) / marketAvgPricePerSqm) * 100;
        marketGap = gap > 0 ? gap : null;
      }

      const briefing = generateSmartBriefing(
        listing.title,
        listing.ai_summary?.summary_note || '',
        listing.price,
        listing.location,
        undefined,
        listing.raw_data
      );

      return {
        id: listing.id,
        title: listing.title,
        location: listing.location,
        price: listing.price,
        market_gap: marketGap,
        urgency_score: listing.ai_summary?.urgency_score || null,
        target_audience: briefing.targetAudience,
        source_url: listing.source_url,
      };
    });

    // Ordina per market gap (più alto = meglio) e prendi top 3
    const topListings = listingsWithGap
      .filter((l) => l.market_gap !== null && l.market_gap > 0)
      .sort((a, b) => (b.market_gap || 0) - (a.market_gap || 0))
      .slice(0, 3);

    // Se non ci sono abbastanza con market gap, aggiungi quelli con lead_score alto
    if (topListings.length < 3) {
      const remaining = listingsWithGap
        .filter((l) => !topListings.find((t) => t.id === l.id))
        .sort((a, b) => (b.urgency_score || 0) - (a.urgency_score || 0))
        .slice(0, 3 - topListings.length);
      topListings.push(...remaining);
    }

    // Mock: numero agenzie partner (in produzione da DB o API)
    const partnerAgencies = Math.floor(Math.random() * 15) + 5;

    return NextResponse.json({
      success: true,
      data: {
        listings: topListings.slice(0, 3),
        partner_agencies: partnerAgencies,
      },
    });

  } catch (error: any) {
    console.error('[BRIEFING API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

