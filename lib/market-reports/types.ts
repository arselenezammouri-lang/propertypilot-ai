/**
 * Market Reports — Types and data fetching for weekly market digests
 * Covers: Idealista, ImmoScout24, Rightmove, and other EU indices
 */

export interface MarketIndex {
  country: string;
  city: string;
  source: string;
  avg_price_sqm: number;
  price_change_1m: number;
  price_change_3m: number;
  price_change_1y: number;
  avg_days_on_market: number;
  inventory_level: "low" | "medium" | "high";
  demand_index: number;
  data_date: string;
}

export interface MarketReport {
  id: string;
  user_id: string;
  title: string;
  report_date: string;
  country: string;
  cities: string[];
  indices: MarketIndex[];
  summary: string;
  highlights: string[];
  recommendations: string[];
  pdf_url: string | null;
  email_sent: boolean;
  created_at: string;
}

export interface MarketReportConfig {
  user_id: string;
  enabled: boolean;
  countries: string[];
  cities: string[];
  send_day: number; // 0=Sun, 1=Mon...
  send_hour: number; // 0-23
  include_pdf: boolean;
  white_label: boolean;
  recipients: string[];
}

/** Market data sources */
export const MARKET_SOURCES: Record<string, { name: string; countries: string[] }> = {
  idealista: { name: "Idealista", countries: ["IT", "ES", "PT"] },
  immoscout24: { name: "ImmoScout24", countries: ["DE"] },
  rightmove: { name: "Rightmove", countries: ["UK"] },
  seloger: { name: "SeLoger", countries: ["FR"] },
  istat: { name: "ISTAT", countries: ["IT"] },
  ine: { name: "INE", countries: ["ES"] },
  destatis: { name: "Destatis", countries: ["DE"] },
};

/**
 * Generate mock market indices (placeholder for real API data)
 * In production: scrape or use APIs from Idealista, ImmoScout24, etc.
 */
export function generateMarketIndices(country: string, cities: string[]): MarketIndex[] {
  const sourcesByCountry: Record<string, string> = {
    IT: "Idealista + ISTAT",
    FR: "SeLoger + INSEE",
    ES: "Idealista + INE",
    DE: "ImmoScout24 + Destatis",
    UK: "Rightmove + Land Registry",
    PT: "Idealista + INE",
  };

  const source = sourcesByCountry[country] ?? "PropertyPilot Data";

  return cities.map((city) => {
    // Deterministic but varied mock data based on city name
    const seed = city.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const basePrice = 2000 + (seed % 8000);

    return {
      country,
      city,
      source,
      avg_price_sqm: basePrice,
      price_change_1m: ((seed % 30) - 10) / 10,
      price_change_3m: ((seed % 50) - 15) / 10,
      price_change_1y: ((seed % 80) - 20) / 10,
      avg_days_on_market: 30 + (seed % 90),
      inventory_level: seed % 3 === 0 ? "low" : seed % 3 === 1 ? "medium" : "high",
      demand_index: 40 + (seed % 60),
      data_date: new Date().toISOString().split("T")[0],
    };
  });
}

/**
 * Generate AI summary of market data
 */
export async function generateMarketSummary(
  indices: MarketIndex[],
  country: string
): Promise<{ summary: string; highlights: string[]; recommendations: string[] }> {
  // Analyze trends
  const avgPriceChange = indices.reduce((sum, i) => sum + i.price_change_1m, 0) / indices.length;
  const avgDays = indices.reduce((sum, i) => sum + i.avg_days_on_market, 0) / indices.length;
  const hotCities = indices.filter((i) => i.price_change_1m > 1).map((i) => i.city);
  const coolingCities = indices.filter((i) => i.price_change_1m < -0.5).map((i) => i.city);

  const trend = avgPriceChange > 0.5 ? "rising" : avgPriceChange < -0.5 ? "declining" : "stable";

  const summary = `The ${country} property market is ${trend} this week with an average price change of ${avgPriceChange.toFixed(1)}% month-over-month. Average days on market: ${Math.round(avgDays)} days across ${indices.length} tracked cities.`;

  const highlights: string[] = [];
  if (hotCities.length > 0) highlights.push(`🔥 Hot markets: ${hotCities.join(", ")}`);
  if (coolingCities.length > 0) highlights.push(`❄️ Cooling: ${coolingCities.join(", ")}`);
  highlights.push(`📊 Average price/m²: €${Math.round(indices.reduce((s, i) => s + i.avg_price_sqm, 0) / indices.length)}`);
  highlights.push(`⏱️ Average days on market: ${Math.round(avgDays)}`);

  const recommendations: string[] = [];
  if (trend === "rising") {
    recommendations.push("Consider accelerating sales in hot markets before potential correction");
    recommendations.push("Advise buyers to act quickly on well-priced properties");
  } else if (trend === "declining") {
    recommendations.push("Focus on realistic pricing to match market conditions");
    recommendations.push("Highlight property strengths to justify asking prices");
  }
  recommendations.push("Share this report with clients to position yourself as a market expert");

  return { summary, highlights, recommendations };
}
