import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { analyzeCallOutcome } from '@/lib/ai/voice-agent';
import { sendEmail, generateAppointmentNotificationEmail } from '@/lib/utils/email';
import { createGoogleCalendarEvent, generateAppointmentCalendarEvent } from '@/lib/calendar/google';

/**
 * POST /api/prospecting/call/webhook
 * Webhook endpoint per ricevere callback da Bland AI quando una chiamata è completata
 * 
 * Questo endpoint viene chiamato automaticamente da Bland AI al termine della chiamata
 */
export async function POST(request: NextRequest) {
  try {
    // Usa service role key per bypassare RLS (webhook esterno)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const body = await request.json();

    // Bland AI webhook payload structure (adatta in base alla documentazione Bland AI)
    const {
      call_id,
      status,
      transcript,
      duration,
      phone_number,
      metadata, // Dovrebbe contenere listing_id se passato nel webhook_url
    } = body;

    // PRIORITÀ 1: Cerca listing_id nei query params del webhook URL (più affidabile)
    const { searchParams } = new URL(request.url);
    let listingIdFromQuery = searchParams.get('listing_id');

    console.log('[PROSPECTING CALL WEBHOOK] Received callback:', {
      call_id,
      status,
      has_transcript: !!transcript,
    });

    // Verifica che la chiamata sia completata
    if (status !== 'completed' && status !== 'failed' && status !== 'no-answer') {
      return NextResponse.json({
        success: true,
        message: 'Call still in progress, will process when completed',
      });
    }

    // PRIORITÀ: listing_id da query params > metadata > phone_number lookup
    let listingId: string | null = null;

    if (listingIdFromQuery) {
      listingId = listingIdFromQuery;
    } else if (metadata?.listing_id) {
      listingId = metadata.listing_id;
    } else if (phone_number) {
      // Cerca listing per phone_number (potrebbe essere ambiguito se stesso numero per più listing)
      const { data: listings } = await supabaseAdmin
        .from('external_listings')
        .select('id')
        .eq('phone_number', phone_number)
        .eq('status', 'called') // Solo listing già in stato 'called'
        .order('updated_at', { ascending: false })
        .limit(1);

      if (listings && listings.length > 0) {
        listingId = listings[0].id;
      }
    }

    if (!listingId) {
      console.warn('[PROSPECTING CALL WEBHOOK] Could not find listing for call:', call_id);
      return NextResponse.json({
        success: true,
        message: 'Listing not found, but webhook received',
      });
    }

    // Analizza outcome della chiamata
    let newStatus: 'called' | 'appointment_set' | 'rejected' | 'no_answer' = 'called';

    if (status === 'no-answer' || status === 'busy') {
      newStatus = 'no_answer';
    } else if (transcript) {
      newStatus = analyzeCallOutcome(transcript, status);
    }

    // Aggiorna listing con nuovo status
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    // Se abbiamo transcript, salvalo in ai_summary
    if (transcript) {
      const { data: existingListing } = await supabaseAdmin
        .from('external_listings')
        .select('ai_summary')
        .eq('id', listingId)
        .single();

      const existingSummary = existingListing?.ai_summary || {};
      
      updateData.ai_summary = {
        ...existingSummary,
        call_transcript: transcript,
        call_duration: duration,
        call_outcome: newStatus,
        call_completed_at: new Date().toISOString(),
      };
    }

    const { error: updateError } = await supabaseAdmin
      .from('external_listings')
      .update(updateData)
      .eq('id', listingId);

    if (updateError) {
      console.error('[PROSPECTING CALL WEBHOOK] Error updating listing:', updateError);
      return NextResponse.json(
        { success: false, error: 'Error updating listing' },
        { status: 500 }
      );
    }

    console.log(`[PROSPECTING CALL WEBHOOK] Updated listing ${listingId} to status: ${newStatus}`);

    // Se l'appuntamento è stato fissato, invia notifica email all'agente
    if (newStatus === 'appointment_set') {
      try {
        // Recupera user_id dal listing
        const { data: listingData } = await supabaseAdmin
          .from('external_listings')
          .select('user_id, title, location, price, source_url, owner_name, phone_number, email, ai_summary')
          .eq('id', listingId)
          .single();

        if (listingData) {
          // Recupera email utente da profiles
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('email')
            .eq('id', listingData.user_id)
            .single();

          // Se l'email è in profiles, usa quella. Altrimenti prova auth.users
          let userEmail = profile?.email;

          if (!userEmail) {
            // Fallback: recupera da auth.users (richiede admin)
            const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(listingData.user_id);
            userEmail = authUser?.user?.email;
          }

          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://propertypilot.ai';
          const dashboardUrl = `${baseUrl}/dashboard/prospecting`;

          // Send email notification
          if (userEmail) {
            const emailHtml = generateAppointmentNotificationEmail({
              title: listingData.title,
              location: listingData.location,
              price: listingData.price,
              source_url: listingData.source_url,
              owner_name: listingData.owner_name,
              phone_number: listingData.phone_number,
              ai_summary: listingData.ai_summary,
            });

            const emailResult = await sendEmail({
              to: userEmail,
              subject: `🎉 Appuntamento Fissato: ${listingData.title}`,
              html: emailHtml,
            });

            if (emailResult.success) {
              // Log senza email esposta (solo in sviluppo)
              if (process.env.NODE_ENV === 'development') {
                console.log(`[PROSPECTING CALL WEBHOOK] Notification email sent`);
              }
            } else {
              console.warn(`[PROSPECTING CALL WEBHOOK] Failed to send notification email: ${emailResult.error}`);
            }
          }

          // Create Google Calendar event - Automatic sync quando appointment_set
          try {
            const calendarEvent = generateAppointmentCalendarEvent(
              listingData.title,
              listingData.location,
              listingData.owner_name,
              listingData.phone_number,
              listingData.email || undefined,
              dashboardUrl
            );
            const calendarResult = await createGoogleCalendarEvent(calendarEvent);
            if (calendarResult.success) {
              console.log(`[PROSPECTING CALL WEBHOOK] ✅ Calendar event created: ${calendarResult.eventUrl}`);
              console.log(`[PROSPECTING CALL WEBHOOK] Event ID: ${calendarResult.eventId}`);
            } else {
              console.warn(`[PROSPECTING CALL WEBHOOK] ⚠️ Failed to create calendar event: ${calendarResult.error}`);
            }
          } catch (calendarError: any) {
            console.error('[PROSPECTING CALL WEBHOOK] ❌ Error creating calendar event:', calendarError);
            // Non-blocking error - calendar sync è opzionale ma non dovrebbe bloccare il webhook
          }

          if (!userEmail) {
            console.warn(`[PROSPECTING CALL WEBHOOK] User email not found for user_id ${listingData.user_id}`);
          }
        }
      } catch (emailError: any) {
        // Non bloccare il webhook se l'email fallisce
        console.error('[PROSPECTING CALL WEBHOOK] Error sending notification email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      listing_id: listingId,
      new_status: newStatus,
    });

  } catch (error: any) {
    console.error('[PROSPECTING CALL WEBHOOK] Error:', error);
    
    // Ritorna sempre 200 per evitare retry infiniti da Bland AI
    return NextResponse.json({
      success: false,
      error: 'Error processing webhook',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

