/**
 * France (FR) — Compliance rules for real estate listings
 * References: Loi ALUR, Loi Climat et Résilience, DPE regulations
 */

import type { ComplianceRule, ListingData, ComplianceCheckResult } from "../types";

function check(fn: (l: ListingData) => ComplianceCheckResult): (l: ListingData) => ComplianceCheckResult {
  return fn;
}

export const FR_RULES: ComplianceRule[] = [
  {
    id: "FR-001",
    country: "FR",
    category: "Energy",
    title: "DPE (Diagnostic de Performance Énergétique) Required",
    description: "DPE energy label mandatory in all listings since 2011 (Loi Grenelle II)",
    severity: "error",
    check: check((listing) => ({
      passed: !!listing.energy_class,
      message: listing.energy_class
        ? `DPE energy label: ${listing.energy_class}`
        : "Missing DPE energy label — mandatory in France",
      suggestion: "Display DPE class (A to G) prominently in the listing",
      reference: "Loi n°2010-788, Art. 1",
    })),
  },
  {
    id: "FR-002",
    country: "FR",
    category: "Energy",
    title: "GES (Greenhouse Gas Emissions) Label",
    description: "CO2 emissions class required alongside DPE (Loi Climat et Résilience)",
    severity: "error",
    check: check((listing) => ({
      passed: listing.co2_emissions != null && listing.co2_emissions >= 0,
      message: listing.co2_emissions != null
        ? `GES emissions: ${listing.co2_emissions} kgCO2/m²/yr`
        : "Missing GES greenhouse gas emissions label",
      suggestion: "Include the GES class (A to G) from the DPE diagnostic",
      reference: "Loi Climat et Résilience 2021, Art. 148",
    })),
  },
  {
    id: "FR-003",
    country: "FR",
    category: "Legal",
    title: "Loi Carrez Surface Measurement",
    description: "For lots in copropriété, Loi Carrez surface area is mandatory",
    severity: "error",
    check: check((listing) => ({
      passed: listing.sqm != null && listing.sqm > 0,
      message: listing.sqm ? `Surface Loi Carrez: ${listing.sqm} m²` : "Missing Loi Carrez surface area",
      suggestion: "Declare the Loi Carrez measured surface for copropriété properties",
      reference: "Loi n°96-1107 (Loi Carrez)",
    })),
  },
  {
    id: "FR-004",
    country: "FR",
    category: "Legal",
    title: "Honoraires (Agency Fees) Disclosure",
    description: "Loi ALUR requires clear display of agency fees and who pays them",
    severity: "error",
    check: check((listing) => ({
      passed: listing.price != null && listing.price > 0 && listing.price_type != null,
      message: listing.price_type
        ? "Fee disclosure present"
        : "Missing honoraires (agency fees) disclosure — mandatory under Loi ALUR",
      suggestion: "State: 'Honoraires: X% TTC charge acquéreur/vendeur' and 'Prix hors/avec honoraires'",
      reference: "Loi ALUR 2014, Art. 24-I",
    })),
  },
  {
    id: "FR-005",
    country: "FR",
    category: "Energy",
    title: "Passoire Thermique Warning (F/G rated)",
    description: "F and G rated properties must display estimated energy cost range",
    severity: "warning",
    check: check((listing) => {
      const isPassoire = listing.energy_class === "F" || listing.energy_class === "G";
      if (!isPassoire) return { passed: true, message: "Not a passoire thermique" };
      return {
        passed: false,
        message: `Energy class ${listing.energy_class} — passoire thermique warning required`,
        suggestion: "Display: 'Logement à consommation énergétique excessive' and estimated annual energy cost range",
        reference: "Loi Climat et Résilience 2021",
      };
    }),
  },
  {
    id: "FR-006",
    country: "FR",
    category: "Property Info",
    title: "Number of Rooms (Nombre de pièces)",
    description: "Number of main rooms must be stated in the listing",
    severity: "warning",
    check: check((listing) => ({
      passed: listing.rooms != null && listing.rooms > 0,
      message: listing.rooms ? `${listing.rooms} pièces declared` : "Missing nombre de pièces",
      suggestion: "State the number of pièces principales (rooms over 9m²)",
    })),
  },
];
