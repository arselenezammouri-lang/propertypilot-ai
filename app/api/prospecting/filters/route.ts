import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

// Schema validazione per creazione filtro
const createFilterSchema = z.object({
  name: z.string().min(1, 'Il nome del filtro è obbligatorio').max(200, 'Il nome non può superare 200 caratteri'),
  criteria: z.object({
    location: z.string().optional(),
    price_min: z.number().min(0).optional(),
    price_max: z.number().min(0).optional(),
    property_type: z.string().optional(),
    rooms_min: z.number().int().min(1).optional(),
    rooms_max: z.number().int().min(1).optional(),
    source_platforms: z.array(z.enum(['idealista', 'immobiliare', 'zillow', 'mls', 'subito', 'casa'])).optional(),
  }).passthrough(), // passthrough per permettere campi aggiuntivi in futuro
  is_active: z.boolean().default(true),
  auto_run: z.boolean().default(false),
});

// Schema validazione per aggiornamento filtro
const updateFilterSchema = z.object({
  id: z.string().uuid('ID filtro non valido'),
  name: z.string().min(1).max(200).optional(),
  criteria: z.object({
    location: z.string().optional(),
    price_min: z.number().min(0).optional(),
    price_max: z.number().min(0).optional(),
    property_type: z.string().optional(),
    rooms_min: z.number().int().min(1).optional(),
    rooms_max: z.number().int().min(1).optional(),
    source_platforms: z.array(z.enum(['idealista', 'immobiliare', 'zillow', 'mls', 'subito', 'casa'])).optional(),
  }).passthrough().optional(),
  is_active: z.boolean().optional(),
  auto_run: z.boolean().optional(),
});

// Limiti filtri per piano
const FILTER_LIMITS: Record<string, number> = {
  pro: 10,
  agency: 50,
};

/**
 * GET /api/prospecting/filters
 * Recupera tutti i filtri dell'utente
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
          message: subscriptionCheck.error || 'Il Prospecting Engine è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('is_active');

    let query = supabase
      .from('prospecting_filters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: filters, error } = await query;

    if (error) {
      logger.error('[PROSPECTING FILTERS] Error fetching filters', error);
      return NextResponse.json(
        { success: false, error: 'Errore nel recupero dei filtri' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: filters || [],
      count: filters?.length || 0,
    });

  } catch (error: any) {
    logger.error('[PROSPECTING FILTERS] GET Error', error);
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

/**
 * POST /api/prospecting/filters
 * Crea un nuovo filtro di ricerca
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

    // Check PRO or AGENCY subscription
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
          message: subscriptionCheck.error || 'Il Prospecting Engine è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = createFilterSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Dati non validi';
      return NextResponse.json(
        { success: false, error: errorMessage, details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, criteria, is_active, auto_run } = validationResult.data;

    // Verifica limite filtri per piano
    const planType = subscriptionCheck.planType;
    const maxFilters = FILTER_LIMITS[planType] || FILTER_LIMITS.pro;

    const { count, error: countError } = await supabase
      .from('prospecting_filters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      logger.error('[PROSPECTING FILTERS] Error counting filters', countError);
      return NextResponse.json(
        { success: false, error: 'Errore nella verifica del limite filtri' },
        { status: 500 }
      );
    }

    if ((count || 0) >= maxFilters) {
      return NextResponse.json(
        {
          success: false,
          error: `Limite massimo di ${maxFilters} filtri raggiunto per il piano ${planType.toUpperCase()}. ${planType === 'pro' ? 'Aggiorna al piano AGENCY per avere fino a 50 filtri.' : ''}`,
        },
        { status: 400 }
      );
    }

    // Inserisci nuovo filtro
    const { data: newFilter, error: insertError } = await supabase
      .from('prospecting_filters')
      .insert({
        user_id: user.id,
        name: name.trim(),
        criteria,
        is_active: is_active ?? true,
        auto_run: auto_run ?? false,
        listings_found_count: 0,
      })
      .select()
      .single();

    if (insertError) {
      logger.error('[PROSPECTING FILTERS] Error creating filter', insertError);
      return NextResponse.json(
        { success: false, error: 'Errore nella creazione del filtro' },
        { status: 500 }
      );
    }

    logger.info('[PROSPECTING FILTERS] Created filter', {
      filterId: newFilter.id,
    });

    return NextResponse.json(
      {
        success: true,
        data: newFilter,
        message: 'Filtro creato con successo',
      },
      { status: 201 }
    );

  } catch (error: any) {
    logger.error('[PROSPECTING FILTERS] POST Error', error);
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

/**
 * PATCH /api/prospecting/filters
 * Aggiorna un filtro esistente
 */
export async function PATCH(request: NextRequest) {
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
          message: subscriptionCheck.error || 'Il Prospecting Engine è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = updateFilterSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Dati non validi';
      return NextResponse.json(
        { success: false, error: errorMessage, details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { id, ...updates } = validationResult.data;

    // Verifica che il filtro esista e appartenga all'utente
    const { data: existingFilter, error: fetchError } = await supabase
      .from('prospecting_filters')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingFilter) {
      return NextResponse.json(
        { success: false, error: 'Filtro non trovato' },
        { status: 404 }
      );
    }

    // Prepara dati per update
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name.trim();
    if (updates.criteria !== undefined) updateData.criteria = updates.criteria;
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
    if (updates.auto_run !== undefined) updateData.auto_run = updates.auto_run;

    // Aggiorna filtro
    const { data: updatedFilter, error: updateError } = await supabase
      .from('prospecting_filters')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      logger.error('[PROSPECTING FILTERS] Error updating filter', updateError);
      return NextResponse.json(
        { success: false, error: 'Errore nell\'aggiornamento del filtro' },
        { status: 500 }
      );
    }

    logger.info('[PROSPECTING FILTERS] Updated filter', {
      filterId: id,
    });

    return NextResponse.json({
      success: true,
      data: updatedFilter,
      message: 'Filtro aggiornato con successo',
    });

  } catch (error: any) {
    logger.error('[PROSPECTING FILTERS] PATCH Error', error);
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

/**
 * DELETE /api/prospecting/filters
 * Elimina un filtro
 */
export async function DELETE(request: NextRequest) {
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
          message: subscriptionCheck.error || 'Il Prospecting Engine è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID filtro richiesto' },
        { status: 400 }
      );
    }

    // Verifica che il filtro esista e appartenga all'utente
    const { data: existingFilter, error: fetchError } = await supabase
      .from('prospecting_filters')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingFilter) {
      return NextResponse.json(
        { success: false, error: 'Filtro non trovato' },
        { status: 404 }
      );
    }

    // Elimina filtro
    const { error: deleteError } = await supabase
      .from('prospecting_filters')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      logger.error('[PROSPECTING FILTERS] Error deleting filter', deleteError);
      return NextResponse.json(
        { success: false, error: 'Errore nell\'eliminazione del filtro' },
        { status: 500 }
      );
    }

    logger.info('[PROSPECTING FILTERS] Deleted filter', {
      filterId: id,
    });

    return NextResponse.json({
      success: true,
      message: 'Filtro eliminato con successo',
    });

  } catch (error: any) {
    logger.error('[PROSPECTING FILTERS] DELETE Error', error);
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

