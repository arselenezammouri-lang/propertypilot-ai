import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';
import { logger } from '@/lib/utils/safe-logger';
import { supabaseService } from '@/lib/supabase/service';
import { STRIPE_PLANS } from '@/lib/stripe/config';
import { repairMissingStripeSubscription } from '@/lib/utils/subscription-sync';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user } = auth;

    let subscription: {
      status?: string | null;
      generations_count?: number | null;
      stripe_subscription_id?: string | null;
      stripe_customer_id?: string | null;
    } | null = null;
    
    const { data: subData, error: subError } = await supabaseService
      .from('subscriptions')
      .select('status, generations_count, stripe_subscription_id, stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      if (subError.code === '42703') {
        logger.warn('Subscriptions table schema mismatch, using defaults', { endpoint: '/api/user/usage' });
      } else {
        logger.error('Error fetching subscription', subError, { endpoint: '/api/user/usage' });
      }
    } else {
      subscription = subData as {
        status?: string | null;
        generations_count?: number | null;
        stripe_subscription_id?: string | null;
        stripe_customer_id?: string | null;
      } | null;
    }

    if (!subscription) {
      const { data: newSub, error: createError } = await supabaseService
        .from('subscriptions')
        .insert({ user_id: user.id, status: 'free', generations_count: 0 })
        .select('status, generations_count')
        .single();
      
      if (!createError) {
        subscription = newSub as {
          status?: string | null;
          generations_count?: number | null;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
        } | null;
      }
    }

    let plan = subscription?.status || 'free';
    if (
      (plan === 'starter' || plan === 'pro' || plan === 'agency') &&
      !subscription?.stripe_subscription_id
    ) {
      const repair = await repairMissingStripeSubscription({
        userId: user.id,
        currentStatus: plan,
        stripeCustomerId: subscription?.stripe_customer_id || null,
        supabase: supabaseService,
      });
      if (repair.repaired) {
        plan = repair.status;
      } else {
        plan = 'free';
      }
    }
    const currentUsage = subscription?.generations_count || 0;
    
    const planLimits = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]?.limits || { listingsPerMonth: 5 };
    const limit = planLimits.listingsPerMonth;

    const hasReachedLimit = limit !== -1 && currentUsage >= limit;
    const isNearLimit = limit !== -1 && currentUsage >= limit * 0.8;
    const remainingGenerations = limit === -1 ? -1 : Math.max(0, limit - currentUsage);
    const percentageUsed = limit === -1 ? 0 : Math.min(100, (currentUsage / limit) * 100);

    return NextResponse.json({
      plan,
      currentUsage,
      limit,
      hasReachedLimit,
      isNearLimit,
      remainingGenerations,
      percentageUsed,
    });
  } catch (error) {
    logger.error('Error in usage endpoint', error, { endpoint: '/api/user/usage' });
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
