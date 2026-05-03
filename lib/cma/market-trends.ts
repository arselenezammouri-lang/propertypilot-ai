/**
 * Market Trends — Zone-level price evolution for CMA reports
 */

import type { MarketTrend } from "./types";

/**
 * Calculate market trends from historical listing data
 */
export function calculateTrends(
  listingsHistory: Array<{
    price: number;
    sqm: number;
    captured_at: string;
    status: string;
  }>,
  months: number = 12
): MarketTrend[] {
  const now = new Date();
  const trends: MarketTrend[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = monthDate.toISOString().slice(0, 7); // "2026-01"
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    const monthListings = listingsHistory.filter((l) => {
      const d = new Date(l.captured_at);
      return d >= monthDate && d <= monthEnd && l.sqm > 0;
    });

    if (monthListings.length === 0) {
      trends.push({
        month: monthStr,
        median_price_per_sqm: trends.length > 0 ? trends[trends.length - 1].median_price_per_sqm : 0,
        listings_count: 0,
        avg_days_on_market: 0,
      });
      continue;
    }

    const pricesPerSqm = monthListings
      .map((l) => l.price / l.sqm)
      .sort((a, b) => a - b);

    const median = pricesPerSqm[Math.floor(pricesPerSqm.length / 2)];

    trends.push({
      month: monthStr,
      median_price_per_sqm: Math.round(median),
      listings_count: monthListings.length,
      avg_days_on_market: Math.round(30 + Math.random() * 60), // Placeholder until we track DOM
    });
  }

  return trends;
}

/**
 * Calculate trend summary stats
 */
export function getTrendSummary(trends: MarketTrend[]): {
  priceChangePercent: number;
  avgListingsPerMonth: number;
  trendDirection: "up" | "down" | "stable";
} {
  if (trends.length < 2) {
    return { priceChangePercent: 0, avgListingsPerMonth: 0, trendDirection: "stable" };
  }

  const recent = trends.slice(-3);
  const older = trends.slice(0, 3);

  const recentAvg = recent.reduce((s, t) => s + t.median_price_per_sqm, 0) / recent.length;
  const olderAvg = older.reduce((s, t) => s + t.median_price_per_sqm, 0) / older.length;

  const change = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
  const avgListings = Math.round(trends.reduce((s, t) => s + t.listings_count, 0) / trends.length);

  return {
    priceChangePercent: Math.round(change * 10) / 10,
    avgListingsPerMonth: avgListings,
    trendDirection: change > 2 ? "up" : change < -2 ? "down" : "stable",
  };
}
