import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }

    // Check PRO or AGENCY subscription (Lead Manager is a premium feature)
    const subscriptionCheck = await requireProOrAgencySubscription(supabase, user.id);
    if (!subscriptionCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: subscriptionCheck.error || 'Piano Premium richiesto',
          message: subscriptionCheck.error || 'Il Lead Manager + AI è una funzionalità Premium. Aggiorna il tuo account al piano PRO o AGENCY.',
        },
        { status: 403 }
      );
    }

    const leadId = params.id;

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead non trovato' },
        { status: 404 }
      );
    }

    const [notesResult, historyResult] = await Promise.all([
      supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false }),
      supabase
        .from('lead_status_history')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false }),
    ]);

    const leadWithDetails = {
      ...lead,
      notes: notesResult.data || [],
      status_history: historyResult.data || [],
    };

    return NextResponse.json({ success: true, data: leadWithDetails });
  } catch (error) {
    console.error('Lead detail fetch error:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero del lead' },
      { status: 500 }
    );
  }
}
