/**
 * Compliance Shield — Types for EU real estate listing compliance
 */

export type ComplianceCountry = "IT" | "FR" | "ES" | "DE" | "UK" | "PT";

export type ComplianceSeverity = "error" | "warning" | "info";

export type ComplianceStatus = "compliant" | "needs_review" | "non_compliant";

export interface ComplianceRule {
  id: string;
  country: ComplianceCountry;
  category: string;
  title: string;
  description: string;
  severity: ComplianceSeverity;
  check: (listing: ListingData) => ComplianceCheckResult;
}

export interface ComplianceCheckResult {
  passed: boolean;
  message: string;
  suggestion?: string;
  reference?: string;
}

export interface ComplianceReport {
  id: string;
  listing_id: string;
  user_id: string;
  country: ComplianceCountry;
  status: ComplianceStatus;
  score: number;
  checks: ComplianceCheckDetail[];
  ai_verification?: AIVerificationResult;
  created_at: string;
}

export interface ComplianceCheckDetail {
  rule_id: string;
  category: string;
  title: string;
  severity: ComplianceSeverity;
  passed: boolean;
  message: string;
  suggestion?: string;
  reference?: string;
}

export interface AIVerificationResult {
  overall_assessment: string;
  issues_found: string[];
  recommendations: string[];
  confidence: number;
}

export interface ListingData {
  title?: string;
  description?: string;
  price?: number;
  price_type?: string;
  sqm?: number;
  rooms?: number;
  energy_class?: string;
  energy_value?: number;
  address?: string;
  city?: string;
  country?: string;
  property_type?: string;
  photos?: string[];
  has_floor_plan?: boolean;
  year_built?: number;
  condition?: string;
  features?: string[];
  cadastral_reference?: string;
  building_permits?: boolean;
  habitability_certificate?: boolean;
  co2_emissions?: number;
}
