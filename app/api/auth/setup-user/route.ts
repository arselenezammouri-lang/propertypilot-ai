import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';
import { getResendClient } from '@/lib/resend-client';
import { emailTemplates } from '@/lib/email-templates';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

function normalizeReferralCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

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

    const { fullName, referralCode } = await request.json().catch(() => ({ fullName: null, referralCode: null }));
    const normalizedReferralCode = normalizeReferralCode(referralCode);

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
          email: user.email ?? null,
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

    if (normalizedReferralCode) {
      try {
        const { data: selfProfile, error: selfProfileError } = await supabaseService
          .from('profiles')
          .select('referred_by')
          .eq('id', user.id)
          .maybeSingle();

        if (!selfProfileError && !selfProfile?.referred_by) {
          let referrerId: string | null = null;
          let currentCredits = 0;
          let currentReferrals = 0;

          if (normalizedReferralCode.startsWith('PPID-')) {
            referrerId = normalizedReferralCode.replace('PPID-', '');
            const { data: referrerById } = await supabaseService
              .from('profiles')
              .select('id, referral_bonus_credits, total_referrals')
              .eq('id', referrerId)
              .maybeSingle();
            if (referrerById) {
              currentCredits = referrerById.referral_bonus_credits || 0;
              currentReferrals = referrerById.total_referrals || 0;
            } else {
              referrerId = null;
            }
          } else {
            const { data: referrerByCode } = await supabaseService
              .from('profiles')
              .select('id, referral_bonus_credits, total_referrals')
              .eq('referral_code', normalizedReferralCode.toUpperCase())
              .maybeSingle();
            if (referrerByCode) {
              referrerId = referrerByCode.id;
              currentCredits = referrerByCode.referral_bonus_credits || 0;
              currentReferrals = referrerByCode.total_referrals || 0;
            }
          }

          if (referrerId && referrerId !== user.id) {
            const { error: assignReferrerError } = await supabaseService
              .from('profiles')
              .update({ referred_by: referrerId })
              .eq('id', user.id);

            if (!assignReferrerError) {
              const BONUS_CREDITS = 10;
              await supabaseService
                .from('profiles')
                .update({
                  referral_bonus_credits: currentCredits + BONUS_CREDITS,
                  total_referrals: currentReferrals + 1,
                })
                .eq('id', referrerId);
            }
          }
        }
      } catch (referralError) {
        logger.warn('Referral setup skipped', { endpoint: '/api/auth/setup-user' });
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
