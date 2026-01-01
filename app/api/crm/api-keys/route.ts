import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';
import type { UserApiKey, InsertUserApiKey, UpdateUserApiKey } from '@/lib/types/database.types';

function generateApiKey(): string {
  return `pk_live_${randomBytes(32).toString('hex')}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { data: apiKeys, error } = await supabase
      .from('user_api_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      return NextResponse.json({ error: 'Errore nel recupero delle API keys' }, { status: 500 });
    }

    const maskedKeys = (apiKeys || []).map((key: UserApiKey) => ({
      ...key,
      api_key: `${key.api_key.substring(0, 12)}...${key.api_key.substring(key.api_key.length - 4)}`
    }));

    return NextResponse.json({ apiKeys: maskedKeys });
  } catch (error) {
    console.error('Error in GET /api/crm/api-keys:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body: InsertUserApiKey = await request.json();

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Nome API key richiesto' }, { status: 400 });
    }

    const { count } = await supabase
      .from('user_api_keys')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if ((count || 0) >= 5) {
      return NextResponse.json({ 
        error: 'Limite massimo di 5 API keys raggiunto' 
      }, { status: 400 });
    }

    const apiKey = generateApiKey();

    const { data: newKey, error } = await supabase
      .from('user_api_keys')
      .insert({
        user_id: user.id,
        name: body.name.trim(),
        api_key: apiKey,
        auto_lead_score: body.auto_lead_score ?? false,
        auto_followup: body.auto_followup ?? false,
        default_market: body.default_market ?? 'italy',
        is_active: true,
        leads_captured: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      return NextResponse.json({ error: 'Errore nella creazione della API key' }, { status: 500 });
    }

    return NextResponse.json({ 
      apiKey: newKey,
      message: 'API Key creata con successo. Copia la chiave ora, non sarà più visibile!'
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/crm/api-keys:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { id, ...updates }: { id: string } & UpdateUserApiKey = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID API key richiesto' }, { status: 400 });
    }

    const { data: updatedKey, error } = await supabase
      .from('user_api_keys')
      .update({
        ...updates,
        name: updates.name?.trim()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating API key:', error);
      return NextResponse.json({ error: 'Errore nell\'aggiornamento della API key' }, { status: 500 });
    }

    if (!updatedKey) {
      return NextResponse.json({ error: 'API key non trovata' }, { status: 404 });
    }

    return NextResponse.json({ 
      apiKey: {
        ...updatedKey,
        api_key: `${updatedKey.api_key.substring(0, 12)}...${updatedKey.api_key.substring(updatedKey.api_key.length - 4)}`
      }
    });
  } catch (error) {
    console.error('Error in PATCH /api/crm/api-keys:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID API key richiesto' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting API key:', error);
      return NextResponse.json({ error: 'Errore nell\'eliminazione della API key' }, { status: 500 });
    }

    return NextResponse.json({ message: 'API key eliminata con successo' });
  } catch (error) {
    console.error('Error in DELETE /api/crm/api-keys:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
