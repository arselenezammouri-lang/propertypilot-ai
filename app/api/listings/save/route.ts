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

    if (!title || !property_data || !generated_content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to saved_listings table
    const { data, error } = await supabase
      .from('saved_listings')
      .insert({
        user_id: user.id,
        title,
        property_data,
        generated_content,
        source_url: source_url || null,
        scraped_data: property_data, // For backward compatibility
      })
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
