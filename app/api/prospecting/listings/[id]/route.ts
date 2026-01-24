import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateListingSchema = z.object({
  status: z.enum(['new', 'analyzed', 'called', 'in_negotiation', 'mandate_taken', 'appointment_set', 'rejected', 'converted']).optional(),
});

/**
 * PATCH /api/prospecting/listings/[id]
 * Aggiorna lo status di un listing
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validationResult = updateListingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Dati non validi', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { status } = validationResult.data;
    const listingId = params.id;

    // Verifica che il listing appartenga all'utente (con timeout)
    const fetchPromise = supabase
      .from('external_listings')
      .select('id, user_id')
      .eq('id', listingId)
      .eq('user_id', user.id)
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database timeout')), 10000)
    );

    let existingListing, fetchError;
    try {
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      existingListing = (result as any)?.data;
      fetchError = (result as any)?.error;
    } catch (error: any) {
      console.error('[UPDATE LISTING] Database timeout or error:', error);
      return NextResponse.json(
        { success: false, error: 'Il database è temporaneamente non disponibile. Riprova tra qualche istante.' },
        { status: 503 }
      );
    }

    if (fetchError || !existingListing) {
      return NextResponse.json(
        { success: false, error: 'Listing non trovato' },
        { status: 404 }
      );
    }

    // Aggiorna status
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
      
      // Se spostato in "called", imposta promemoria automatico
      if (status === 'called') {
        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + 3); // 3 giorni da ora
        
        const { data: currentSummary } = await supabase
          .from('external_listings')
          .select('ai_summary')
          .eq('id', listingId)
          .single();
        
        const currentSummaryData = currentSummary?.ai_summary || {};
        updateData.ai_summary = {
          ...currentSummaryData,
          auto_reminder_date: reminderDate.toISOString(),
          last_status_change: new Date().toISOString(),
        };
      }
    }

    const { error: updateError } = await supabase
      .from('external_listings')
      .update(updateData)
      .eq('id', listingId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('[UPDATE LISTING] Error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Errore nell\'aggiornamento' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Listing aggiornato con successo',
    });

  } catch (error: any) {
    console.error('[UPDATE LISTING] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

