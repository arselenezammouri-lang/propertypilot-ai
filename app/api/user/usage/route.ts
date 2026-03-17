import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';
import { logger } from '@/lib/utils/safe-logger';
import { supabaseService } from '@/lib/supabase/service';
import { STRIPE_PLANS } from '@/lib/stripe/config';
import { repairMissingStripeSubscription } from '@/lib/utils/subscription-sync';

export const dynamic = 'force-dynamic';

type UsageSubscriptionRow = {
  status?: string | null;
  generations_count?: number | null;
  stripe_subscription_id?: string | null;
  stripe_customer_id?: string | null;
};

async function fetchSubscriptionRow(userId: string): Promise<UsageSubscriptionRow | null> {
  const attempts = [
    'status, generations_count, stripe_subscription_id, stripe_customer_id',
    'status, stripe_subscription_id, stripe_customer_id',
    'status, generations_count',
    'status',
  ];

  for (const selectClause of attempts) {
    const { data, error } = await supabaseService
      .from('subscriptions')
      .select(selectClause)
      .eq('user_id', userId)
      .maybeSingle();

    if (!error) {
      return (data as UsageSubscriptionRow | null) ?? null;
    }

    if (error.code === '42703') {
      continue;
    }

    logger.error('Error fetching subscription', error, { endpoint: '/api/user/usage' });
    return null;
  }

  logger.warn('Subscriptions table schema mismatch, using fallback select', { endpoint: '/api/user/usage' });
  return null;
}

async function createFreeSubscriptionRow(userId: string): Promise<UsageSubscriptionRow | null> {
  const withCounter = await supabaseService
    .from('subscriptions')
    .insert({ user_id: userId, status: 'free', generations_count: 0 })
    .select('status, generations_count, stripe_subscription_id, stripe_customer_id')
    .single();

  if (!withCounter.error) {
    return (withCounter.data as UsageSubscriptionRow | null) ?? null;
  }

  if (withCounter.error.code !== '42703') {
    logger.error('Error creating subscription row', withCounter.error, { endpoint: '/api/user/usage' });
    return null;
  }

  const minimalInsert = await supabaseService
    .from('subscriptions')
    .insert({ user_id: userId, status: 'free' })
    .select('status')
    .single();

  if (minimalInsert.error) {
    logger.error('Error creating minimal subscription row', minimalInsert.error, { endpoint: '/api/user/usage' });
    return null;
  }

  return (minimalInsert.data as UsageSubscriptionRow | null) ?? null;
}

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
    
    const subData = await fetchSubscriptionRow(user.id);
    if (subData) {
      subscription = subData as {
        status?: string | null;
        generations_count?: number | null;
        stripe_subscription_id?: string | null;
        stripe_customer_id?: string | null;
      } | null;
    }

    if (!subscription) {
      const newSub = await createFreeSubscriptionRow(user.id);
      if (newSub) {
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
