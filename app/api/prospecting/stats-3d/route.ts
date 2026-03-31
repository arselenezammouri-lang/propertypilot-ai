import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';

export const dynamic = 'force-dynamic';

/**
 * GET /api/prospecting/stats-3d
 * Restituisce statistiche su progetti 3D generati e WhatsApp
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

    const userId = user.id;

    // Conta progetti 3D generati (listing con ai_summary.virtual_staging_generated = true)
    const { data: listings } = await supabase
      .from('external_listings')
      .select('ai_summary')
      .eq('user_id', userId)
      .is('archived_at', null);

    let projects3DGenerated = 0;
    let whatsappOpened = 0;
    let whatsappSent = 0;

    if (listings) {
      listings.forEach((listing) => {
        const summary = listing.ai_summary || {};
        
        // Conta progetti 3D
        if (summary.virtual_staging_generated === true) {
          projects3DGenerated++;
        }

        // Conta WhatsApp
        const whatsappTracking = summary.whatsapp_tracking || {};
        if (whatsappTracking.opened_count) {
          whatsappOpened += whatsappTracking.opened_count;
        }
        if (whatsappTracking.sent_count) {
          whatsappSent += whatsappTracking.sent_count;
        }
      });
    }

    // Calcola tasso di apertura (mock: assumiamo 75% se ci sono invii)
    const openRate = whatsappSent > 0 
      ? Math.round((whatsappOpened / whatsappSent) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        projects_3d_generated: projects3DGenerated,
        whatsapp_opened: whatsappOpened,
        whatsapp_sent: whatsappSent,
        whatsapp_open_rate: openRate,
      },
    });

  } catch (error: any) {
    console.error('[STATS 3D API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

