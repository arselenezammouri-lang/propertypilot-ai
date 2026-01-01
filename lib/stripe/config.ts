import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function requireStripe(): Stripe {
  if (typeof window !== 'undefined') {
    throw new Error('Stripe can only be initialized on the server');
  }
  
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
    });
  }
  return stripeInstance;
}

export const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    price: 97,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || null,
    tagline: 'AI listing tools for solo agents',
    features: [
      'Strumenti AI di base per annunci',
      'Per singoli agenti',
      'Accesso alle funzioni core di generazione annunci',
    ],
    limits: {
      listingsPerMonth: 50,
    },
  },
  pro: {
    name: 'Pro',
    price: 297,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || null,
    tagline: 'CRM, automations & AI tools',
    features: [
      'Tutte le funzionalità Starter',
      'CRM e automazioni',
      'Strumenti AI avanzati per agenzie',
    ],
    limits: {
      listingsPerMonth: 200,
    },
  },
  agency: {
    name: 'Agency',
    price: 497,
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || null,
    tagline: 'For teams up to 10 agents',
    features: [
      'Tutte le funzionalità Pro',
      'Pensato per team fino a 10 agenti',
      'Gestione multi-utente / multi-agenzia',
    ],
    limits: {
      listingsPerMonth: -1,
      maxUsers: 10,
    },
  },
} as const;

export const STRIPE_ONE_TIME_PACKAGES = {
  boost: {
    id: 'agency_boost',
    name: 'Agency Boost',
    price: 2497,
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID || null,
    tagline: 'Done-for-you setup package',
    features: [
      'Setup completo "done-for-you"',
      'Implementazione e onboarding guidato',
      'Supporto premium per il lancio',
    ],
    deliverables: {
      setupComplete: true,
      onboarding: true,
      premiumSupport: true,
    },
  },
} as const;

export type PlanType = keyof typeof STRIPE_PLANS;
export type SubscriptionStatus = PlanType | 'free';

export function getPlanByPriceId(priceId: string): PlanType | null {
  for (const [planKey, plan] of Object.entries(STRIPE_PLANS)) {
    if (plan.priceId === priceId) {
      return planKey as PlanType;
    }
  }
  return null;
}

export function getPlanFeatures(planType: PlanType): readonly string[] {
  return STRIPE_PLANS[planType]?.features || [];
}

export function getPlanLimits(planType: PlanType) {
  return STRIPE_PLANS[planType]?.limits || { listingsPerMonth: 5 };
}

export function getOneTimePackage(packageId: string) {
  if (packageId === 'boost' || packageId === 'agency_boost') {
    return STRIPE_ONE_TIME_PACKAGES.boost;
  }
  return null;
}

export const HIGH_TICKET_PACKAGES = [
  {
    name: "Agency Boost",
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_BOOST_PRICE_ID,
    type: "one_time",
  },
];
