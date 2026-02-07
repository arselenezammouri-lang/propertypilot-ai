import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const trackRequestSchema = z.object({
  listing_id: z.string().uuid(),
  action: z.enum(['opened', 'sent']),
});

/**
 * POST /api/prospecting/whatsapp-track
 * Traccia apertura/invio di messaggi WhatsApp
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
    const validationResult = trackRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Dati non validi', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { listing_id, action } = validationResult.data;

    // Salva tracking in ai_summary del listing (con timeout)
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
      console.error('[WHATSAPP TRACK] Database timeout:', error);
      // Non bloccare l'utente, ritorna success anche se il tracking fallisce
      return NextResponse.json({ success: true, warning: 'Tracking non salvato, ma operazione completata' });
    }

    if (listing) {
      const currentSummary = listing.ai_summary || {};
      const whatsappTracking = currentSummary.whatsapp_tracking || {};
      
      if (action === 'opened') {
        whatsappTracking.opened_at = new Date().toISOString();
        whatsappTracking.opened_count = (whatsappTracking.opened_count || 0) + 1;
      } else if (action === 'sent') {
        whatsappTracking.sent_at = new Date().toISOString();
        whatsappTracking.sent_count = (whatsappTracking.sent_count || 0) + 1;
      }

      try {
        const updatePromise = supabase
          .from('external_listings')
          .update({
            ai_summary: {
              ...currentSummary,
              whatsapp_tracking: whatsappTracking,
            },
          })
          .eq('id', listing_id)
          .eq('user_id', user.id);

        await Promise.race([updatePromise, timeoutPromise]);
      } catch (error: any) {
        console.error('[WHATSAPP TRACK] Update timeout:', error);
        // Non bloccare, ritorna success
        return NextResponse.json({ success: true, warning: 'Tracking non salvato, ma operazione completata' });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[WHATSAPP TRACK] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

