/**
 * Stripe Integration - Subscription Bridge
 * Gestione checkout, webhooks e subscription management
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Price IDs per i piani (da configurare in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  STARTER: process.env.STRIPE_PRICE_ID_STARTER || 'price_starter',
  PRO: process.env.STRIPE_PRICE_ID_PRO || 'price_pro',
  AGENCY: process.env.STRIPE_PRICE_ID_AGENCY || 'price_agency',
} as const;

// Mapping piano → Price ID
export const PLAN_TO_PRICE_ID: Record<string, string> = {
  STARTER: STRIPE_PRICE_IDS.STARTER,
  PRO: STRIPE_PRICE_IDS.PRO,
  AGENCY: STRIPE_PRICE_IDS.AGENCY,
};

/**
 * Crea una sessione di checkout per un piano
 */
export async function createCheckoutSession(
  customerId: string | null,
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: userId,
      ...metadata,
    },
    subscription_data: {
      metadata: {
        user_id: userId,
        ...metadata,
      },
    },
  };

  if (customerId) {
    sessionParams.customer = customerId;
  } else {
    sessionParams.customer_email = metadata?.email;
  }

  return await stripe.checkout.sessions.create(sessionParams);
}

/**
 * Crea o recupera un customer Stripe per un utente
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  // Cerca customer esistente
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0];
  }

  // Crea nuovo customer
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      user_id: userId,
    },
  });
}

/**
 * Cancella una subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Aggiorna una subscription (upgrade/downgrade)
 */
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'always_invoice',
  });
}

