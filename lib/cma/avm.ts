/**
 * AVM — Automated Valuation Model
 * Rule-based price estimation using comparable analysis.
 *
 * Methodology:
 * 1. Gather comparable properties (same type, zone, similar size)
 * 2. Calculate zone median price/sqm
 * 3. Apply adjustments per comparable (condition, age, features)
 * 4. Weight by similarity score
 * 5. Calculate confidence based on data quality
 *
 * Future: Replace with XGBoost model trained on transaction data.
 * Note in CLAUDE.md: when we have 10k+ transactions, train ML model.
 */

import type { CMAProperty, Comparable, ValuationResult } from "./types";

/* ─── Condition Adjustments ─── */

const CONDITION_MULTIPLIER: Record<string, number> = {
  new: 1.15,
  excellent: 1.08,
  good: 1.00,
  fair: 0.92,
  needs_renovation: 0.80,
};

/* ─── Feature Premiums ─── */

const FEATURE_PREMIUMS: Record<string, number> = {
  "sea view": 0.20, "vista mare": 0.20, "vue mer": 0.20,
  "lake view": 0.15, "vista lago": 0.15,
  "mountain view": 0.10, "vista montagna": 0.10,
  "terrace": 0.05, "terrazzo": 0.05, "terrasse": 0.05,
  "garden": 0.08, "giardino": 0.08, "jardin": 0.08,
  "parking": 0.03, "garage": 0.05, "box auto": 0.05,
  "pool": 0.10, "piscina": 0.10, "piscine": 0.10,
  "elevator": 0.02, "ascensore": 0.02, "ascenseur": 0.02,
  "balcony": 0.03, "balcone": 0.03, "balcon": 0.03,
  "renovated": 0.07, "ristrutturato": 0.07, "rénové": 0.07,
};

/**
 * Run the AVM on a property using its comparables
 */
export function calculateValuation(
  property: CMAProperty,
  comparables: Comparable[]
): ValuationResult {
  if (comparables.length === 0) {
    return {
      estimated_value: 0,
      confidence_low: 0,
      confidence_high: 0,
      confidence_score: 0,
      price_per_sqm: 0,
      methodology: "Insufficient data — no comparables found",
      comparables_used: 0,
      zone_median_psqm: 0,
    };
  }

  // 1. Calculate weighted average price/sqm from comparables
  let totalWeight = 0;
  let weightedPriceSum = 0;
  const allPrices: number[] = [];

  for (const comp of comparables) {
    // Weight by similarity (0-100 → 0-1) and inverse distance
    const similarityWeight = comp.similarity_score / 100;
    const distanceWeight = Math.max(0.1, 1 - comp.distance_km / 5);
    const weight = similarityWeight * distanceWeight;

    weightedPriceSum += comp.adjusted_price_per_sqm * weight;
    totalWeight += weight;
    allPrices.push(comp.adjusted_price_per_sqm);
  }

  const avgPricePerSqm = totalWeight > 0 ? weightedPriceSum / totalWeight : 0;

  // 2. Calculate zone median
  allPrices.sort((a, b) => a - b);
  const zoneMedPSqm = allPrices.length > 0
    ? allPrices[Math.floor(allPrices.length / 2)]
    : avgPricePerSqm;

  // 3. Apply property-specific adjustments
  let adjustedPSqm = avgPricePerSqm;

  // Condition adjustment
  const condMultiplier = CONDITION_MULTIPLIER[property.condition] || 1.0;
  adjustedPSqm *= condMultiplier;

  // Feature premiums
  let featurePremium = 0;
  for (const feat of property.features) {
    const lower = feat.toLowerCase();
    for (const [keyword, premium] of Object.entries(FEATURE_PREMIUMS)) {
      if (lower.includes(keyword)) {
        featurePremium += premium;
        break;
      }
    }
  }
  adjustedPSqm *= (1 + Math.min(featurePremium, 0.35)); // Cap at 35%

  // Age adjustment
  if (property.year_built) {
    const age = new Date().getFullYear() - property.year_built;
    if (age <= 2) adjustedPSqm *= 1.05;
    else if (age <= 10) adjustedPSqm *= 1.00;
    else if (age <= 30) adjustedPSqm *= 0.97;
    else if (age <= 50) adjustedPSqm *= 0.93;
    else adjustedPSqm *= 0.88;
  }

  // 4. Calculate estimated value
  const estimatedValue = Math.round(adjustedPSqm * property.sqm);

  // 5. Calculate confidence
  let confidence = 30; // base
  if (comparables.length >= 3) confidence += 15;
  if (comparables.length >= 6) confidence += 10;
  if (comparables.length >= 10) confidence += 10;

  const avgSimilarity = comparables.reduce((s, c) => s + c.similarity_score, 0) / comparables.length;
  confidence += Math.round(avgSimilarity * 0.25);

  const avgDistance = comparables.reduce((s, c) => s + c.distance_km, 0) / comparables.length;
  if (avgDistance < 0.5) confidence += 10;
  else if (avgDistance < 1) confidence += 5;

  confidence = Math.min(95, Math.max(10, confidence));

  // 6. Confidence range (±based on confidence)
  const rangePct = (100 - confidence) / 100 * 0.20; // Lower confidence = wider range
  const low = Math.round(estimatedValue * (1 - rangePct));
  const high = Math.round(estimatedValue * (1 + rangePct));

  return {
    estimated_value: estimatedValue,
    confidence_low: low,
    confidence_high: high,
    confidence_score: confidence,
    price_per_sqm: Math.round(adjustedPSqm),
    methodology: `Weighted comparable analysis (${comparables.length} comps, avg similarity ${Math.round(avgSimilarity)}%, avg distance ${avgDistance.toFixed(1)}km). Adjustments: condition (${property.condition}: ${((condMultiplier - 1) * 100).toFixed(0)}%), features (+${(featurePremium * 100).toFixed(0)}%).`,
    comparables_used: comparables.length,
    zone_median_psqm: Math.round(zoneMedPSqm),
  };
}
