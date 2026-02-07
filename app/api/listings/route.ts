import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { savedListingSchema } from '@/lib/validations/property';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
        title: validatedInput.data.title,
        property_data: validatedInput.data.property_data,
        generated_content: validatedInput.data.generated_content,
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
