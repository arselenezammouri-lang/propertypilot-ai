import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';
import { getResendClient } from '@/lib/resend-client';
import { emailTemplates } from '@/lib/email-templates';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

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
      logger.error('Auth error in setup-user', userError, { endpoint: '/api/auth/setup-user' });
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
        logger.error('Profile creation error', profileError, { endpoint: '/api/auth/setup-user' });
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
        logger.error('Subscription creation error', subscriptionError, { endpoint: '/api/auth/setup-user' });
      }
    }

    if (!existingProfile) {
      try {
        const { client, fromEmail } = await getResendClient();
        const userName = fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Agente';
        const emailContent = emailTemplates.welcome(userName);
        
        await client.emails.send({
          from: fromEmail,
          to: user.email!,
          subject: emailContent.subject,
          html: emailContent.html,
        });
        logger.debug('Welcome email sent', { endpoint: '/api/auth/setup-user' });
      } catch (emailError) {
        logger.error('Welcome email error', emailError, { endpoint: '/api/auth/setup-user' });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User setup completed',
    });

  } catch (error: any) {
    logger.error('Setup user API error', error, { endpoint: '/api/auth/setup-user' });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Setup failed'
      },
      { status: 500 }
    );
  }
}
