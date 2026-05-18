/**
 * Italy (IT) — Compliance rules for real estate listings
 * References: D.Lgs. 192/2005 (APE), Codice Civile, DM 26/6/2015
 */

import type { ComplianceRule, ListingData, ComplianceCheckResult } from "../types";

function check(fn: (l: ListingData) => ComplianceCheckResult): (l: ListingData) => ComplianceCheckResult {
  return fn;
}

export const IT_RULES: ComplianceRule[] = [
  {
    id: "IT-001",
    country: "IT",
    category: "Energy",
    title: "APE (Energy Performance Certificate) Required",
    description: "Italian law requires energy class disclosure in all property listings (D.Lgs. 192/2005)",
    severity: "error",
    check: check((listing) => ({
      passed: !!listing.energy_class && listing.energy_class.trim() !== "",
      message: listing.energy_class
        ? `Energy class declared: ${listing.energy_class}`
        : "Missing APE energy class — mandatory in Italy",
      suggestion: "Add the APE energy classification (A4 to G) from the certificazione energetica",
      reference: "D.Lgs. 192/2005, Art. 6",
    })),
  },
  {
    id: "IT-002",
    country: "IT",
    category: "Energy",
    title: "Energy Performance Index (IPE)",
    description: "Energy performance index should be disclosed alongside the energy class",
    severity: "warning",
    check: check((listing) => ({
      passed: listing.energy_value != null && listing.energy_value > 0,
      message: listing.energy_value
        ? `IPE declared: ${listing.energy_value} kWh/m²/year`
        : "Missing IPE (Indice di Prestazione Energetica) value",
      suggestion: "Include the IPE value from the APE certificate in kWh/m²/year",
      reference: "DM 26/06/2015",
    })),
  },
  {
    id: "IT-003",
    country: "IT",
    category: "Property Info",
    title: "Surface Area (Superficie)",
    description: "Property surface area in square meters must be declared",
    severity: "error",
    check: check((listing) => ({
      passed: listing.sqm != null && listing.sqm > 0,
      message: listing.sqm ? `Surface area: ${listing.sqm} m²` : "Missing property surface area",
      suggestion: "Declare the superficie commerciale or calpestabile in m²",
    })),
  },
  {
    id: "IT-004",
    country: "IT",
    category: "Property Info",
    title: "Price Transparency",
    description: "Price must be clearly stated (Codice del Consumo, D.Lgs. 206/2005)",
    severity: "error",
    check: check((listing) => ({
      passed: listing.price != null && listing.price > 0,
      message: listing.price ? `Price declared: €${listing.price.toLocaleString()}` : "Missing price — required for consumer protection",
      suggestion: "Clearly state the asking price or indicate 'Prezzo su richiesta' with justification",
      reference: "D.Lgs. 206/2005",
    })),
  },
  {
    id: "IT-005",
    country: "IT",
    category: "Legal",
    title: "Cadastral Reference",
    description: "Cadastral data recommended for transparency (catasto reference)",
    severity: "info",
    check: check((listing) => ({
      passed: !!listing.cadastral_reference,
      message: listing.cadastral_reference
        ? "Cadastral reference provided"
        : "No cadastral reference — recommended for full transparency",
      suggestion: "Add foglio, particella, subalterno from the visura catastale",
    })),
  },
  {
    id: "IT-006",
    country: "IT",
    category: "Legal",
    title: "Conformità Urbanistica",
    description: "Building permit / habitability certificate status",
    severity: "warning",
    check: check((listing) => ({
      passed: listing.habitability_certificate === true || listing.building_permits === true,
      message: listing.habitability_certificate
        ? "Habitability certificate confirmed"
        : "Conformità urbanistica / agibilità status not declared",
      suggestion: "Confirm certificato di agibilità and conformità urbanistica status",
    })),
  },
  {
    id: "IT-007",
    country: "IT",
    category: "Photos",
    title: "Minimum Photo Requirements",
    description: "Portals require minimum photo count; Immobiliare.it recommends 10+",
    severity: "warning",
    check: check((listing) => {
      const count = listing.photos?.length ?? 0;
      return {
        passed: count >= 5,
        message: count >= 5 ? `${count} photos provided` : `Only ${count} photos — minimum 5 recommended`,
        suggestion: "Add at least 5 high-quality photos; 10+ for best portal visibility",
      };
    }),
  },
];
