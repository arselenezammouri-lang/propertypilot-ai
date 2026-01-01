import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { insertLeadNoteSchema } from '@/lib/validations/lead';

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
    
    const validatedInput = insertLeadNoteSchema.safeParse(body);
    if (!validatedInput.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validatedInput.error.errors },
        { status: 400 }
      );
    }

    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('id', validatedInput.data.lead_id)
      .eq('user_id', user.id)
      .single();

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead non trovato o non autorizzato' },
        { status: 404 }
      );
    }

    const { data: note, error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: validatedInput.data.lead_id,
        user_id: user.id,
        nota: validatedInput.data.nota,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
      return NextResponse.json(
        { error: 'Errore nell\'aggiunta della nota' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error) {
    console.error('Note add error:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiunta della nota' },
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

    const { data: notes, error } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json(
        { error: 'Errore nel recupero delle note' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error('Notes fetch error:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero delle note' },
      { status: 500 }
    );
  }
}
