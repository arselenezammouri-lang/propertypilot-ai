/**
 * Portugal (PT) — Compliance rules for real estate listings
 * References: SCE (Sistema de Certificação Energética), RJUE
 */

import type { ComplianceRule, ListingData, ComplianceCheckResult } from "../types";

function check(fn: (l: ListingData) => ComplianceCheckResult): (l: ListingData) => ComplianceCheckResult {
  return fn;
}

export const PT_RULES: ComplianceRule[] = [
  {
    id: "PT-001",
    country: "PT",
    category: "Energy",
    title: "Certificado Energético (SCE) Required",
    description: "Energy certificate mandatory for all property sales and rentals",
    severity: "error",
    check: check((listing) => ({
      passed: !!listing.energy_class,
      message: listing.energy_class
        ? `Energy class: ${listing.energy_class}`
        : "Missing certificado energético — mandatory in Portugal",
      suggestion: "Display the classe energética (A+ to F) from the SCE certificate",
      reference: "DL 118/2013 — Sistema de Certificação Energética",
    })),
  },
  {
    id: "PT-002",
    country: "PT",
    category: "Property Info",
    title: "Área Útil (Usable Area)",
    description: "Usable area must be declared in square meters",
    severity: "error",
    check: check((listing) => ({
      passed: listing.sqm != null && listing.sqm > 0,
      message: listing.sqm ? `Área: ${listing.sqm} m²` : "Missing área útil",
      suggestion: "Declare área útil and área bruta privativa in m²",
    })),
  },
  {
    id: "PT-003",
    country: "PT",
    category: "Legal",
    title: "Licença de Utilização",
    description: "Building usage license should be referenced for habitation",
    severity: "warning",
    check: check((listing) => ({
      passed: listing.habitability_certificate === true,
      message: listing.habitability_certificate
        ? "Licença de utilização confirmed"
        : "Licença de utilização status not declared",
      suggestion: "Confirm licença de utilização (habitação) is valid and current",
      reference: "RJUE (Regime Jurídico da Urbanização e Edificação)",
    })),
  },
  {
    id: "PT-004",
    country: "PT",
    category: "Property Info",
    title: "Price and IMI Disclosure",
    description: "Price and expected IMI (property tax) should be disclosed",
    severity: "warning",
    check: check((listing) => ({
      passed: listing.price != null && listing.price > 0,
      message: listing.price ? `Price: €${listing.price.toLocaleString()}` : "Missing price",
      suggestion: "State price and estimated IMI anual (Imposto Municipal sobre Imóveis)",
    })),
  },
];
