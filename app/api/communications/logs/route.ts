import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CommunicationLog } from '@/lib/types/database.types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('lead_id');
    const channel = searchParams.get('channel');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('communication_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (leadId) {
      query = query.eq('lead_id', leadId);
    }

    if (channel && ['email', 'whatsapp', 'sms'].includes(channel)) {
      query = query.eq('channel', channel);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      console.error('Error fetching communication logs:', error);
      return NextResponse.json({ error: 'Errore nel recupero dei log' }, { status: 500 });
    }

    const stats = {
      total: count || 0,
      email: 0,
      whatsapp: 0,
      sms: 0,
    };

    if (logs && logs.length > 0) {
      const { data: channelStats } = await supabase
        .from('communication_logs')
        .select('channel')
        .eq('user_id', user.id);

      if (channelStats) {
        channelStats.forEach((log: { channel: string }) => {
          if (log.channel === 'email') stats.email++;
          else if (log.channel === 'whatsapp') stats.whatsapp++;
          else if (log.channel === 'sms') stats.sms++;
        });
      }
    }

    return NextResponse.json({ 
      logs: logs || [], 
      total: count || 0,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      }
    });
  } catch (error) {
    console.error('Error in GET /api/communications/logs:', error);
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
    const logId = searchParams.get('id');

    if (!logId) {
      return NextResponse.json({ error: 'ID log richiesto' }, { status: 400 });
    }

    const { data: existingLog, error: fetchError } = await supabase
      .from('communication_logs')
      .select('id')
      .eq('id', logId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingLog) {
      return NextResponse.json({ error: 'Log non trovato' }, { status: 404 });
    }

    const { error } = await supabase
      .from('communication_logs')
      .delete()
      .eq('id', logId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting log:', error);
      return NextResponse.json({ error: 'Errore nell\'eliminazione del log' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/communications/logs:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
