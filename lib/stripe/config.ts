import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function requireStripe(): Stripe {
  if (typeof window !== 'undefined') {
    throw new Error('Stripe can only be initialized on the server');
  }
  
  if (!stripeInstance) {
    const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.TESTING_STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY or TESTING_STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
    });
  }
  return stripeInstance;
}

export const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    price: 197,
    yearlyPrice: 1891,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || null,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID || 'price_1TSGiwA1is7KNmaeuwZyZCrj',
    tagline: 'AI Listing Engine + 1 Portal + 6 Languages',
    features: [
      '50 properties managed',
      '200 AI descriptions/month (6 languages)',
      'Portal-optimized output (1 portal seat)',
      'AI Listing Engine (Luxury, Investment, Standard, Emotional)',
      'Lead Score Base AI',
      'PDF exports (watermark-free)',
      '60 voice AI minutes/month',
      'Multi-language (IT, EN, FR, ES, DE, PT)',
      'Email support',
    ],
    limits: {
      listingsPerMonth: 50,
      aiDescriptions: 200,
      voiceMinutes: 60,
      portalSeats: 1,
    },
  },
  pro: {
    name: 'Pro',
    price: 497,
    yearlyPrice: 4762,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || null,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || 'price_1TSGiyA1is7KNmaeloBvSJTW',
    tagline: 'CRM + Voice AI + 3 Portals + AVM + Virtual Staging',
    features: [
      '500 properties managed',
      'Unlimited AI descriptions',
      '3 portal seats (publish to 3 portals)',
      'Full CRM + Kanban Pipeline',
      'AI Voice Agent (300 min/month)',
      'AI WhatsApp Business agent',
      'Virtual Staging 3D (50/month)',
      'AVM Valuation + Branded CMA PDF',
      'Automations (20/month)',
      'Document Intelligence',
      'MCP read access (Claude/ChatGPT)',
      'Priority email + chat support',
    ],
    limits: {
      listingsPerMonth: 200,
      aiDescriptions: -1,
      voiceMinutes: 300,
      portalSeats: 3,
      virtualStaging: 50,
      automations: 20,
    },
  },
  agency: {
    name: 'Agency',
    price: 897,
    yearlyPrice: 8602,
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || null,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_YEARLY_PRICE_ID || 'price_1TSGj1A1is7KNmaeg9Uf6I0U',
    tagline: 'Unlimited Everything + ALL Portals + 10 Users + API',
    features: [
      'Unlimited properties',
      'Unlimited AI descriptions',
      'ALL portal connections',
      'Team up to 10 agents + RBAC',
      'AI Voice Agent (1,500 min + voice cloning)',
      'AI WhatsApp Business (unlimited)',
      'Virtual Staging unlimited',
      'Predictive Seller Leads AI',
      'Cross-border buyer matching',
      'White-label client portal',
      'MCP server + API/webhook access',
      'Auto-Prospecting 24/7',
      'Calendar Sync (Google/Cal.com)',
      'Dedicated CSM',
    ],
    limits: {
      listingsPerMonth: -1,
      aiDescriptions: -1,
      voiceMinutes: 1500,
      portalSeats: -1,
      maxUsers: 10,
      virtualStaging: -1,
      automations: -1,
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
