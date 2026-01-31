import { NextRequest, NextResponse } from 'next/server';
import { requireStripe, getPlanByPriceId, STRIPE_PLANS, getOneTimePackage } from '@/lib/stripe/config';
import { createClient } from '@supabase/supabase-js';
import type { SubscriptionStatus } from '@/lib/types/database.types';
import Stripe from 'stripe';

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for webhook processing');
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = requireStripe();
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('[WEBHOOK ERROR] STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }
    
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const paymentType = session.metadata?.paymentType;

  console.log('[WEBHOOK] Checkout completed:', {
    sessionId: session.id,
    userId,
    paymentType,
    mode: session.mode,
    customerId: session.customer,
    metadata: session.metadata,
  });

  if (!userId) {
    console.error('[WEBHOOK ERROR] Missing userId in session metadata', {
      sessionId: session.id,
      metadata: session.metadata,
    });
    throw new Error('Missing userId in checkout session');
  }

  if (paymentType === 'one_shot' && session.mode === 'payment') {
    await handleOneShotPayment(session, userId);
  } else if (session.mode === 'subscription' && session.subscription) {
    await handleSubscriptionCheckout(session, userId);
  } else {
    console.log('[WEBHOOK] Unhandled checkout mode:', session.mode);
  }
}

async function handleOneShotPayment(session: Stripe.Checkout.Session, userId: string) {
  const packageId = session.metadata?.packageId;
  const packageName = session.metadata?.packageName;

  console.log('[WEBHOOK ONE-SHOT] Processing payment:', {
    sessionId: session.id,
    userId,
    packageId,
    packageName,
    paymentStatus: session.payment_status,
  });

  if (session.payment_status !== 'paid') {
    console.log('[WEBHOOK ONE-SHOT] Payment not yet completed, skipping:', {
      sessionId: session.id,
      paymentStatus: session.payment_status,
    });
    return;
  }

  if (!packageId) {
    console.error('[WEBHOOK ERROR] Missing packageId in one-shot payment', {
      sessionId: session.id,
      metadata: session.metadata,
    });
    throw new Error('Missing packageId in one-shot checkout session');
  }

  const { data: existingPurchase } = await supabaseAdmin
    .from('purchases')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle();

  if (existingPurchase) {
    console.log('[WEBHOOK ONE-SHOT] Purchase already recorded, skipping duplicate:', {
      sessionId: session.id,
      purchaseId: existingPurchase.id,
    });
    return;
  }

  const selectedPackage = getOneTimePackage(packageId);
  
  const stripeAmountCents = session.amount_total ?? 0;
  const stripeAmount = Math.floor(stripeAmountCents / 100);
  const stripeCurrency = session.currency || 'eur';
  
  try {
    const { data, error } = await supabaseAdmin
      .from('purchases')
      .insert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string || null,
        stripe_customer_id: session.customer as string,
        package_id: packageId,
        package_name: packageName || selectedPackage?.name || packageId,
        amount: stripeAmount,
        currency: stripeCurrency,
        status: 'completed',
        deliverables: selectedPackage?.deliverables || {},
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        console.log('[WEBHOOK ONE-SHOT] Duplicate purchase detected (unique constraint):', {
          sessionId: session.id,
        });
        return;
      }
      console.error('[WEBHOOK ERROR] Failed to record purchase:', {
        userId,
        packageId,
        error,
      });
      throw error;
    }

    console.log('[WEBHOOK SUCCESS] One-shot purchase recorded:', {
      purchaseId: data?.id,
      userId,
      packageId,
      amount: stripeAmount,
      currency: stripeCurrency,
    });
  } catch (error) {
    console.error('[WEBHOOK ERROR] handleOneShotPayment failed:', error);
    throw error;
  }
}

async function handleSubscriptionCheckout(session: Stripe.Checkout.Session, userId: string) {
  try {
    const stripe = requireStripe();
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // SECURITY: Use real price_id from Stripe, not metadata (which can be manipulated)
    const priceId = subscription.items.data[0].price.id;
    const detectedPlan = getPlanByPriceId(priceId);

    if (!detectedPlan) {
      console.error('[WEBHOOK ERROR] Unrecognized price_id in checkout:', {
        priceId,
        sessionId: session.id,
        userId,
        subscriptionId: subscription.id,
      });
      throw new Error(`Unrecognized price_id: ${priceId}. This price is not configured in the system.`);
    }

    const planType = detectedPlan as SubscriptionStatus;

    const periodStart = (subscription as any).current_period_start;
    const periodEnd = (subscription as any).current_period_end;

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: session.customer as string,
        price_id: priceId,
        status: planType,
        current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        generations_count: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('[WEBHOOK ERROR] Failed to update subscription in Supabase:', {
        userId,
        subscriptionId: subscription.id,
        error,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('[WEBHOOK ERROR] No subscription found to update:', {
        userId,
        subscriptionId: subscription.id,
      });
      throw new Error(`No subscription found for user ${userId}`);
    }

    // Aggiorna anche profiles.subscription_plan
    await supabaseAdmin
      .from('profiles')
      .update({ subscription_plan: planType })
      .eq('id', userId);

    console.log('[WEBHOOK SUCCESS] Subscription updated:', {
      userId,
      subscriptionId: subscription.id,
      planType,
      message: planType === 'agency' ? 'Agency Intelligence Active - Accesso Premium Confermato' : 'Subscription activated',
    });
  } catch (error) {
    console.error('[WEBHOOK ERROR] handleSubscriptionCheckout failed:', error);
    throw error;
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log('[WEBHOOK] Subscription update:', {
    subscriptionId: subscription.id,
    status: subscription.status,
    metadata: subscription.metadata,
  });

  let userId = subscription.metadata?.userId;

  if (!userId) {
    console.log('[WEBHOOK] Missing userId in metadata, falling back to database lookup');
    const { data: existingSubscription, error: lookupError } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (lookupError || !existingSubscription) {
      console.error('[WEBHOOK ERROR] Cannot find user for subscription:', {
        subscriptionId: subscription.id,
        error: lookupError,
      });
      throw new Error(`User not found for subscription ${subscription.id}`);
    }

    userId = existingSubscription.user_id;
  }

  try {
    const priceId = subscription.items.data[0].price.id;
    
    // Use centralized logic from lib/stripe/config.ts
    const detectedPlan = getPlanByPriceId(priceId);
    
    let planType: SubscriptionStatus = 'free';
    if (detectedPlan) {
      planType = detectedPlan as SubscriptionStatus;
    } else {
      // Price ID not recognized: log error but don't crash (safer for updates)
      console.error('[WEBHOOK ERROR] Unrecognized price_id in subscription update:', {
        priceId,
        subscriptionId: subscription.id,
        userId,
      });
      // Keep 'free' as safe default for unrecognized prices
      planType = 'free';
    }

    const isActive = subscription.status === 'active' || subscription.status === 'trialing';

    const periodStart = (subscription as any).current_period_start;
    const periodEnd = (subscription as any).current_period_end;

    const shouldResetCount = periodStart && periodEnd;
    
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        stripe_subscription_id: subscription.id,
        price_id: priceId,
        status: isActive ? planType : 'free',
        current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(shouldResetCount ? { generations_count: 0 } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
      .select();

    if (error) {
      console.error('[WEBHOOK ERROR] Failed to update subscription:', {
        subscriptionId: subscription.id,
        userId,
        error,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('[WEBHOOK ERROR] No subscription found to update:', {
        subscriptionId: subscription.id,
        userId,
      });
      throw new Error(`No subscription found for subscription ID ${subscription.id}`);
    }

    // Aggiorna anche profiles.subscription_plan
    await supabaseAdmin
      .from('profiles')
      .update({ subscription_plan: isActive ? planType : 'free' })
      .eq('id', userId);

    console.log('[WEBHOOK SUCCESS] Subscription updated:', {
      subscriptionId: subscription.id,
      userId,
      planType: isActive ? planType : 'free',
      resetCount: shouldResetCount,
    });
  } catch (error) {
    console.error('[WEBHOOK ERROR] handleSubscriptionUpdate failed:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('[WEBHOOK] Subscription deleted:', {
    subscriptionId: subscription.id,
    metadata: subscription.metadata,
  });

  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'free',
        stripe_subscription_id: null,
        price_id: null,
        current_period_start: null,
        current_period_end: null,
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
      .select();

    if (error) {
      console.error('[WEBHOOK ERROR] Failed to delete subscription:', {
        subscriptionId: subscription.id,
        error,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('[WEBHOOK WARNING] No subscription found to delete (may have been already deleted):', {
        subscriptionId: subscription.id,
      });
    } else {
      // Aggiorna anche profiles.subscription_plan a 'free'
      const { data: subData } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single();
      
      if (subData?.user_id) {
        await supabaseAdmin
          .from('profiles')
          .update({ subscription_plan: 'free' })
          .eq('id', subData.user_id);
      }

      console.log('[WEBHOOK SUCCESS] Subscription deleted:', {
        subscriptionId: subscription.id,
      });
    }
  } catch (error) {
    console.error('[WEBHOOK ERROR] handleSubscriptionDeleted failed:', error);
    throw error;
  }
}
