import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Try to get user with retry logic (cookie might not be synced immediately after signup)
    let user = null;
    let userError = null;
    
    // First attempt
    const { data: { user: firstAttemptUser }, error: firstAttemptError } = await supabase.auth.getUser();
    
    if (firstAttemptUser) {
      user = firstAttemptUser;
    } else if (firstAttemptError) {
      // If first attempt fails, wait a bit and retry (cookie sync delay)
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data: { user: retryUser }, error: retryError } = await supabase.auth.getUser();
      user = retryUser;
      userError = retryError;
    }
    
    if (userError || !user) {
      console.error('[SETUP USER] Auth error:', userError);
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: 'Session not found. Please try refreshing the page.',
          details: userError?.message || 'User session not available'
        },
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
