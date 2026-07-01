import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

/** Validate API key from Authorization header and check Agency plan */
async function validateApiKey(request: NextRequest): Promise<{ userId: string; agencyId?: string } | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const apiKey = authHeader.slice(7);
  if (!apiKey || apiKey.length < 10) return null;

  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, plan, agency_id')
      .eq('api_key', apiKey)
      .single();

    if (!profile) return null;
    if (profile.plan !== 'agency') return null; // API access is Agency tier only

    return { userId: profile.id, agencyId: profile.agency_id };
  } catch (err) {
    logger.error('API key validation error', err);
    return null;
  }
}

/** GET /api/v1/listings — list all listings for the agency */
export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized. API access requires Agency plan with valid API key.' }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = (page - 1) * limit;

    const { data: listings, error, count } = await supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      data: listings || [],
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (err) {
    logger.error('API v1 listings error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** POST /api/v1/listings — create a listing via API */
export async function POST(request: NextRequest) {
  const auth = await validateApiKey(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('listings')
      .insert({ ...body, user_id: auth.userId })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    logger.error('API v1 create listing error', err);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
