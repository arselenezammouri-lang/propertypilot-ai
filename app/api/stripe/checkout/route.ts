import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireStripe, STRIPE_PLANS, PlanType } from '@/lib/stripe/config';
import type { SubscriptionStatus } from '@/lib/types/database.types';

const VALID_PLANS: SubscriptionStatus[] = ['starter', 'pro', 'agency'];

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

    const selectedPlan = STRIPE_PLANS[planType as PlanType];
    const priceId = selectedPlan?.priceId;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan. Please configure NEXT_PUBLIC_STRIPE_' + planType.toUpperCase() + '_PRICE_ID' },
        { status: 500 }
      );
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subscription?.stripe_subscription_id && subscription.status !== 'free') {
      console.log(`User ${user.id} already has active subscription:`, subscription.stripe_subscription_id);
      return NextResponse.json(
        { 
          error: 'Active subscription exists',
          message: 'Hai già un abbonamento attivo. Gestiscilo dalla pagina Billing.',
          currentPlan: subscription.status
        },
        { status: 409 }
      );
    }

    let customerId = subscription?.stripe_customer_id;

    const stripe = requireStripe();

    if (!customerId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;

      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          status: 'free',
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        console.error('Failed to update subscription with customer ID:', upsertError);
        return NextResponse.json(
          { error: 'Failed to initialize subscription' },
          { status: 500 }
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        userId: user.id,
        planType,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
