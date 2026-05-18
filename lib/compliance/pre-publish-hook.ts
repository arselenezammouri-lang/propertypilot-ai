/**
 * Compliance Pre-Publish Hook — blocks or warns before publishing non-compliant listings
 * Import and call in your AI Listings v2 publish API route
 */

import { runComplianceCheck } from "@/lib/compliance/checker";
import type { ComplianceCountry, ListingData, ComplianceStatus } from "@/lib/compliance/types";

export interface PrePublishResult {
  allowed: boolean;
  status: ComplianceStatus;
  score: number;
  errors: number;
  warnings: number;
  blocking_issues: string[];
  warning_issues: string[];
}

/**
 * Check a listing before publishing to portals.
 * Returns allowed=false if there are blocking compliance errors.
 */
export function prePublishComplianceCheck(
  listing: ListingData,
  country: ComplianceCountry
): PrePublishResult {
  const result = runComplianceCheck(listing, country);

  const blockingIssues = result.checks
    .filter((c) => !c.passed && c.severity === "error")
    .map((c) => `${c.title}: ${c.message}${c.suggestion ? ` → ${c.suggestion}` : ""}`);

  const warningIssues = result.checks
    .filter((c) => !c.passed && c.severity === "warning")
    .map((c) => `${c.title}: ${c.message}`);

  return {
    allowed: blockingIssues.length === 0,
    status: result.status,
    score: result.score,
    errors: result.errors,
    warnings: result.warnings,
    blocking_issues: blockingIssues,
    warning_issues: warningIssues,
  };
}

/**
 * Detect country from listing data
 */
export function detectCountry(listing: ListingData): ComplianceCountry {
  const country = (listing.country ?? "").toUpperCase();
  const validCountries: ComplianceCountry[] = ["IT", "FR", "ES", "DE", "UK", "PT"];
  if (validCountries.includes(country as ComplianceCountry)) {
    return country as ComplianceCountry;
  }
  return "IT"; // Default to Italy
}
