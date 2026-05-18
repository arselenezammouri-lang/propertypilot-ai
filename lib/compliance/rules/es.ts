/**
 * Spain (ES) — Compliance rules for real estate listings
 * References: RD 235/2013 (CEE), Ley de Vivienda 2023
 */

import type { ComplianceRule, ListingData, ComplianceCheckResult } from "../types";

function check(fn: (l: ListingData) => ComplianceCheckResult): (l: ListingData) => ComplianceCheckResult {
  return fn;
}

export const ES_RULES: ComplianceRule[] = [
  {
    id: "ES-001",
    country: "ES",
    category: "Energy",
    title: "CEE (Certificado de Eficiencia Energética) Required",
    description: "Energy performance certificate mandatory since 2013 (RD 235/2013)",
    severity: "error",
    check: check((listing) => ({
      passed: !!listing.energy_class,
      message: listing.energy_class
        ? `CEE energy class: ${listing.energy_class}`
        : "Missing CEE energy certificate — mandatory in Spain",
      suggestion: "Display the calificación energética (A to G) from the CEE",
      reference: "Real Decreto 235/2013",
    })),
  },
  {
    id: "ES-002",
    country: "ES",
    category: "Property Info",
    title: "Superficie Construida",
    description: "Built surface area must be declared",
    severity: "error",
    check: check((listing) => ({
      passed: listing.sqm != null && listing.sqm > 0,
      message: listing.sqm ? `Surface: ${listing.sqm} m²` : "Missing superficie construida",
      suggestion: "Declare superficie construida (total built area) and útil (usable) in m²",
    })),
  },
  {
    id: "ES-003",
    country: "ES",
    category: "Legal",
    title: "Referencia Catastral",
    description: "Cadastral reference recommended for transparency",
    severity: "info",
    check: check((listing) => ({
      passed: !!listing.cadastral_reference,
      message: listing.cadastral_reference
        ? "Referencia catastral provided"
        : "No referencia catastral — recommended",
      suggestion: "Add the 20-digit referencia catastral from the Catastro",
    })),
  },
  {
    id: "ES-004",
    country: "ES",
    category: "Property Info",
    title: "Price Disclosure",
    description: "Price must be clearly stated (Ley de Vivienda 2023)",
    severity: "error",
    check: check((listing) => ({
      passed: listing.price != null && listing.price > 0,
      message: listing.price ? `Price: €${listing.price.toLocaleString()}` : "Missing price",
      suggestion: "State the precio de venta/alquiler clearly",
      reference: "Ley 12/2023 por el derecho a la vivienda",
    })),
  },
  {
    id: "ES-005",
    country: "ES",
    category: "Photos",
    title: "Photo Requirements",
    description: "Idealista and other portals recommend minimum 10 photos",
    severity: "warning",
    check: check((listing) => {
      const count = listing.photos?.length ?? 0;
      return {
        passed: count >= 5,
        message: count >= 5 ? `${count} photos` : `Only ${count} photos — at least 5 recommended`,
        suggestion: "Upload at least 5 high-quality photos for better portal ranking",
      };
    }),
  },
];
