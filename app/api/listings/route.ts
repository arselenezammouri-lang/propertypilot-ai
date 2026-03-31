import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';
import { savedListingSchema } from '@/lib/validations/property';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const { data: listings, error } = await supabase
      .from('saved_listings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    console.error('Listings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    
    const validatedInput = savedListingSchema.safeParse(body);
    if (!validatedInput.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedInput.error.errors },
        { status: 400 }
      );
    }

    const { data: listing, error } = await supabase
      .from('saved_listings')
      .insert({
        user_id: user.id,
        title: validatedInput.data.title || 'Untitled',
        property_type: validatedInput.data.property_data?.propertyType || null,
        location: validatedInput.data.property_data?.location || null,
        price: validatedInput.data.property_data?.price || null,
        size: validatedInput.data.property_data?.size || null,
        rooms: validatedInput.data.property_data?.rooms || null,
        features: validatedInput.data.property_data?.features || null,
        notes: validatedInput.data.property_data?.notes || null,
        style: validatedInput.data.property_data?.style || 'standard',
        market: validatedInput.data.property_data?.market || 'italy',
        professional_copy: validatedInput.data.generated_content?.professional || null,
        short_copy: validatedInput.data.generated_content?.short || null,
        english_copy: validatedInput.data.generated_content?.english || null,
        titles: validatedInput.data.generated_content?.titles || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving listing:', error);
      return NextResponse.json(
        { error: 'Failed to save listing' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: listing }, { status: 201 });
  } catch (error) {
    console.error('Listing save error:', error);
    return NextResponse.json(
      { error: 'Failed to save listing' },
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
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('id');

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('saved_listings')
      .delete()
      .eq('id', listingId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting listing:', error);
      return NextResponse.json(
        { error: 'Failed to delete listing' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Listing delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
