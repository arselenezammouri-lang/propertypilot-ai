import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import {
  createBlandAICall,
  generateProspectingCallScript,
  getDefaultObjectionHandlers,
  analyzeCallOutcome,
} from '@/lib/ai/voice-agent';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const callRequestSchema = z.object({
  listing_id: z.string().uuid('ID listing non valido'),
  webhook_url: z.string().url().optional(), // URL opzionale per callback
});

/**
 * POST /api/prospecting/call
 * Avvia una chiamata AI al proprietario di un listing
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
          message: subscriptionCheck.error || 'Il Voice AI Prospecting è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = callRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Dati non validi';
      return NextResponse.json(
        { success: false, error: errorMessage, details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { listing_id, webhook_url } = validationResult.data;

    // Recupera il listing dal database
    const { data: listing, error: listingError } = await supabase
      .from('external_listings')
      .select('*')
      .eq('id', listing_id)
      .eq('user_id', user.id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { success: false, error: 'Listing non trovato' },
        { status: 404 }
      );
    }

    // Verifica che il listing non sia già stato chiamato con successo
    if (listing.status === 'appointment_set') {
      return NextResponse.json(
        { success: false, error: 'Appuntamento già fissato per questo listing' },
        { status: 400 }
      );
    }

    // Verifica che ci sia un numero di telefono
    if (!listing.phone_number) {
      return NextResponse.json(
        { success: false, error: 'Numero di telefono non disponibile per questo listing' },
        { status: 400 }
      );
    }

    // Calcola market gap (mock - in produzione da API esterna)
    let marketGap: number | undefined;
    if (listing.price && listing.raw_data?.surface) {
      const pricePerSqm = listing.price / listing.raw_data.surface;
      const marketAvgPricePerSqm = pricePerSqm * 1.22; // Mock: 22% sopra
      const gap = ((marketAvgPricePerSqm - pricePerSqm) / marketAvgPricePerSqm) * 100;
      marketGap = gap > 0 ? gap : undefined;
    }

    // Genera script chiamata (Pitch d'Oro con market gap)
    const callScript = generateProspectingCallScript(
      listing.owner_name || (listing.source_platform === 'zillow' ? 'Sir/Madam' : 'Signore/Signora'),
      listing.location,
      listing.title,
      listing.source_platform,
      marketGap
    );

    // Genera objection handlers (con traduzione dinamica basata su location)
    const objectionHandlers = getDefaultObjectionHandlers(listing.source_platform, listing.location);

    // Costruisci webhook URL per callback (se non fornito)
    // IMPORTANTE: Includi listing_id nei metadata per il webhook
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const callbackWebhook = webhook_url || `${baseUrl}/api/prospecting/call/webhook?listing_id=${listing_id}`;

    try {
      // Crea chiamata via Bland AI
      const callResponse = await createBlandAICall({
        phone_number: listing.phone_number,
        task: callScript,
        voicemail_detection: true,
        model: 'enhanced',
        temperature: 0.7,
        interruption_threshold: 500,
        objection_handlers: objectionHandlers,
        webhook_url: callbackWebhook,
      });

      logger.info('[PROSPECTING CALL] Call initiated', {
        listingId: listing_id,
      });

      // Aggiorna status listing a 'called' (sarà aggiornato a 'appointment_set' dal webhook se l'appuntamento viene fissato)
      await supabase
        .from('external_listings')
        .update({
          status: 'called',
          updated_at: new Date().toISOString(),
        })
        .eq('id', listing_id)
        .eq('user_id', user.id);

      return NextResponse.json({
        success: true,
        data: {
          call_id: callResponse.call_id,
          status: callResponse.status,
          listing_id: listing_id,
          message: 'Chiamata avviata con successo',
        },
      });

    } catch (callError: any) {
      logger.error('[PROSPECTING CALL] Error creating call', callError);

      return NextResponse.json(
        {
          success: false,
          error: 'Errore nell\'avvio della chiamata',
          message: callError.message || 'Impossibile connettersi al servizio di chiamate AI',
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    logger.error('[PROSPECTING CALL] Unexpected error', error);
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
 * GET /api/prospecting/call?call_id=xxx
 * Recupera lo status di una chiamata
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

    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('call_id');

    if (!callId) {
      return NextResponse.json(
        { success: false, error: 'call_id richiesto' },
        { status: 400 }
      );
    }

    // Import dinamico per evitare errori se il modulo non è ancora disponibile
    const { getBlandAICallStatus, analyzeCallOutcome } = await import('@/lib/ai/voice-agent');

    try {
      const callStatus = await getBlandAICallStatus(callId);

      // Analizza outcome se disponibile transcript
      let analyzedOutcome;
      if (callStatus.transcript && callStatus.status === 'completed') {
        analyzedOutcome = analyzeCallOutcome(callStatus.transcript, callStatus.status);
      }

      return NextResponse.json({
        success: true,
        data: {
          ...callStatus,
          analyzed_outcome: analyzedOutcome,
        },
      });

    } catch (statusError: any) {
      logger.error('[PROSPECTING CALL] Error fetching call status', statusError);
      return NextResponse.json(
        {
          success: false,
          error: 'Errore nel recupero dello status chiamata',
          message: statusError.message,
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    logger.error('[PROSPECTING CALL] GET Error', error);
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

