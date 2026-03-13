/**
 * Single source of truth for feature access by plan.
 * Used by Super-Guardian audit and by UI/API to show locks and enforce limits.
 */

export type PlanType = 'free' | 'starter' | 'pro' | 'agency';

/** Voice AI: Pro has 30 calls/month, Agency unlimited */
export const VOICE_CALLS_LIMIT_PRO = 30;
export const VOICE_CALLS_LIMIT_AGENCY = null; // unlimited

export interface FeatureAccess {
  /** Predator Map / Territory Map - Agency only */
  map: boolean;
  /** CRM (Leads, pipeline, automations) - Pro + Agency */
  crm: boolean;
  /** Voice AI calling - Pro (30/mo) + Agency (unlimited) */
  voiceAi: boolean;
  /** Voice calls allowed per month (null = unlimited) */
  voiceCallsLimit: number | null;
  /** Aura VR / Virtual Tour - Agency only */
  auraVr: boolean;
  /** Prospecting War Room (listings, filters, etc.) - Pro + Agency */
  prospecting: boolean;
  /** Lead Scoring AI - Pro + Agency */
  leadScoring: boolean;
  /** 3D Virtual Staging - Pro + Agency */
  virtualStaging: boolean;
  /** Agency Assistant - Pro + Agency */
  agencyAssistant: boolean;
  /** Automations - Pro + Agency */
  automations: boolean;
  /** Billing / Diamond badge clickable - all paid */
  billingClickable: boolean;
}

export function getFeatureAccess(plan: PlanType): FeatureAccess {
  const now = new Date();
  switch (plan) {
    case 'free':
      return {
        map: false,
        crm: false,
        voiceAi: false,
        voiceCallsLimit: 0,
        auraVr: false,
        prospecting: false,
        leadScoring: false,
        virtualStaging: false,
        agencyAssistant: false,
        automations: false,
        billingClickable: true,
      };
    case 'starter':
      return {
        map: false,
        crm: false,
        voiceAi: false,
        voiceCallsLimit: 0,
        auraVr: false,
        prospecting: false,
        leadScoring: true,
        virtualStaging: false,
        agencyAssistant: false,
        automations: false,
        billingClickable: true,
      };
    case 'pro':
      return {
        map: false,
        crm: true,
        voiceAi: true,
        voiceCallsLimit: VOICE_CALLS_LIMIT_PRO,
        auraVr: false,
        prospecting: true,
        leadScoring: true,
        virtualStaging: true,
        agencyAssistant: true,
        automations: true,
        billingClickable: true,
      };
    case 'agency':
      return {
        map: true,
        crm: true,
        voiceAi: true,
        voiceCallsLimit: VOICE_CALLS_LIMIT_AGENCY,
        auraVr: true,
        prospecting: true,
        leadScoring: true,
        virtualStaging: true,
        agencyAssistant: true,
        automations: true,
        billingClickable: true,
      };
    default:
      return getFeatureAccess('free');
  }
}

/** Returns true if the plan has access to the Predator Map (Agency only). */
export function canAccessMap(plan: PlanType): boolean {
  return getFeatureAccess(plan).map;
}

/** Returns true if the plan has access to CRM (Pro + Agency). */
export function canAccessCrm(plan: PlanType): boolean {
  return getFeatureAccess(plan).crm;
}

/** Returns voice calls limit for the plan (null = unlimited). */
export function getVoiceCallsLimit(plan: PlanType): number | null {
  return getFeatureAccess(plan).voiceCallsLimit;
}
