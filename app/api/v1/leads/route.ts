import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

async function validateApiKey(request: NextRequest): Promise<{ userId: string } | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const apiKey = authHeader.slice(7);
  if (!apiKey || apiKey.length < 10) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('profiles').select('id, plan').eq('api_key', apiKey).single();
    if (!data || data.plan !== 'agency') return null;
    return { userId: data.id };
  } catch { return null; }
}

/** GET /api/v1/leads — list leads */
export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const status = url.searchParams.get('status');
    const offset = (page - 1) * limit;

    let query = supabase.from('leads').select('*', { count: 'exact' }).eq('user_id', auth.userId).order('created_at', { ascending: false });
    if (status) query = query.eq('stato', status);
    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;
    return NextResponse.json({ data: data || [], pagination: { page, limit, total: count || 0 } });
  } catch (err) {
    logger.error('API v1 leads error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** POST /api/v1/leads — create lead via API */
export async function POST(request: NextRequest) {
  const auth = await validateApiKey(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const supabase = await createClient();
    const { data, error } = await supabase.from('leads').insert({ ...body, user_id: auth.userId }).select().single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    logger.error('API v1 create lead error', err);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
