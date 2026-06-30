/**
 * PropertyPilot AI — Central Plan Management
 * SINGLE SOURCE OF TRUTH for all plan features, limits, and gating.
 *
 * Stripe Plans (DO NOT CHANGE PRICES):
 *   Free    €0      — 5 AI generations
 *   Starter €197/mo — 50 listings, Lead Score, PDF
 *   Pro     €497/mo — 200 listings, CRM, Voice 30/mo, 20 automations
 *   Agency  €897/mo — unlimited, 10 agents, Auto-Prospecting, API
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PlanTier = 'free' | 'starter' | 'pro' | 'agency';

export interface PlanLimits {
  /** AI listing generations per month */
  aiListings: number;
  /** Portal connections allowed */
  portalConnections: number;
  /** Visual AI jobs per month */
  visualAiJobs: number;
  /** Voice Agent minutes per month */
  voiceMinutes: number;
  /** WhatsApp conversations per month */
  whatsappConversations: number;
  /** Emails per month (Resend) */
  emailsPerMonth: number;
  /** CMA reports per month */
  cmaReports: number;
  /** Document AI extractions per month */
  documentExtractions: number;
  /** Automation rules */
  automationRules: number;
  /** Team users */
  teamUsers: number;
  /** Social media connected accounts */
  socialAccounts: number;
}

export interface PlanFeatures {
  // Core
  aiListings: boolean;
  leadScoring: boolean;
  pdfExport: boolean;
  cmaReports: boolean;

  // CRM & Leads
  crmFull: boolean;
  leadPipeline: boolean;
  predictiveLeads: boolean;

  // Communication
  voiceAgent: boolean;
  whatsappAi: boolean;
  emailDrip: boolean;
  socialPublishing: boolean;

  // AI & Visual
  visualAiStaging: boolean;
  visualAiEnhancement: boolean;
  floorPlans: boolean;

  // Automation
  speedToLead: boolean;
  automations: boolean;

  // Compliance & Docs
  complianceShield: boolean;
  documentAi: boolean;

  // Portals
  portalPublishing: boolean;
  allPortals: boolean;

  // Agency / Enterprise
  whiteLabel: boolean;
  customDomain: boolean;
  apiAccess: boolean;
  mcpServer: boolean;
  teamManagement: boolean;
  prospecting: boolean;
  marketplace: boolean;
  mortgageBroker: boolean;
  openHouse: boolean;

  // Branding
  removeBranding: boolean;
  customPdfBranding: boolean;
  customEmailBranding: boolean;
}

export interface PlanDefinition {
  tier: PlanTier;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  limits: PlanLimits;
  features: PlanFeatures;
  supportSla: string;
  badge: string;
}

// ---------------------------------------------------------------------------
// Plan Definitions
// ---------------------------------------------------------------------------

const UNLIMITED = 999999;

export const PLANS: Record<PlanTier, PlanDefinition> = {
  free: {
    tier: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Get started with AI-powered listings',
    limits: {
      aiListings: 5,
      portalConnections: 0,
      visualAiJobs: 2,
      voiceMinutes: 0,
      whatsappConversations: 0,
      emailsPerMonth: 10,
      cmaReports: 1,
      documentExtractions: 3,
      automationRules: 0,
      teamUsers: 1,
      socialAccounts: 0,
    },
    features: {
      aiListings: true,
      leadScoring: false,
      pdfExport: true,
      cmaReports: true,
      crmFull: false,
      leadPipeline: false,
      predictiveLeads: false,
      voiceAgent: false,
      whatsappAi: false,
      emailDrip: false,
      socialPublishing: false,
      visualAiStaging: true,
      visualAiEnhancement: false,
      floorPlans: false,
      speedToLead: false,
      automations: false,
      complianceShield: false,
      documentAi: false,
      portalPublishing: false,
      allPortals: false,
      whiteLabel: false,
      customDomain: false,
      apiAccess: false,
      mcpServer: false,
      teamManagement: false,
      prospecting: false,
      marketplace: true,
      mortgageBroker: false,
      openHouse: false,
      removeBranding: false,
      customPdfBranding: false,
      customEmailBranding: false,
    },
    supportSla: '72h community',
    badge: '🆓',
  },

  starter: {
    tier: 'starter',
    name: 'Starter',
    priceMonthly: 197,
    priceYearly: 1891,
    description: 'For individual agents ready to grow',
    limits: {
      aiListings: 50,
      portalConnections: 1,
      visualAiJobs: 10,
      voiceMinutes: 0,
      whatsappConversations: 50,
      emailsPerMonth: 1000,
      cmaReports: 10,
      documentExtractions: 20,
      automationRules: 3,
      teamUsers: 1,
      socialAccounts: 1,
    },
    features: {
      aiListings: true,
      leadScoring: true,
      pdfExport: true,
      cmaReports: true,
      crmFull: false,
      leadPipeline: false,
      predictiveLeads: false,
      voiceAgent: false,
      whatsappAi: true,
      emailDrip: false,
      socialPublishing: false,
      visualAiStaging: true,
      visualAiEnhancement: true,
      floorPlans: false,
      speedToLead: false,
      automations: true,
      complianceShield: false,
      documentAi: true,
      portalPublishing: true,
      allPortals: false,
      whiteLabel: false,
      customDomain: false,
      apiAccess: false,
      mcpServer: false,
      teamManagement: false,
      prospecting: false,
      marketplace: true,
      mortgageBroker: false,
      openHouse: false,
      removeBranding: false,
      customPdfBranding: false,
      customEmailBranding: false,
    },
    supportSla: '48h email',
    badge: '⭐',
  },

  pro: {
    tier: 'pro',
    name: 'Pro',
    priceMonthly: 497,
    priceYearly: 4762,
    description: 'Full AI power for serious professionals',
    limits: {
      aiListings: 200,
      portalConnections: 16,
      visualAiJobs: 50,
      voiceMinutes: 300,
      whatsappConversations: 500,
      emailsPerMonth: 5000,
      cmaReports: 100,
      documentExtractions: 100,
      automationRules: 20,
      teamUsers: 5,
      socialAccounts: 3,
    },
    features: {
      aiListings: true,
      leadScoring: true,
      pdfExport: true,
      cmaReports: true,
      crmFull: true,
      leadPipeline: true,
      predictiveLeads: true,
      voiceAgent: true,
      whatsappAi: true,
      emailDrip: true,
      socialPublishing: true,
      visualAiStaging: true,
      visualAiEnhancement: true,
      floorPlans: true,
      speedToLead: true,
      automations: true,
      complianceShield: true,
      documentAi: true,
      portalPublishing: true,
      allPortals: true,
      whiteLabel: false,
      customDomain: false,
      apiAccess: false,
      mcpServer: false,
      teamManagement: false,
      prospecting: true,
      marketplace: true,
      mortgageBroker: true,
      openHouse: true,
      removeBranding: false,
      customPdfBranding: true,
      customEmailBranding: false,
    },
    supportSla: '24h priority',
    badge: '💎',
  },

  agency: {
    tier: 'agency',
    name: 'Agency',
    priceMonthly: 897,
    priceYearly: 8602,
    description: 'Enterprise-grade for teams and agencies',
    limits: {
      aiListings: UNLIMITED,
      portalConnections: UNLIMITED,
      visualAiJobs: 500,
      voiceMinutes: 1500,
      whatsappConversations: 10000,
      emailsPerMonth: UNLIMITED,
      cmaReports: UNLIMITED,
      documentExtractions: UNLIMITED,
      automationRules: UNLIMITED,
      teamUsers: 25,
      socialAccounts: 10,
    },
    features: {
      aiListings: true,
      leadScoring: true,
      pdfExport: true,
      cmaReports: true,
      crmFull: true,
      leadPipeline: true,
      predictiveLeads: true,
      voiceAgent: true,
      whatsappAi: true,
      emailDrip: true,
      socialPublishing: true,
      visualAiStaging: true,
      visualAiEnhancement: true,
      floorPlans: true,
      speedToLead: true,
      automations: true,
      complianceShield: true,
      documentAi: true,
      portalPublishing: true,
      allPortals: true,
      whiteLabel: true,
      customDomain: true,
      apiAccess: true,
      mcpServer: true,
      teamManagement: true,
      prospecting: true,
      marketplace: true,
      mortgageBroker: true,
      openHouse: true,
      removeBranding: true,
      customPdfBranding: true,
      customEmailBranding: true,
    },
    supportSla: '4h dedicated',
    badge: '👑',
  },
};

// ---------------------------------------------------------------------------
// Access Helpers
// ---------------------------------------------------------------------------

/** Get plan definition by tier */
export function getPlan(tier: PlanTier): PlanDefinition {
  return PLANS[tier] ?? PLANS.free;
}

/** Check if a specific feature is available on a plan */
export function hasFeature(tier: PlanTier, feature: keyof PlanFeatures): boolean {
  return getPlan(tier).features[feature] ?? false;
}

/** Get the usage limit for a specific resource on a plan */
export function getLimit(tier: PlanTier, resource: keyof PlanLimits): number {
  return getPlan(tier).limits[resource] ?? 0;
}

/** Check if usage is within limits. Returns true if allowed. */
export function isWithinLimit(
  tier: PlanTier,
  resource: keyof PlanLimits,
  currentUsage: number
): boolean {
  const limit = getLimit(tier, resource);
  if (limit >= UNLIMITED) return true;
  return currentUsage < limit;
}

/** Get usage percentage (0-100). Returns 0 for unlimited. */
export function getUsagePercent(
  tier: PlanTier,
  resource: keyof PlanLimits,
  currentUsage: number
): number {
  const limit = getLimit(tier, resource);
  if (limit >= UNLIMITED) return 0;
  if (limit === 0) return currentUsage > 0 ? 100 : 0;
  return Math.min(100, Math.round((currentUsage / limit) * 100));
}

/** Check if user is approaching limit (>= 80%) */
export function isApproachingLimit(
  tier: PlanTier,
  resource: keyof PlanLimits,
  currentUsage: number
): boolean {
  const percent = getUsagePercent(tier, resource, currentUsage);
  return percent >= 80 && percent < 100;
}

/** Get the minimum plan tier needed for a feature */
export function getMinimumPlanForFeature(feature: keyof PlanFeatures): PlanTier {
  const tiers: PlanTier[] = ['free', 'starter', 'pro', 'agency'];
  for (const tier of tiers) {
    if (hasFeature(tier, feature)) return tier;
  }
  return 'agency';
}

/** Get all features that would be unlocked by upgrading from current to target plan */
export function getUpgradeFeatures(
  currentTier: PlanTier,
  targetTier: PlanTier
): (keyof PlanFeatures)[] {
  const current = getPlan(currentTier).features;
  const target = getPlan(targetTier).features;
  const unlocked: (keyof PlanFeatures)[] = [];

  for (const key of Object.keys(target) as (keyof PlanFeatures)[]) {
    if (!current[key] && target[key]) {
      unlocked.push(key);
    }
  }

  return unlocked;
}

/** Format limit for display (handles unlimited) */
export function formatLimit(limit: number): string {
  if (limit >= UNLIMITED) return '∞';
  return limit.toLocaleString();
}

/** Determine plan tier from Stripe price ID */
export function getPlanFromPriceId(priceId: string | null | undefined): PlanTier {
  if (!priceId) return 'free';

  const starterPrices = [
    process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID,
  ].filter(Boolean);

  const proPrices = [
    process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
  ].filter(Boolean);

  const agencyPrices = [
    process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID,
    process.env.NEXT_PUBLIC_STRIPE_AGENCY_YEARLY_PRICE_ID,
  ].filter(Boolean);

  if (agencyPrices.includes(priceId)) return 'agency';
  if (proPrices.includes(priceId)) return 'pro';
  if (starterPrices.includes(priceId)) return 'starter';
  return 'free';
}

// ---------------------------------------------------------------------------
// Feature Display Names (for UI — use i18n keys in production)
// ---------------------------------------------------------------------------

export const FEATURE_DISPLAY_NAMES: Record<keyof PlanFeatures, string> = {
  aiListings: 'AI Listing Generation',
  leadScoring: 'Lead Scoring AI',
  pdfExport: 'PDF Export',
  cmaReports: 'CMA Reports',
  crmFull: 'Full CRM',
  leadPipeline: 'Lead Pipeline',
  predictiveLeads: 'Predictive Leads',
  voiceAgent: 'Voice Agent AI',
  whatsappAi: 'WhatsApp AI',
  emailDrip: 'Email Drip Campaigns',
  socialPublishing: 'Social Publishing',
  visualAiStaging: 'Virtual Staging',
  visualAiEnhancement: 'Photo Enhancement',
  floorPlans: 'AI Floor Plans',
  speedToLead: 'Speed-to-Lead',
  automations: 'Automations',
  complianceShield: 'Compliance Shield',
  documentAi: 'Document AI',
  portalPublishing: 'Portal Publishing',
  allPortals: 'All 16 Portals',
  whiteLabel: 'White-Label Portal',
  customDomain: 'Custom Domain',
  apiAccess: 'REST API',
  mcpServer: 'MCP Server',
  teamManagement: 'Team Management',
  prospecting: 'Market Prospecting',
  marketplace: 'Marketplace',
  mortgageBroker: 'Mortgage Broker',
  openHouse: 'Open House',
  removeBranding: 'Remove Branding',
  customPdfBranding: 'Custom PDF Branding',
  customEmailBranding: 'Custom Email Branding',
};

export const LIMIT_DISPLAY_NAMES: Record<keyof PlanLimits, string> = {
  aiListings: 'AI Listings',
  portalConnections: 'Portal Connections',
  visualAiJobs: 'Visual AI Jobs',
  voiceMinutes: 'Voice Minutes',
  whatsappConversations: 'WhatsApp Conversations',
  emailsPerMonth: 'Emails',
  cmaReports: 'CMA Reports',
  documentExtractions: 'Document Extractions',
  automationRules: 'Automation Rules',
  teamUsers: 'Team Users',
  socialAccounts: 'Social Accounts',
};
