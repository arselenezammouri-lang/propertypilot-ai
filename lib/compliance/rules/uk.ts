/**
 * United Kingdom (UK) — Compliance rules for real estate listings
 * References: Consumer Protection from Unfair Trading Regulations 2008, EPC regulations
 */

import type { ComplianceRule, ListingData, ComplianceCheckResult } from "../types";

function check(fn: (l: ListingData) => ComplianceCheckResult): (l: ListingData) => ComplianceCheckResult {
  return fn;
}

export const UK_RULES: ComplianceRule[] = [
  {
    id: "UK-001",
    country: "UK",
    category: "Energy",
    title: "EPC (Energy Performance Certificate) Required",
    description: "EPC rating must be displayed in all property marketing materials",
    severity: "error",
    check: check((listing) => ({
      passed: !!listing.energy_class,
      message: listing.energy_class
        ? `EPC rating: ${listing.energy_class}`
        : "Missing EPC rating — legally required in property listings",
      suggestion: "Display the EPC rating (A to G) and certificate number",
      reference: "Energy Performance of Buildings (England and Wales) Regulations 2012",
    })),
  },
  {
    id: "UK-002",
    country: "UK",
    category: "Legal",
    title: "Material Information Disclosure",
    description: "National Trading Standards requires disclosure of material facts",
    severity: "error",
    check: check((listing) => {
      const hasBasics = listing.price != null && listing.sqm != null && listing.rooms != null;
      return {
        passed: hasBasics,
        message: hasBasics
          ? "Core material information present"
          : "Missing material information (price, size, rooms) — required by Trading Standards",
        suggestion: "Include: price, tenure (freehold/leasehold), council tax band, property size, rooms",
        reference: "Consumer Protection from Unfair Trading Regulations 2008",
      };
    }),
  },
  {
    id: "UK-003",
    country: "UK",
    category: "Property Info",
    title: "Property Size",
    description: "Property size recommended to be stated in sq ft and/or sq m",
    severity: "warning",
    check: check((listing) => ({
      passed: listing.sqm != null && listing.sqm > 0,
      message: listing.sqm ? `Size: ${listing.sqm} m² (${Math.round(listing.sqm * 10.764)} sq ft)` : "No property size stated",
      suggestion: "State property size in both sq ft and m² as per RICS best practice",
    })),
  },
  {
    id: "UK-004",
    country: "UK",
    category: "Photos",
    title: "Floor Plan Recommended",
    description: "Rightmove data shows 30% more engagement with floor plans",
    severity: "warning",
    check: check((listing) => ({
      passed: listing.has_floor_plan === true,
      message: listing.has_floor_plan ? "Floor plan included" : "No floor plan — strongly recommended for UK portals",
      suggestion: "Include a floor plan for better portal performance (Rightmove, Zoopla, OnTheMarket)",
    })),
  },
  {
    id: "UK-005",
    country: "UK",
    category: "Photos",
    title: "Photo Count",
    description: "UK portals recommend minimum 10 photos for optimal listing performance",
    severity: "warning",
    check: check((listing) => {
      const count = listing.photos?.length ?? 0;
      return {
        passed: count >= 5,
        message: count >= 5 ? `${count} photos provided` : `Only ${count} photos — portals recommend 10+`,
        suggestion: "Upload at least 10 high-quality photos including exterior, all rooms, garden",
      };
    }),
  },
];
