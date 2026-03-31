import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';

export const dynamic = 'force-dynamic';

/**
 * GET /api/opportunities
 * Restituisce opportunità da external_listings in base a filtri semplici.
 *
 * Query params:
 * - type: 'underpriced' | 'old' | 'uncontacted' (default: 'underpriced')
 * - days: numero di giorni per i listing "vecchi" (default: 14)
 * - city: filtra per città (opzionale)
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'underpriced';
    const days = Number(searchParams.get('days') || '14');
    const city = searchParams.get('city') || undefined;

    // Carichiamo un set ragionevole di listing recenti e li filtriamo in memoria.
    const { data: listings, error } = await supabase
      .from('external_listings')
      .select('*')
      .eq('user_id', user.id)
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('[OPPORTUNITIES] Error fetching listings', error);
      return NextResponse.json(
        { success: false, error: 'Errore nel recupero degli annunci' },
        { status: 500 }
      );
    }

    const now = new Date();

    const opportunities = (listings || []).filter((listing: any) => {
      if (city && listing.city && listing.city !== city) return false;

      const createdAt = listing.created_at ? new Date(listing.created_at) : null;
      const daysOnline =
        createdAt != null ? Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) : null;

      // calcolo semplice di market_gap se abbiamo surface
      let marketGap: number | null = null;
      const surface = listing.raw_data?.surface || listing.ai_summary?.surface;
      if (listing.price && surface && surface > 0) {
        const pricePerSqm = listing.price / surface;
        const marketAvgPricePerSqm = pricePerSqm * 1.22;
        const gap = ((marketAvgPricePerSqm - pricePerSqm) / marketAvgPricePerSqm) * 100;
        marketGap = gap > 0 ? gap : null;
      }

      const status = listing.status || null;

      if (type === 'underpriced') {
        return marketGap !== null && marketGap > 10;
      }

      if (type === 'old') {
        return daysOnline != null && daysOnline >= days;
      }

      if (type === 'uncontacted') {
        // mai contattati: status nullo o non 'called' / 'appointment_set'
        return status === null || (status !== 'called' && status !== 'appointment_set');
      }

      return true;
    });

    const mapped = opportunities.map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      city: listing.city || listing.location || '',
      price: listing.price,
      source: listing.source_platform,
      status: listing.status,
      created_at: listing.created_at,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error('[OPPORTUNITIES] Unexpected error', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

