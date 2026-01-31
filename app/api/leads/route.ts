import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireProOrAgencySubscription } from '@/lib/utils/subscription-check';
import { insertLeadSchema, updateLeadSchema, leadFiltersSchema } from '@/lib/validations/lead';

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
    const filters = {
      status: searchParams.get('status') || undefined,
      priorita: searchParams.get('priorita') || undefined,
      market: searchParams.get('market') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };

    const validatedFilters = leadFiltersSchema.safeParse(filters);
    if (!validatedFilters.success) {
      return NextResponse.json(
        { error: 'Filtri non validi', details: validatedFilters.error.errors },
        { status: 400 }
      );
    }

    let query = supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id);

    if (validatedFilters.data.status) {
      query = query.eq('status', validatedFilters.data.status);
    }
    if (validatedFilters.data.priorita) {
      query = query.eq('priorita', validatedFilters.data.priorita);
    }
    if (validatedFilters.data.market) {
      query = query.eq('market', validatedFilters.data.market);
    }
    if (validatedFilters.data.search) {
      query = query.or(`nome.ilike.%${validatedFilters.data.search}%,email.ilike.%${validatedFilters.data.search}%,telefono.ilike.%${validatedFilters.data.search}%`);
    }

    query = query.order(validatedFilters.data.sortBy, { 
      ascending: validatedFilters.data.sortOrder === 'asc' 
    });

    const { data: leads, error } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Errore nel recupero dei lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error('Leads fetch error:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero dei lead' },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    
    const validatedInput = insertLeadSchema.safeParse(body);
    if (!validatedInput.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validatedInput.error.errors },
        { status: 400 }
      );
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        user_id: user.id,
        ...validatedInput.data,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { error: 'Errore nella creazione del lead' },
        { status: 500 }
      );
    }

    await supabase
      .from('lead_status_history')
      .insert({
        lead_id: lead.id,
        old_status: null,
        new_status: lead.status,
      });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    console.error('Lead create error:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione del lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    
    const validatedInput = updateLeadSchema.safeParse(body);
    if (!validatedInput.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validatedInput.error.errors },
        { status: 400 }
      );
    }

    const { id, ...updateData } = validatedInput.data;

    const { data: lead, error } = await supabase
      .from('leads')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      return NextResponse.json(
        { error: 'Errore nell\'aggiornamento del lead' },
        { status: 500 }
      );
    }

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead non trovato' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento del lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json(
        { error: 'ID lead richiesto' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting lead:', error);
      return NextResponse.json(
        { error: 'Errore nell\'eliminazione del lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead delete error:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione del lead' },
      { status: 500 }
    );
  }
}
