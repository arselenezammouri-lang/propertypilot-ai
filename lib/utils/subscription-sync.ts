import { createClient as createAdminClient, type SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { getPlanByPriceId, requireStripe } from '@/lib/stripe/config';
import type { SubscriptionStatus } from '@/lib/types/database.types';
import { logger } from '@/lib/utils/safe-logger';

type PaidPlan = Exclude<SubscriptionStatus, 'free'>;

const ACTIVE_STRIPE_STATUSES = new Set(['active', 'trialing']);

interface RepairInput {
  userId: string;
  currentStatus: string | null;
  stripeCustomerId: string | null;
  supabase: SupabaseClient;
}

interface RepairResult {
  repaired: boolean;
  status: SubscriptionStatus;
  stripeSubscriptionId: string | null;
  reason: string;
}

function getAdminSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

async function persistPlanState(
  supabase: SupabaseClient,
  userId: string,
  payload: {
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    price_id: string | null;
    status: SubscriptionStatus;
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  }
) {
  const admin = getAdminSupabaseClient();
  const writer = admin ?? supabase;

  const { error: upsertError } = await writer
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        ...payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (upsertError) {
    return upsertError;
  }

  const { error: profileError } = await writer
    .from('profiles')
    .update({ subscription_plan: payload.status })
    .eq('id', userId);

  // Some environments do not have subscription_plan on profiles yet.
  if (profileError && profileError.code !== '42703') {
    logger.warn('[SUBSCRIPTION SYNC] Failed to update profile plan', {
      userId,
      code: profileError.code,
      message: profileError.message,
    });
  }

  return null;
}

export async function repairMissingStripeSubscription({
  userId,
  currentStatus,
  stripeCustomerId,
  supabase,
}: RepairInput): Promise<RepairResult> {
  const status = (currentStatus ?? 'free') as SubscriptionStatus;
  const isPaidStatus = status === 'starter' || status === 'pro' || status === 'agency';

  if (!isPaidStatus || !stripeCustomerId) {
    return {
      repaired: false,
      status,
      stripeSubscriptionId: null,
      reason: !isPaidStatus ? 'not-paid-status' : 'missing-customer-id',
    };
  }

  try {
    const stripe = requireStripe();
    const { data: subscriptions } = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all',
      limit: 20,
    });

    const activeSubscription = subscriptions.find((sub) =>
      ACTIVE_STRIPE_STATUSES.has(sub.status)
    );

    if (!activeSubscription) {
      await persistPlanState(supabase, userId, {
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: null,
        price_id: null,
        status: 'free',
        current_period_start: null,
        current_period_end: null,
        cancel_at_period_end: false,
      });

      return {
        repaired: true,
        status: 'free',
        stripeSubscriptionId: null,
        reason: 'downgraded-no-active-stripe-subscription',
      };
    }

    const priceId = activeSubscription.items.data[0]?.price?.id ?? null;
    if (!priceId) {
      return {
        repaired: false,
        status,
        stripeSubscriptionId: null,
        reason: 'missing-price-id',
      };
    }

    const detectedPlan = getPlanByPriceId(priceId);
    if (!detectedPlan) {
      return {
        repaired: false,
        status,
        stripeSubscriptionId: activeSubscription.id,
        reason: 'unknown-price-id',
      };
    }

    const periodStart = (activeSubscription as Stripe.Subscription & { current_period_start?: number }).current_period_start;
    const periodEnd = (activeSubscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;

    await persistPlanState(supabase, userId, {
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: activeSubscription.id,
      price_id: priceId,
      status: detectedPlan as PaidPlan,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: activeSubscription.cancel_at_period_end,
    });

    return {
      repaired: true,
      status: detectedPlan as PaidPlan,
      stripeSubscriptionId: activeSubscription.id,
      reason: 'linked-active-stripe-subscription',
    };
  } catch (error) {
    logger.warn('[SUBSCRIPTION SYNC] Stripe auto-repair failed', {
      userId,
      message: error instanceof Error ? error.message : 'unknown-error',
    });

    return {
      repaired: false,
      status,
      stripeSubscriptionId: null,
      reason: 'stripe-sync-error',
    };
  }
}
