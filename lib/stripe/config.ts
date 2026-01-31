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
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || null,
    tagline: 'AI Listing Engine + Lead Score Base',
    features: [
      'AI Listing Engine completo',
      'Lead Score Base AI',
      'Generazione Annunci AI professionale',
      'Stili AI (Luxury, Investment, Pro)',
      'Multi-lingua (IT, EN, ES)',
      'PDF Professionali',
    ],
    limits: {
      listingsPerMonth: 50,
    },
  },
  pro: {
    name: 'Pro',
    price: 497,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || null,
    tagline: 'Smart Briefing Multi-Categoria + Virtual Staging 3D + CRM',
    features: [
      'Tutte le funzionalità Starter',
      'Smart Briefing Multi-Categoria avanzato',
      'Virtual Staging 3D professionale',
      'CRM Completo e Pipeline Kanban',
      'Lead Scoring AI avanzato',
      'Follow-up AI Multi-canale',
      'Automazioni AI (20/mese)',
      'Smart Lead Capture Forms',
      'White-label PDF',
      'Agency Assistant AI',
      'AI Voice Calling (30 chiamate/mese)',
      'Aura VR: Visualizzatore Tour (Solo visualizzazione)',
      'Libertà d\'intervento umano sempre disponibile',
    ],
    limits: {
      listingsPerMonth: 200,
      voiceAgentCalls: 30,
    },
  },
  agency: {
    name: 'Agency',
    price: 897,
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || null,
    tagline: 'Omnichannel Domination Suite - Voice AI Illimitato + Smart Messaging + Multi-utente',
    features: [
      'Tutte le funzionalità Pro',
      'Aura VR: Cinematic Virtual Tour Generation (Illimitati)',
      'Omnichannel Domination Suite',
      'AI Voice Calling Illimitato (chiamate automatiche 24/7)',
      'AI Smart Messaging (SMS/WhatsApp generati dall\'AI)',
      'Manual Override: Accesso diretto ai dati proprietario per chiamate umane',
      'Google Calendar Sync automatico per appuntamenti',
      'Auto-Prospecting 24/7 attivo',
      'Team fino a 10 agenti inclusi',
      'Gestione multi-utente / multi-agenzia',
      'Ruoli e Permessi avanzati',
      'Distribuzione Lead Automatica',
      'Report Attività Team',
      'Integrazione Multi-sede',
      'Dashboard War Room',
      'Supporto Dedicato 24/7',
      'Libertà d\'intervento umano sempre disponibile',
    ],
    limits: {
      listingsPerMonth: -1,
      maxUsers: 10,
      voiceAgentCalls: -1, // Illimitato
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
