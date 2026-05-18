/**
 * Compliance Checker — Runs country-specific rules against listing data
 */

import type {
  ComplianceCountry,
  ComplianceRule,
  ComplianceStatus,
  ComplianceCheckDetail,
  ListingData,
} from "./types";
import { IT_RULES } from "./rules/it";
import { FR_RULES } from "./rules/fr";
import { ES_RULES } from "./rules/es";
import { DE_RULES } from "./rules/de";
import { UK_RULES } from "./rules/uk";
import { PT_RULES } from "./rules/pt";

const RULES_BY_COUNTRY: Record<ComplianceCountry, ComplianceRule[]> = {
  IT: IT_RULES,
  FR: FR_RULES,
  ES: ES_RULES,
  DE: DE_RULES,
  UK: UK_RULES,
  PT: PT_RULES,
};

export interface ComplianceResult {
  country: ComplianceCountry;
  status: ComplianceStatus;
  score: number;
  checks: ComplianceCheckDetail[];
  errors: number;
  warnings: number;
  passed: number;
}

export function runComplianceCheck(
  listing: ListingData,
  country: ComplianceCountry
): ComplianceResult {
  const rules = RULES_BY_COUNTRY[country] ?? [];

  const checks: ComplianceCheckDetail[] = rules.map((rule) => {
    const result = rule.check(listing);
    return {
      rule_id: rule.id,
      category: rule.category,
      title: rule.title,
      severity: rule.severity,
      passed: result.passed,
      message: result.message,
      suggestion: result.suggestion,
      reference: result.reference,
    };
  });

  const errors = checks.filter((c) => !c.passed && c.severity === "error").length;
  const warnings = checks.filter((c) => !c.passed && c.severity === "warning").length;
  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;

  // Score: errors deduct 20pts each, warnings 5pts each
  const score = Math.max(0, Math.round(100 - (errors * 20) - (warnings * 5)));

  let status: ComplianceStatus = "compliant";
  if (errors > 0) status = "non_compliant";
  else if (warnings > 0) status = "needs_review";

  return { country, status, score, checks, errors, warnings, passed };
}

export function getSupportedCountries(): ComplianceCountry[] {
  return Object.keys(RULES_BY_COUNTRY) as ComplianceCountry[];
}

export function getRulesForCountry(country: ComplianceCountry): ComplianceRule[] {
  return RULES_BY_COUNTRY[country] ?? [];
}
