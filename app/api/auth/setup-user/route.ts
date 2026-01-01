import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';

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

    const { fullName } = await request.json().catch(() => ({ fullName: null }));

    const { data: existingProfile } = await supabaseService
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      const { error: profileError } = await supabaseService
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fullName || user.user_metadata?.full_name || null,
        });

      if (profileError) {
        console.error('[SETUP USER] Profile creation error:', profileError);
      }
    }

    const { data: existingSubscription } = await supabaseService
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existingSubscription) {
      const { error: subscriptionError } = await supabaseService
        .from('subscriptions')
        .insert({
          user_id: user.id,
          status: 'free',
        });

      if (subscriptionError) {
        console.error('[SETUP USER] Subscription creation error:', subscriptionError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User setup completed',
    });

  } catch (error: any) {
    console.error('[SETUP USER API] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Setup failed'
      },
      { status: 500 }
    );
  }
}
