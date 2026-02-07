import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireStripe, STRIPE_PLANS, PlanType, getPlanByPriceId } from '@/lib/stripe/config';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { logger } from '@/lib/utils/safe-logger';

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const VALID_PLANS: PlanType[] = ['starter', 'pro', 'agency'];
const PLAN_ORDER: Record<PlanType, number> = {
  starter: 1,
  pro: 2,
  agency: 3,
};

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

    const { planType } = await request.json();

    if (!planType || !VALID_PLANS.includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be "starter", "pro" or "agency"' },
        { status: 400 }
      );
    }

    const targetPlan = STRIPE_PLANS[planType as PlanType];
    const newPriceId = targetPlan?.priceId;

    if (!newPriceId) {
      return NextResponse.json(
        { error: `Price ID not configured for plan: ${planType}` },
        { status: 500 }
      );
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, status, price_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!subscription?.stripe_subscription_id) {
      return NextResponse.json(
        { 
          error: 'No active subscription found',
          message: 'Non hai una subscription attiva. Usa il checkout normale.',
          redirect: '/dashboard/billing'
        },
        { status: 400 }
      );
    }

    const currentPlan = subscription.status as PlanType;
    if (!VALID_PLANS.includes(currentPlan)) {
      return NextResponse.json(
        { error: 'Current plan is not upgradable' },
        { status: 400 }
      );
    }

    const stripe = requireStripe();

    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
    
    if (stripeSubscription.status !== 'active' && stripeSubscription.status !== 'trialing') {
      return NextResponse.json(
        { 
          error: 'Subscription is not active',
          message: 'La tua subscription non è attiva. Contatta il supporto.',
          stripeStatus: stripeSubscription.status
        },
        { status: 400 }
      );
    }

    const currentItemId = stripeSubscription.items.data[0]?.id;
    if (!currentItemId) {
      return NextResponse.json(
        { error: 'Could not find subscription item' },
        { status: 500 }
      );
    }

    const isUpgrade = PLAN_ORDER[planType as PlanType] > PLAN_ORDER[currentPlan];
    const isDowngrade = PLAN_ORDER[planType as PlanType] < PLAN_ORDER[currentPlan];

    logger.debug('[UPGRADE] User changing plan', {
      userId: user.id,
      from: currentPlan,
      to: planType,
      type: isUpgrade ? 'UPGRADE' : isDowngrade ? 'DOWNGRADE' : 'SAME',
    });

    const updatedSubscription = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      items: [
        {
          id: currentItemId,
          price: newPriceId,
        },
      ],
      proration_behavior: isUpgrade ? 'create_prorations' : 'none',
      billing_cycle_anchor: isDowngrade ? 'unchanged' : undefined,
    });

    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: planType,
        price_id: newPriceId,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      logger.error('[UPGRADE] Failed to update database', updateError, { userId: user.id });
    }

    logger.debug('[UPGRADE SUCCESS] User upgraded', { userId: user.id, plan: planType });

    return NextResponse.json({
      success: true,
      message: isUpgrade 
        ? `Upgrade a ${targetPlan.name} completato!` 
        : `Piano modificato a ${targetPlan.name}`,
      previousPlan: currentPlan,
      newPlan: planType,
      stripeSubscriptionId: updatedSubscription.id,
      isUpgrade,
      isDowngrade,
    });

  } catch (error: any) {
    logger.error('[UPGRADE ERROR]', error as Error, { component: 'stripe-upgrade', userId: user.id });
    return NextResponse.json(
      { error: error.message || 'Failed to upgrade subscription' },
      { status: 500 }
    );
  }
}
