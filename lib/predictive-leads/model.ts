/**
 * Predictive Seller Leads — ML model placeholder + feature store
 * Identifies homeowners likely to list their property (likely-to-list)
 */

export interface PredictiveLeadFeatures {
  // Property signals
  years_owned: number;
  last_renovation_years_ago: number | null;
  property_value_estimate: number;
  value_change_percent_1y: number;
  neighborhood_avg_days_on_market: number;
  neighborhood_price_trend: "rising" | "stable" | "declining";

  // Life event signals
  recently_married: boolean;
  recently_divorced: boolean;
  new_child: boolean;
  job_change: boolean;
  retirement: boolean;

  // Market signals
  interest_rate_trend: "rising" | "stable" | "declining";
  local_inventory_level: "low" | "medium" | "high";
  season: "spring" | "summer" | "autumn" | "winter";

  // Digital signals
  home_valuation_searches: number;
  agent_contact_searches: number;
  moving_service_searches: number;
  renovation_permit_searches: number;
}

export interface PredictiveLeadScore {
  id: string;
  property_address: string;
  city: string;
  country: string;
  owner_name: string | null;
  probability: number; // 0-1
  confidence: number;
  category: "very_likely" | "likely" | "possible" | "unlikely";
  key_signals: string[];
  recommended_approach: string;
  feature_vector: number[];
  data_source: string;
  created_at: string;
}

/**
 * Simple heuristic model (placeholder for real ML)
 * In production: XGBoost/LightGBM trained on historical listing data
 */
export function predictLikelihoodToList(features: PredictiveLeadFeatures): {
  probability: number;
  confidence: number;
  key_signals: string[];
  recommended_approach: string;
} {
  let score = 0;
  const signals: string[] = [];

  // Ownership duration (peak selling at 5-10 years)
  if (features.years_owned >= 5 && features.years_owned <= 10) {
    score += 20;
    signals.push(`Owned ${features.years_owned} years — peak selling window`);
  } else if (features.years_owned > 10) {
    score += 10;
    signals.push("Long-term owner — may consider downsizing");
  }

  // Market conditions
  if (features.neighborhood_price_trend === "rising") {
    score += 15;
    signals.push("Neighborhood prices rising — good selling conditions");
  }
  if (features.local_inventory_level === "low") {
    score += 10;
    signals.push("Low local inventory — seller's market");
  }

  // Life events (strongest signals)
  if (features.recently_divorced) {
    score += 25;
    signals.push("Recent divorce — high likelihood of property change");
  }
  if (features.new_child) {
    score += 15;
    signals.push("New child — may need larger property");
  }
  if (features.retirement) {
    score += 20;
    signals.push("Approaching retirement — downsizing likely");
  }
  if (features.job_change) {
    score += 10;
    signals.push("Job change — potential relocation");
  }

  // Digital signals
  if (features.home_valuation_searches > 0) {
    score += 15;
    signals.push(`${features.home_valuation_searches} home valuation searches`);
  }
  if (features.agent_contact_searches > 0) {
    score += 20;
    signals.push(`${features.agent_contact_searches} agent contact searches`);
  }
  if (features.moving_service_searches > 0) {
    score += 10;
    signals.push("Moving service research detected");
  }

  // Value appreciation
  if (features.value_change_percent_1y > 10) {
    score += 10;
    signals.push(`Property value up ${features.value_change_percent_1y}% — profit motivation`);
  }

  // Interest rates
  if (features.interest_rate_trend === "rising") {
    score += 5;
    signals.push("Rising rates — urgency to sell before buyer pool shrinks");
  }

  // Normalize to 0-1
  const probability = Math.min(score / 100, 1);

  // Confidence based on data completeness
  const dataPoints = [
    features.years_owned > 0,
    features.neighborhood_price_trend !== "stable",
    features.home_valuation_searches > 0 || features.agent_contact_searches > 0,
    features.recently_divorced || features.new_child || features.retirement || features.job_change,
  ].filter(Boolean).length;
  const confidence = Math.min(0.3 + dataPoints * 0.175, 1);

  // Category
  let category: "very_likely" | "likely" | "possible" | "unlikely";
  if (probability >= 0.75) category = "very_likely";
  else if (probability >= 0.5) category = "likely";
  else if (probability >= 0.25) category = "possible";
  else category = "unlikely";

  // Recommended approach
  let approach = "Add to nurture list";
  if (probability >= 0.75) approach = "Direct outreach — call or in-person visit within 48 hours";
  else if (probability >= 0.5) approach = "Personalized letter + free home valuation offer";
  else if (probability >= 0.25) approach = "Add to monthly market report mailing list";

  return { probability, confidence, key_signals: signals, recommended_approach: approach };
}

/**
 * Build feature vector for ML model training
 */
export function buildPredictiveFeatureVector(features: PredictiveLeadFeatures): number[] {
  return [
    features.years_owned,
    features.last_renovation_years_ago ?? -1,
    features.property_value_estimate,
    features.value_change_percent_1y,
    features.neighborhood_avg_days_on_market,
    features.neighborhood_price_trend === "rising" ? 1 : features.neighborhood_price_trend === "declining" ? -1 : 0,
    features.recently_married ? 1 : 0,
    features.recently_divorced ? 1 : 0,
    features.new_child ? 1 : 0,
    features.job_change ? 1 : 0,
    features.retirement ? 1 : 0,
    features.interest_rate_trend === "rising" ? 1 : features.interest_rate_trend === "declining" ? -1 : 0,
    features.local_inventory_level === "low" ? 1 : features.local_inventory_level === "high" ? -1 : 0,
    features.home_valuation_searches,
    features.agent_contact_searches,
    features.moving_service_searches,
    features.renovation_permit_searches,
  ];
}
