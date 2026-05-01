/**
 * Fast Lead Scoring — Rule-based pre-scoring for portal leads
 * Runs instantly without AI API calls. Used for:
 * 1. Initial score when a lead arrives via portal polling
 * 2. Sorting/prioritization in the leads list
 * 3. Fallback when AI scoring is unavailable
 *
 * The AI-powered leadScoring.ts provides deeper analysis when requested.
 * This module provides instant 0-100 scores based on rules.
 */

export interface FastLeadScore {
  score: number;           // 0-100
  category: "hot" | "warm" | "cold";
  factors: FastScoreFactor[];
  badge: string;           // "🔥 Hot" | "⭐ Warm" | "❄️ Cold"
}

interface FastScoreFactor {
  name: string;
  points: number;
  maxPoints: number;
  reason: string;
}

/* ─── Portal Source Scores ─── */

const PORTAL_SOURCE_SCORES: Record<string, number> = {
  "portal:immobiliare_it": 30,
  "portal:idealista": 28,
  "portal:seloger": 28,
  "portal:immoscout24": 32,
  "portal:rightmove": 30,
  "portal:zoopla": 26,
  "portal:casa_it": 24,
  "portal:immowelt": 26,
  "portal:leboncoin": 20,
  "portal:fotocasa": 22,
  "portal:idealista_pt": 24,
  "website": 15,
  "referral": 35,
  "direct": 10,
  "social": 8,
};

/* ─── Scoring Rules ─── */

export function scoreLead(lead: {
  source: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  createdAt: string;
  propertyPrice?: number;
  responseTimeMinutes?: number;
  pageViews?: number;
  returnVisits?: number;
}): FastLeadScore {
  const factors: FastScoreFactor[] = [];
  let total = 0;

  // 1. Source quality (0-35 points)
  const sourceScore = PORTAL_SOURCE_SCORES[lead.source] || 10;
  factors.push({
    name: "Source Quality",
    points: sourceScore,
    maxPoints: 35,
    reason: `Lead from ${lead.source.replace("portal:", "")}`,
  });
  total += sourceScore;

  // 2. Contact completeness (0-15 points)
  let contactPoints = 0;
  if (lead.email) contactPoints += 5;
  if (lead.phone) contactPoints += 10; // Phone = higher intent
  factors.push({
    name: "Contact Info",
    points: contactPoints,
    maxPoints: 15,
    reason: contactPoints === 15 ? "Email + phone provided" : contactPoints === 10 ? "Phone provided" : contactPoints === 5 ? "Email only" : "No contact info",
  });
  total += contactPoints;

  // 3. Message quality (0-20 points)
  let messagePoints = 0;
  if (lead.message) {
    const msgLen = lead.message.length;
    if (msgLen > 200) messagePoints = 20;
    else if (msgLen > 100) messagePoints = 15;
    else if (msgLen > 30) messagePoints = 10;
    else messagePoints = 5;

    // Bonus for specific intent signals
    const intentWords = ["budget", "prezzo", "visita", "viewing", "visite", "besichtigung", "achat", "comprar", "kaufen", "mortgage", "mutuo", "hypothèque"];
    const hasIntent = intentWords.some((w) => lead.message!.toLowerCase().includes(w));
    if (hasIntent) messagePoints = Math.min(20, messagePoints + 5);
  }
  factors.push({
    name: "Message Quality",
    points: messagePoints,
    maxPoints: 20,
    reason: messagePoints >= 15 ? "Detailed message with intent signals" : messagePoints >= 10 ? "Good message" : messagePoints > 0 ? "Short message" : "No message",
  });
  total += messagePoints;

  // 4. Response freshness (0-15 points)
  const ageMinutes = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60);
  let freshnessPoints = 0;
  if (ageMinutes < 15) freshnessPoints = 15;
  else if (ageMinutes < 60) freshnessPoints = 12;
  else if (ageMinutes < 240) freshnessPoints = 8;
  else if (ageMinutes < 1440) freshnessPoints = 4;
  else freshnessPoints = 1;
  factors.push({
    name: "Freshness",
    points: freshnessPoints,
    maxPoints: 15,
    reason: freshnessPoints >= 12 ? "Very fresh lead" : freshnessPoints >= 8 ? "Recent lead" : "Older lead",
  });
  total += freshnessPoints;

  // 5. Engagement signals (0-15 points)
  let engagementPoints = 0;
  if (lead.pageViews && lead.pageViews >= 5) engagementPoints += 5;
  else if (lead.pageViews && lead.pageViews >= 2) engagementPoints += 3;
  if (lead.returnVisits && lead.returnVisits >= 3) engagementPoints += 10;
  else if (lead.returnVisits && lead.returnVisits >= 1) engagementPoints += 5;
  engagementPoints = Math.min(15, engagementPoints);
  factors.push({
    name: "Engagement",
    points: engagementPoints,
    maxPoints: 15,
    reason: engagementPoints >= 10 ? "High engagement (return visitor)" : engagementPoints > 0 ? "Some engagement" : "First touch",
  });
  total += engagementPoints;

  // Cap at 100
  const score = Math.min(100, total);

  // Categorize
  let category: "hot" | "warm" | "cold";
  let badge: string;
  if (score >= 70) { category = "hot"; badge = "🔥 Hot Lead"; }
  else if (score >= 40) { category = "warm"; badge = "⭐ Warm Lead"; }
  else { category = "cold"; badge = "❄️ Cold Lead"; }

  return { score, category, factors, badge };
}

/**
 * Score a batch of leads (used by portal polling cron)
 */
export function scoreLeadBatch(leads: Array<{
  id: string;
  source: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  createdAt: string;
}>): Array<{ id: string; score: number; category: string }> {
  return leads.map((lead) => {
    const result = scoreLead(lead);
    return { id: lead.id, score: result.score, category: result.category };
  });
}
