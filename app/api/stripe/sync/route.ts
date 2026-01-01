import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireStripe, getPlanByPriceId } from '@/lib/stripe/config';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = "force-dynamic";

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[SYNC] Starting sync for user:', user.id, user.email);

    const stripe = requireStripe();

    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });

    if (customers.data.length === 0) {
      console.log('[SYNC] No Stripe customer found for email:', user.email);
      
      const { data: existingSub } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingSub) {
        await supabaseAdmin
          .from('subscriptions')
          .insert({
            user_id: user.id,
            status: 'free',
          });
        console.log('[SYNC] Created free subscription for user');
      }

      return NextResponse.json({ 
        success: true, 
        message: 'No Stripe customer found, set to free plan',
        plan: 'free'
      });
    }

    const customer = customers.data[0];
    console.log('[SYNC] Found Stripe customer:', customer.id);

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    let plan = 'free';
    let stripeSubscriptionId = null;
    let priceId = null;
    let periodStart = null;
    let periodEnd = null;

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      stripeSubscriptionId = subscription.id;
      priceId = subscription.items.data[0].price.id;
      
      const detectedPlan = getPlanByPriceId(priceId);
      if (detectedPlan) {
        plan = detectedPlan;
      } else {
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) {
          plan = 'starter';
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
          plan = 'pro';
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID) {
          plan = 'agency';
        }
      }

      periodStart = new Date((subscription as any).current_period_start * 1000).toISOString();
      periodEnd = new Date((subscription as any).current_period_end * 1000).toISOString();

      console.log('[SYNC] Found active subscription:', {
        subscriptionId: subscription.id,
        priceId,
        plan,
      });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        });
      console.log('[SYNC] Created profile for user');
    }

    const { error: upsertError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        stripe_customer_id: customer.id,
        stripe_subscription_id: stripeSubscriptionId,
        price_id: priceId,
        status: plan,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: subscriptions.data[0]?.cancel_at_period_end || false,
        generations_count: 0,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (upsertError) {
      console.error('[SYNC ERROR] Failed to upsert subscription:', upsertError);
      return NextResponse.json({ error: 'Failed to sync subscription' }, { status: 500 });
    }

    console.log('[SYNC SUCCESS] Synced subscription for user:', {
      userId: user.id,
      plan,
      stripeSubscriptionId,
    });

    return NextResponse.json({
      success: true,
      message: `Subscription synced successfully`,
      plan,
      stripeCustomerId: customer.id,
      stripeSubscriptionId,
    });

  } catch (error: any) {
    console.error('[SYNC ERROR]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync subscription' },
      { status: 500 }
    );
  }
}
