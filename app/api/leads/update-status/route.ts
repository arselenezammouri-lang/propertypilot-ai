import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateStatusSchema } from '@/lib/validations/lead';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const validatedInput = updateStatusSchema.safeParse(body);
    if (!validatedInput.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validatedInput.error.errors },
        { status: 400 }
      );
    }

    const { data: currentLead } = await supabase
      .from('leads')
      .select('id, status')
      .eq('id', validatedInput.data.lead_id)
      .eq('user_id', user.id)
      .single();

    if (!currentLead) {
      return NextResponse.json(
        { error: 'Lead non trovato o non autorizzato' },
        { status: 404 }
      );
    }

    const oldStatus = currentLead.status;
    const newStatus = validatedInput.data.new_status;

    if (oldStatus === newStatus) {
      return NextResponse.json(
        { error: 'Il lead ha già questo stato' },
        { status: 400 }
      );
    }

    const { data: lead, error: updateError } = await supabase
      .from('leads')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedInput.data.lead_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating lead status:', updateError);
      return NextResponse.json(
        { error: 'Errore nell\'aggiornamento dello stato' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: lead,
      message: `Stato aggiornato da "${oldStatus}" a "${newStatus}"`
    });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento dello stato' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('lead_id');

    if (!leadId) {
      return NextResponse.json(
        { error: 'ID lead richiesto' },
        { status: 400 }
      );
    }

    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead non trovato o non autorizzato' },
        { status: 404 }
      );
    }

    const { data: history, error } = await supabase
      .from('lead_status_history')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching status history:', error);
      return NextResponse.json(
        { error: 'Errore nel recupero dello storico stati' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Status history fetch error:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero dello storico stati' },
      { status: 500 }
    );
  }
}
