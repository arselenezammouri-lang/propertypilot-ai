/**
 * Lead Scoring v2 — Behavioral + engagement signals, ML-ready feature vector
 * Upgrades from v1 (AI-only) to hybrid: deterministic signals + AI enrichment
 */

export interface LeadSignals {
  // Contact signals
  source: "portal" | "website" | "referral" | "whatsapp" | "voice" | "manual";
  first_contact_at: string;
  last_activity_at: string;
  response_time_seconds?: number;

  // Engagement signals
  messages_sent: number;
  messages_received: number;
  viewings_booked: number;
  viewings_attended: number;
  documents_requested: number;
  listings_viewed: number;
  time_on_site_seconds: number;
  pages_visited: number;

  // Profile signals
  has_mortgage_preapproval: boolean;
  budget_declared: boolean;
  budget_range?: { min: number; max: number };
  timeline: "immediate" | "1_month" | "3_months" | "6_months" | "exploring";
  is_investor: boolean;
  is_first_time_buyer: boolean;

  // Behavioral signals
  opened_last_email: boolean;
  clicked_email_link: boolean;
  visited_pricing_page: boolean;
  downloaded_brochure: boolean;
  requested_callback: boolean;
  left_voicemail: boolean;
}

export interface LeadScoreV2Result {
  score: number;
  category: "hot" | "warm" | "cold";
  confidence: number;
  breakdown: ScoreBreakdown;
  recommended_action: string;
  speed_to_lead_trigger: SpeedToLeadAction | null;
  feature_vector: number[];
}

export interface ScoreBreakdown {
  engagement: number;
  recency: number;
  intent: number;
  profile: number;
  behavioral: number;
}

export type SpeedToLeadAction = "auto_call" | "whatsapp" | "email" | "none";

// ─── Scoring Weights ────────────────────────────────────────
const WEIGHTS = {
  engagement: 0.30,
  recency: 0.25,
  intent: 0.20,
  profile: 0.15,
  behavioral: 0.10,
};

// ─── Scoring Functions ──────────────────────────────────────
function scoreEngagement(signals: LeadSignals): number {
  let score = 0;

  // Messages (up to 25pts)
  score += Math.min(signals.messages_sent * 3, 15);
  score += Math.min(signals.messages_received * 2, 10);

  // Viewings (up to 35pts)
  score += signals.viewings_booked * 10;
  score += signals.viewings_attended * 15;

  // Content engagement (up to 20pts)
  score += Math.min(signals.listings_viewed * 2, 10);
  score += Math.min(signals.time_on_site_seconds / 60, 10);

  // Documents (up to 20pts)
  score += signals.documents_requested * 10;

  return Math.min(score, 100);
}

function scoreRecency(signals: LeadSignals): number {
  const lastActivity = new Date(signals.last_activity_at);
  const hoursAgo = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);

  if (hoursAgo < 1) return 100;
  if (hoursAgo < 4) return 90;
  if (hoursAgo < 12) return 80;
  if (hoursAgo < 24) return 70;
  if (hoursAgo < 48) return 50;
  if (hoursAgo < 72) return 35;
  if (hoursAgo < 168) return 20;
  return 5;
}

function scoreIntent(signals: LeadSignals): number {
  let score = 0;

  // Timeline is strongest intent signal
  const timelineScores: Record<string, number> = {
    immediate: 40,
    "1_month": 30,
    "3_months": 20,
    "6_months": 10,
    exploring: 5,
  };
  score += timelineScores[signals.timeline] ?? 5;

  // Financial readiness
  if (signals.has_mortgage_preapproval) score += 25;
  if (signals.budget_declared) score += 15;

  // Active engagement signals
  if (signals.viewings_attended > 0) score += 15;
  if (signals.documents_requested > 0) score += 10;

  return Math.min(score, 100);
}

function scoreProfile(signals: LeadSignals): number {
  let score = 30; // baseline

  // Source quality
  const sourceScores: Record<string, number> = {
    referral: 25,
    website: 20,
    portal: 15,
    whatsapp: 20,
    voice: 20,
    manual: 10,
  };
  score += sourceScores[signals.source] ?? 10;

  // Buyer type
  if (signals.is_investor) score += 20;
  if (signals.is_first_time_buyer) score += 10;

  // Response time (faster = higher score)
  if (signals.response_time_seconds != null) {
    if (signals.response_time_seconds < 300) score += 20;
    else if (signals.response_time_seconds < 3600) score += 10;
  }

  return Math.min(score, 100);
}

function scoreBehavioral(signals: LeadSignals): number {
  let score = 0;

  if (signals.opened_last_email) score += 15;
  if (signals.clicked_email_link) score += 20;
  if (signals.visited_pricing_page) score += 15;
  if (signals.downloaded_brochure) score += 20;
  if (signals.requested_callback) score += 25;
  if (signals.left_voicemail) score += 10;

  return Math.min(score, 100);
}

// ─── ML Feature Vector ─────────────────────────────────────
function buildFeatureVector(signals: LeadSignals): number[] {
  const hoursAgo = (Date.now() - new Date(signals.last_activity_at).getTime()) / (1000 * 60 * 60);
  return [
    signals.messages_sent,
    signals.messages_received,
    signals.viewings_booked,
    signals.viewings_attended,
    signals.documents_requested,
    signals.listings_viewed,
    signals.time_on_site_seconds / 60,
    signals.pages_visited,
    signals.has_mortgage_preapproval ? 1 : 0,
    signals.budget_declared ? 1 : 0,
    signals.is_investor ? 1 : 0,
    signals.is_first_time_buyer ? 1 : 0,
    hoursAgo,
    signals.response_time_seconds ?? -1,
    signals.opened_last_email ? 1 : 0,
    signals.clicked_email_link ? 1 : 0,
    signals.requested_callback ? 1 : 0,
  ];
}

// ─── Main Scoring Function ──────────────────────────────────
export function calculateLeadScoreV2(signals: LeadSignals): LeadScoreV2Result {
  const breakdown: ScoreBreakdown = {
    engagement: scoreEngagement(signals),
    recency: scoreRecency(signals),
    intent: scoreIntent(signals),
    profile: scoreProfile(signals),
    behavioral: scoreBehavioral(signals),
  };

  const score = Math.round(
    breakdown.engagement * WEIGHTS.engagement +
    breakdown.recency * WEIGHTS.recency +
    breakdown.intent * WEIGHTS.intent +
    breakdown.profile * WEIGHTS.profile +
    breakdown.behavioral * WEIGHTS.behavioral
  );

  const category = score >= 80 ? "hot" : score >= 50 ? "warm" : "cold";

  // Confidence based on data completeness
  const dataPoints = [
    signals.messages_sent > 0,
    signals.last_activity_at !== "",
    signals.budget_declared,
    signals.viewings_booked > 0,
    signals.response_time_seconds != null,
  ].filter(Boolean).length;
  const confidence = Math.min(0.5 + dataPoints * 0.1, 1.0);

  // Speed-to-lead triggers
  let speedToLeadTrigger: SpeedToLeadAction | null = null;
  let recommendedAction = "Monitor";

  if (score >= 90) {
    speedToLeadTrigger = "auto_call";
    recommendedAction = "🔥 Auto-call immediately — hot lead with high buying intent";
  } else if (score >= 80) {
    speedToLeadTrigger = "whatsapp";
    recommendedAction = "📱 Send WhatsApp message with personalized property matches";
  } else if (score >= 60) {
    speedToLeadTrigger = "email";
    recommendedAction = "📧 Send targeted email with relevant listings";
  } else if (score >= 40) {
    recommendedAction = "Add to nurture sequence — not ready yet";
  } else {
    recommendedAction = "Low priority — add to re-engagement drip campaign";
  }

  return {
    score,
    category,
    confidence,
    breakdown,
    recommended_action: recommendedAction,
    speed_to_lead_trigger: speedToLeadTrigger,
    feature_vector: buildFeatureVector(signals),
  };
}
