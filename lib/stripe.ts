/**
 * Stripe Integration - Subscription Bridge
 * Gestione checkout, webhooks e subscription management
 */

import Stripe from 'stripe';
import { requireStripe } from './stripe/config';

// Lazy initialization - Stripe viene inizializzato solo quando necessario
function getStripe(): Stripe {
  return requireStripe();
}

// Price IDs per i piani (da configurare in Stripe Dashboard)
// Allineato con lib/stripe/config.ts per coerenza
export const STRIPE_PRICE_IDS = {
  STARTER: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || process.env.STRIPE_PRICE_ID_STARTER || null,
  PRO: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || process.env.STRIPE_PRICE_ID_PRO || null,
  AGENCY: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || process.env.STRIPE_PRICE_ID_AGENCY || null,
} as const;

// Mapping piano → Price ID
export const PLAN_TO_PRICE_ID: Record<string, string | null> = {
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

  const stripe = getStripe();
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
  const stripe = getStripe();
  
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
  const stripe = getStripe();
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Aggiorna una subscription (upgrade/downgrade)
 */
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const stripe = getStripe();
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

