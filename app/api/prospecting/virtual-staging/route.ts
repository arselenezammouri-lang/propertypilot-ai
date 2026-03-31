import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const virtualStagingSchema = z.object({
  listing_id: z.string().uuid(),
  generated: z.boolean(),
});

/**
 * POST /api/prospecting/virtual-staging
 * Salva lo stato di generazione virtual staging
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

    // Check PRO or AGENCY subscription (Virtual Staging is a premium feature)
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
          message: subscriptionCheck.error || 'Il Virtual Staging 3D è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = virtualStagingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Dati non validi', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { listing_id, generated } = validationResult.data;

    // Recupera listing esistente (con timeout)
    const fetchPromise = supabase
      .from('external_listings')
      .select('ai_summary')
      .eq('id', listing_id)
      .eq('user_id', user.id)
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database timeout')), 10000)
    );

    let listing;
    try {
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      listing = (result as any)?.data;
    } catch (error: any) {
      console.error('[VIRTUAL STAGING] Database timeout:', error);
      return NextResponse.json(
        { success: false, error: 'Il database è temporaneamente non disponibile. Riprova tra qualche istante.' },
        { status: 503 }
      );
    }

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing non trovato' },
        { status: 404 }
      );
    }

    // Aggiorna ai_summary con virtual_staging_generated (con timeout)
    const currentSummary = listing.ai_summary || {};
    
    try {
      const updatePromise = supabase
        .from('external_listings')
        .update({
          ai_summary: {
            ...currentSummary,
            virtual_staging_generated: generated,
            virtual_staging_generated_at: generated ? new Date().toISOString() : null,
          },
        })
        .eq('id', listing_id)
        .eq('user_id', user.id);

      await Promise.race([updatePromise, timeoutPromise]);
    } catch (error: any) {
      console.error('[VIRTUAL STAGING] Update timeout:', error);
      return NextResponse.json(
        { success: false, error: 'Errore durante il salvataggio. Riprova tra qualche istante.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[VIRTUAL STAGING] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

