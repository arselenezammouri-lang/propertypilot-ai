import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireStripe, getPlanByPriceId, STRIPE_PLANS } from '@/lib/stripe/config';
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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stripe = requireStripe();

    const { data: dbSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const diagnosis: any = {
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
      database: {
        status: dbSubscription?.status || 'no_record',
        stripe_customer_id: dbSubscription?.stripe_customer_id || null,
        stripe_subscription_id: dbSubscription?.stripe_subscription_id || null,
        price_id: dbSubscription?.price_id || null,
        current_period_end: dbSubscription?.current_period_end || null,
      },
      stripe: {
        customer: null,
        subscription: null,
        active_subscriptions: [],
      },
      config: {
        starter_price_id: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'NOT_SET',
        pro_price_id: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'NOT_SET',
        agency_price_id: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || 'NOT_SET',
      },
      issues: [],
      recommendations: [],
    };

    if (dbSubscription?.stripe_customer_id) {
      try {
        const customer = await stripe.customers.retrieve(dbSubscription.stripe_customer_id);
        diagnosis.stripe.customer = {
          id: customer.id,
          email: (customer as any).email,
          deleted: (customer as any).deleted || false,
        };
      } catch (e: any) {
        diagnosis.issues.push(`Customer ${dbSubscription.stripe_customer_id} not found in Stripe`);
      }
    }

    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 5,
    });

    if (customers.data.length > 0) {
      for (const customer of customers.data) {
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          limit: 10,
        });

        for (const sub of subscriptions.data) {
          const priceId = sub.items.data[0]?.price.id;
          const detectedPlan = getPlanByPriceId(priceId);
          
          diagnosis.stripe.active_subscriptions.push({
            subscription_id: sub.id,
            customer_id: customer.id,
            status: sub.status,
            price_id: priceId,
            detected_plan: detectedPlan || 'UNKNOWN',
            current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
          });
        }
      }
    }

    if (dbSubscription?.stripe_subscription_id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(dbSubscription.stripe_subscription_id);
        const priceId = subscription.items.data[0]?.price.id;
        
        diagnosis.stripe.subscription = {
          id: subscription.id,
          status: subscription.status,
          price_id: priceId,
          detected_plan: getPlanByPriceId(priceId) || 'UNKNOWN',
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        };

        if (subscription.status !== 'active' && subscription.status !== 'trialing') {
          diagnosis.issues.push(`Stripe subscription status is "${subscription.status}", not active`);
        }

        if (priceId !== dbSubscription.price_id) {
          diagnosis.issues.push(`Price ID mismatch: DB has "${dbSubscription.price_id}", Stripe has "${priceId}"`);
        }

      } catch (e: any) {
        diagnosis.issues.push(`Subscription ${dbSubscription.stripe_subscription_id} not found in Stripe`);
      }
    }

    const paidStatuses = ['starter', 'pro', 'agency'];
    if (paidStatuses.includes(dbSubscription?.status) && !dbSubscription?.stripe_subscription_id) {
      diagnosis.issues.push(`DB shows "${dbSubscription.status}" but no stripe_subscription_id`);
      diagnosis.recommendations.push('Call POST /api/stripe/sync to fix');
    }

    if (diagnosis.stripe.active_subscriptions.length > 0 && !dbSubscription?.stripe_subscription_id) {
      const activeSub = diagnosis.stripe.active_subscriptions.find((s: any) => s.status === 'active');
      if (activeSub) {
        diagnosis.issues.push(`Active Stripe subscription exists but not linked in DB`);
        diagnosis.recommendations.push('Call POST /api/stripe/sync to link subscription');
      }
    }

    for (const sub of diagnosis.stripe.active_subscriptions) {
      if (sub.detected_plan === 'UNKNOWN' && sub.status === 'active') {
        diagnosis.issues.push(`Stripe subscription ${sub.subscription_id} has price_id "${sub.price_id}" which is not recognized`);
        diagnosis.recommendations.push(`Update NEXT_PUBLIC_STRIPE_PRO_PRICE_ID to "${sub.price_id}" if this is the Pro plan`);
      }
    }

    return NextResponse.json({
      success: true,
      diagnosis,
    });

  } catch (error: any) {
    console.error('[DIAGNOSE ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
