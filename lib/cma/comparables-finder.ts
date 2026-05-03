/**
 * Comparables Finder — Finds similar properties for CMA analysis
 *
 * Scoring: location distance (40%), sqm similarity (25%),
 * bedrooms (15%), condition (10%), recency (10%)
 */

import type { CMAProperty, Comparable, ComparableAdjustment } from "./types";

interface RawListing {
  id: string;
  title: string;
  address?: string;
  city?: string;
  price: number;
  sqm: number;
  rooms: number;
  bathrooms: number;
  condition?: string;
  latitude?: number;
  longitude?: number;
  sold_date?: string;
  source_url?: string;
  source_name?: string;
  photos?: string[];
  created_at: string;
}

/**
 * Calculate distance between two lat/lng points (Haversine)
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Score a potential comparable against the subject property
 */
function scoreComparable(subject: CMAProperty, comp: RawListing): {
  score: number;
  distance: number;
  adjustments: ComparableAdjustment[];
} {
  let score = 0;
  const adjustments: ComparableAdjustment[] = [];

  // Location distance (40% weight)
  let distance = 1.5; // default if no coords
  if (subject.latitude && subject.longitude && comp.latitude && comp.longitude) {
    distance = haversineDistance(subject.latitude, subject.longitude, comp.latitude, comp.longitude);
  }
  const distScore = distance <= 0.5 ? 40 : distance <= 1 ? 30 : distance <= 2 ? 20 : distance <= 3 ? 10 : 0;
  score += distScore;

  // Sqm similarity (25% weight)
  const sqmDiff = Math.abs(subject.sqm - comp.sqm) / subject.sqm;
  const sqmScore = sqmDiff <= 0.1 ? 25 : sqmDiff <= 0.2 ? 20 : sqmDiff <= 0.3 ? 15 : sqmDiff <= 0.5 ? 8 : 0;
  score += sqmScore;

  // Apply sqm adjustment
  if (sqmDiff > 0.05) {
    const pctDiff = ((comp.sqm - subject.sqm) / subject.sqm) * 100;
    adjustments.push({
      factor: "Size difference",
      description: `${comp.sqm}m² vs ${subject.sqm}m² (${pctDiff > 0 ? "+" : ""}${pctDiff.toFixed(0)}%)`,
      percentage: -Math.round(pctDiff * 0.5), // Half the size difference as price adjustment
      amount: 0,
    });
  }

  // Bedrooms match (15% weight)
  const roomDiff = Math.abs(subject.rooms - comp.rooms);
  score += roomDiff === 0 ? 15 : roomDiff === 1 ? 10 : roomDiff === 2 ? 5 : 0;

  if (roomDiff > 0) {
    adjustments.push({
      factor: "Bedrooms",
      description: `${comp.rooms} vs ${subject.rooms} rooms`,
      percentage: (subject.rooms - comp.rooms) * 5,
      amount: 0,
    });
  }

  // Condition (10% weight)
  const condMap: Record<string, number> = { new: 5, excellent: 4, good: 3, fair: 2, needs_renovation: 1 };
  const subjectCond = condMap[subject.condition] || 3;
  const compCond = condMap[comp.condition || "good"] || 3;
  const condDiff = Math.abs(subjectCond - compCond);
  score += condDiff === 0 ? 10 : condDiff === 1 ? 7 : condDiff === 2 ? 3 : 0;

  if (condDiff > 0) {
    adjustments.push({
      factor: "Condition",
      description: `${comp.condition || "good"} vs ${subject.condition}`,
      percentage: (subjectCond - compCond) * 5,
      amount: 0,
    });
  }

  // Recency (10% weight)
  const ageMonths = comp.sold_date
    ? (Date.now() - new Date(comp.sold_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
    : (Date.now() - new Date(comp.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30);
  score += ageMonths <= 3 ? 10 : ageMonths <= 6 ? 7 : ageMonths <= 12 ? 4 : 1;

  return { score, distance, adjustments };
}

/**
 * Find best comparable properties for a CMA
 */
export function findComparables(
  subject: CMAProperty,
  listings: RawListing[],
  options: { maxResults?: number; maxDistanceKm?: number } = {}
): Comparable[] {
  const { maxResults = 10, maxDistanceKm = 3 } = options;

  // Filter: same property type zone, similar size (±50%)
  const candidates = listings.filter((l) => {
    if (l.sqm <= 0 || l.price <= 0) return false;
    const sqmRatio = l.sqm / subject.sqm;
    return sqmRatio >= 0.5 && sqmRatio <= 2.0;
  });

  // Score each candidate
  const scored = candidates.map((comp) => {
    const { score, distance, adjustments } = scoreComparable(subject, comp);
    const pricePerSqm = comp.price / comp.sqm;

    // Calculate adjusted price/sqm
    let adjustedPSqm = pricePerSqm;
    for (const adj of adjustments) {
      adjustedPSqm *= (1 + adj.percentage / 100);
      adj.amount = Math.round(pricePerSqm * (adj.percentage / 100) * subject.sqm);
    }

    return {
      id: comp.id,
      address: comp.address || comp.title || "",
      city: comp.city || subject.city,
      price: comp.price,
      sqm: comp.sqm,
      price_per_sqm: Math.round(pricePerSqm),
      rooms: comp.rooms,
      bathrooms: comp.bathrooms,
      condition: comp.condition || "good",
      distance_km: Math.round(distance * 100) / 100,
      similarity_score: score,
      sold_date: comp.sold_date || null,
      source_url: comp.source_url || "",
      source_name: comp.source_name || "PropertyPilot Database",
      photos: comp.photos || [],
      adjustments,
      adjusted_price_per_sqm: Math.round(adjustedPSqm),
    } as Comparable;
  });

  // Sort by similarity score, take top N within distance limit
  return scored
    .filter((c) => c.distance_km <= maxDistanceKm && c.similarity_score > 20)
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, maxResults);
}
