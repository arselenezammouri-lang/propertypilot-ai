/**
 * Germany (DE) — Compliance rules for real estate listings
 * References: EnEV/GEG (Gebäudeenergiegesetz), WoFlV, Maklergesetz
 */

import type { ComplianceRule, ListingData, ComplianceCheckResult } from "../types";

function check(fn: (l: ListingData) => ComplianceCheckResult): (l: ListingData) => ComplianceCheckResult {
  return fn;
}

export const DE_RULES: ComplianceRule[] = [
  {
    id: "DE-001",
    country: "DE",
    category: "Energy",
    title: "Energieausweis (Energy Certificate) Required",
    description: "GEG §87 mandates energy certificate data in all property ads",
    severity: "error",
    check: check((listing) => ({
      passed: !!listing.energy_class,
      message: listing.energy_class
        ? `Energieeffizienzklasse: ${listing.energy_class}`
        : "Missing Energieausweis data — mandatory under GEG §87",
      suggestion: "Include: Energieeffizienzklasse (A+ to H), Endenergiebedarf or -verbrauch, Baujahr, Energieträger",
      reference: "GEG (Gebäudeenergiegesetz) §87",
    })),
  },
  {
    id: "DE-002",
    country: "DE",
    category: "Energy",
    title: "Baujahr (Year Built)",
    description: "Year of construction must be stated in energy certificate disclosure",
    severity: "error",
    check: check((listing) => ({
      passed: listing.year_built != null && listing.year_built > 1800,
      message: listing.year_built ? `Baujahr: ${listing.year_built}` : "Missing Baujahr (year built)",
      suggestion: "State the Baujahr as required by GEG energy certificate regulations",
      reference: "GEG §87 Abs. 1",
    })),
  },
  {
    id: "DE-003",
    country: "DE",
    category: "Property Info",
    title: "Wohnfläche (Living Area)",
    description: "Living area must be calculated per WoFlV standards",
    severity: "error",
    check: check((listing) => ({
      passed: listing.sqm != null && listing.sqm > 0,
      message: listing.sqm ? `Wohnfläche: ${listing.sqm} m²` : "Missing Wohnfläche",
      suggestion: "Declare Wohnfläche calculated according to Wohnflächenverordnung (WoFlV)",
      reference: "Wohnflächenverordnung (WoFlV)",
    })),
  },
  {
    id: "DE-004",
    country: "DE",
    category: "Legal",
    title: "Maklerprovision (Brokerage Commission)",
    description: "Since 2020, buyer/seller split commission must be disclosed (Maklergesetz)",
    severity: "error",
    check: check((listing) => ({
      passed: listing.price != null && listing.price > 0,
      message: listing.price
        ? "Price stated — ensure Provision disclosure is included"
        : "Missing price and Maklerprovision disclosure",
      suggestion: "State: 'Käuferprovision: X% inkl. MwSt.' as per §656a-d BGB",
      reference: "§656a-d BGB (Maklergesetz 2020)",
    })),
  },
  {
    id: "DE-005",
    country: "DE",
    category: "Energy",
    title: "CO2 Cost Split (CO2KostAufG)",
    description: "For rentals, CO2 cost distribution must be disclosed since 2023",
    severity: "info",
    check: check((listing) => ({
      passed: listing.co2_emissions != null,
      message: listing.co2_emissions != null
        ? `CO2 emissions: ${listing.co2_emissions} kgCO2/m²/yr`
        : "CO2 cost split info recommended for rental listings",
      suggestion: "For Vermietung: disclose CO2-Kostenaufteilung per CO2KostAufG",
      reference: "CO2KostAufG (2023)",
    })),
  },
];
