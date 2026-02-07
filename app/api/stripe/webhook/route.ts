import { NextRequest, NextResponse } from 'next/server';
import { requireStripe, getPlanByPriceId, STRIPE_PLANS, getOneTimePackage } from '@/lib/stripe/config';
import { createClient } from '@supabase/supabase-js';
import type { SubscriptionStatus } from '@/lib/types/database.types';
import Stripe from 'stripe';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

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
      logger.error('STRIPE_WEBHOOK_SECRET not configured', undefined, { endpoint: '/api/stripe/webhook' });
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
    logger.error('Webhook signature verification failed', error, { endpoint: '/api/stripe/webhook' });
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
        logger.debug('Unhandled event type', { eventType: event.type, endpoint: '/api/stripe/webhook' });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error', error, { endpoint: '/api/stripe/webhook' });
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const paymentType = session.metadata?.paymentType;

  logger.stripeEvent('checkout.session.completed', {
    sessionId: session.id,
    mode: session.mode,
    paymentType,
  });

  if (!userId) {
    logger.error('Missing userId in session metadata', undefined, { 
      endpoint: '/api/stripe/webhook',
      sessionId: session.id,
    });
    throw new Error('Missing userId in checkout session');
  }

  if (paymentType === 'one_shot' && session.mode === 'payment') {
    await handleOneShotPayment(session, userId);
  } else if (session.mode === 'subscription' && session.subscription) {
    await handleSubscriptionCheckout(session, userId);
  } else {
    logger.debug('Unhandled checkout mode', { mode: session.mode, endpoint: '/api/stripe/webhook' });
  }
}

async function handleOneShotPayment(session: Stripe.Checkout.Session, userId: string) {
  const packageId = session.metadata?.packageId;
  const packageName = session.metadata?.packageName;

  logger.stripeEvent('one-shot.payment.processing', {
    sessionId: session.id,
    packageId,
    packageName,
    paymentStatus: session.payment_status,
  });

  if (session.payment_status !== 'paid') {
    logger.debug('Payment not yet completed, skipping', { 
      sessionId: session.id,
      paymentStatus: session.payment_status,
      endpoint: '/api/stripe/webhook',
    });
    return;
  }

  if (!packageId) {
    logger.error('Missing packageId in one-shot payment', undefined, {
      endpoint: '/api/stripe/webhook',
      sessionId: session.id,
    });
    throw new Error('Missing packageId in one-shot checkout session');
  }

  const { data: existingPurchase } = await supabaseAdmin
    .from('purchases')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle();

  if (existingPurchase) {
    logger.debug('Purchase already recorded, skipping duplicate', {
      sessionId: session.id,
      purchaseId: existingPurchase.id,
      endpoint: '/api/stripe/webhook',
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
        logger.debug('Duplicate purchase detected (unique constraint)', {
          sessionId: session.id,
          endpoint: '/api/stripe/webhook',
        });
        return;
      }
      logger.error('Failed to record purchase', error, {
        endpoint: '/api/stripe/webhook',
        packageId,
      });
      throw error;
    }

    logger.stripeEvent('one-shot.purchase.recorded', {
      purchaseId: data?.id,
      packageId,
      amount: stripeAmount,
      currency: stripeCurrency,
    });
  } catch (error) {
    logger.error('handleOneShotPayment failed', error, { endpoint: '/api/stripe/webhook' });
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
      logger.error('Unrecognized price_id in checkout', undefined, {
        endpoint: '/api/stripe/webhook',
        priceId,
        sessionId: session.id,
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
      logger.error('Failed to update subscription in Supabase', error, {
        endpoint: '/api/stripe/webhook',
        subscriptionId: subscription.id,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      logger.error('No subscription found to update', undefined, {
        endpoint: '/api/stripe/webhook',
        subscriptionId: subscription.id,
      });
      throw new Error(`No subscription found for user ${userId}`);
    }

    // Aggiorna anche profiles.subscription_plan
    await supabaseAdmin
      .from('profiles')
      .update({ subscription_plan: planType })
      .eq('id', userId);

    logger.stripeEvent('subscription.checkout.completed', {
      planType,
      message: planType === 'agency' ? 'Agency Intelligence Active - Accesso Premium Confermato' : 'Subscription activated',
    });
  } catch (error) {
    logger.error('handleSubscriptionCheckout failed', error, { endpoint: '/api/stripe/webhook' });
    throw error;
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  logger.stripeEvent('subscription.update', {
    subscriptionId: subscription.id,
    status: subscription.status,
  });

  let userId = subscription.metadata?.userId;

  if (!userId) {
    logger.debug('Missing userId in metadata, falling back to database lookup', { 
      endpoint: '/api/stripe/webhook',
      subscriptionId: subscription.id,
    });
    const { data: existingSubscription, error: lookupError } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (lookupError || !existingSubscription) {
      logger.error('Cannot find user for subscription', lookupError, {
        endpoint: '/api/stripe/webhook',
        subscriptionId: subscription.id,
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
      logger.error('Unrecognized price_id in subscription update', undefined, {
        endpoint: '/api/stripe/webhook',
        priceId,
        subscriptionId: subscription.id,
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
      logger.error('Failed to update subscription', error, {
        endpoint: '/api/stripe/webhook',
        subscriptionId: subscription.id,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      logger.error('No subscription found to update', undefined, {
        endpoint: '/api/stripe/webhook',
        subscriptionId: subscription.id,
      });
      throw new Error(`No subscription found for subscription ID ${subscription.id}`);
    }

    // Aggiorna anche profiles.subscription_plan
    await supabaseAdmin
      .from('profiles')
      .update({ subscription_plan: isActive ? planType : 'free' })
      .eq('id', userId);

    logger.stripeEvent('subscription.update.success', {
      subscriptionId: subscription.id,
      planType: isActive ? planType : 'free',
      resetCount: shouldResetCount,
    });
  } catch (error) {
    logger.error('handleSubscriptionUpdate failed', error, { endpoint: '/api/stripe/webhook' });
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  logger.stripeEvent('subscription.deleted', {
    subscriptionId: subscription.id,
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
      logger.error('Failed to delete subscription', error, {
        endpoint: '/api/stripe/webhook',
        subscriptionId: subscription.id,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      logger.warn('No subscription found to delete (may have been already deleted)', {
        endpoint: '/api/stripe/webhook',
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

      logger.stripeEvent('subscription.deleted.success', {
        subscriptionId: subscription.id,
      });
    }
  } catch (error) {
    logger.error('handleSubscriptionDeleted failed', error, { endpoint: '/api/stripe/webhook' });
    throw error;
  }
}
