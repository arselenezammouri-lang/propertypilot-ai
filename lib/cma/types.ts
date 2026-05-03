/**
 * CMA Types — Comparative Market Analysis + Automated Valuation
 */

export interface CMAProperty {
  id: string;
  address: string;
  city: string;
  zone: string;
  country: string;
  property_type: string;
  sqm: number;
  rooms: number;
  bathrooms: number;
  floor: number | null;
  year_built: number | null;
  condition: "new" | "excellent" | "good" | "fair" | "needs_renovation";
  energy_class: string | null;
  features: string[];
  photos: string[];
  asking_price: number | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Comparable {
  id: string;
  address: string;
  city: string;
  price: number;
  sqm: number;
  price_per_sqm: number;
  rooms: number;
  bathrooms: number;
  condition: string;
  distance_km: number;
  similarity_score: number; // 0-100
  sold_date: string | null;
  source_url: string;
  source_name: string;
  photos: string[];
  adjustments: ComparableAdjustment[];
  adjusted_price_per_sqm: number;
}

export interface ComparableAdjustment {
  factor: string;
  description: string;
  percentage: number; // e.g. +5, -10
  amount: number;
}

export interface ValuationResult {
  estimated_value: number;
  confidence_low: number;
  confidence_high: number;
  confidence_score: number; // 0-100
  price_per_sqm: number;
  methodology: string;
  comparables_used: number;
  zone_median_psqm: number;
}

export interface MarketTrend {
  month: string; // "2026-01", "2026-02", etc.
  median_price_per_sqm: number;
  listings_count: number;
  avg_days_on_market: number;
}

export interface CMAReport {
  id: string;
  property: CMAProperty;
  valuation: ValuationResult;
  comparables: Comparable[];
  market_trends: MarketTrend[];
  citations: CMACitation[];
  agency: {
    name: string;
    logo_url: string | null;
    agent_name: string;
    agent_email: string;
    agent_phone: string;
  };
  generated_at: string;
  pdf_url: string | null;
}

export interface CMACitation {
  id: string;
  data_type: "comparable" | "trend" | "valuation" | "zone_stat";
  source_url: string;
  source_name: string;
  claim_text: string;
  value: string;
  captured_at: string;
}
