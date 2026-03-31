import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const { title, property_data, generated_content, source_url } = body;

    if (!generated_content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Map to saved_listings schema columns
    const insertData: Record<string, unknown> = {
      user_id: user.id,
      title: title || generated_content?.titles?.[0] || 'Untitled',
      property_type: property_data?.propertyType || null,
      location: property_data?.location || null,
      price: property_data?.price || null,
      size: property_data?.size || null,
      rooms: property_data?.rooms || null,
      features: property_data?.features || null,
      notes: property_data?.notes || null,
      style: property_data?.style || 'standard',
      market: property_data?.market || 'italy',
      professional_copy: generated_content?.professional || null,
      short_copy: generated_content?.short || null,
      english_copy: generated_content?.english || null,
      titles: generated_content?.titles || [],
    };

    const { data, error } = await supabase
      .from('saved_listings')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[SAVE LISTING] Error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error('[SAVE LISTING API] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to save listing',
        message: error.message || 'Si è verificato un errore durante il salvataggio.'
      },
      { status: 500 }
    );
  }
}
