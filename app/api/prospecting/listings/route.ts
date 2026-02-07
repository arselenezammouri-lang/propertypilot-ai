import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { cachedSupabaseQuery } from '@/lib/utils/cache-edge';
import { logger } from '@/lib/utils/safe-logger';

/**
 * GET /api/prospecting/listings
 * Lista annunci external_listings con filtri e paginazione
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

    const { searchParams } = new URL(request.url);
    
    // Filtri
    const status = searchParams.get('status'); // 'new', 'called', 'appointment_set', 'rejected', 'converted', 'all'
    const platform = searchParams.get('platform'); // 'idealista', 'immobiliare', 'zillow', etc.
    const location = searchParams.get('location'); // Search text
    const category = searchParams.get('category'); // 'RESIDENTIAL_SALE', 'RESIDENTIAL_RENT', 'COMMERCIAL', 'all'
    const priceMin = searchParams.get('price_min'); // Number
    const priceMax = searchParams.get('price_max'); // Number
    
    // Paginazione
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    
    // Ordinamento
    const sortBy = searchParams.get('sort_by') || 'created_at'; // 'created_at', 'price', 'updated_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'; // 'asc', 'desc'

    // Build query
    let query = supabase
      .from('external_listings')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .is('archived_at', null) // Solo annunci non archiviati
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    // Applica filtri
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (platform) {
      query = query.eq('source_platform', platform);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (priceMin) {
      query = query.gte('price', parseFloat(priceMin));
    }

    if (priceMax) {
      query = query.lte('price', parseFloat(priceMax));
    }

    // Usa cache per query frequenti
    const cacheKey = `listings:${user.id}:${status || 'all'}:${platform || 'all'}:${location || 'all'}:${page}`;
    
    const result = await cachedSupabaseQuery(
      cacheKey,
      async () => {
        return await query;
      },
      2 * 60 * 1000 // 2 minuti cache per liste
    );
    
    const { data: listings, error, count } = result;

    if (error) {
      logger.error('Error fetching listings', error, { endpoint: '/api/prospecting/listings' });
      return NextResponse.json(
        {
          success: false,
          error: 'Errore nel recupero degli annunci',
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: listings || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error: any) {
    logger.error('Unexpected error in listings', error, { endpoint: '/api/prospecting/listings' });
    return NextResponse.json(
      {
        success: false,
        error: 'Errore interno del server',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

