/**
 * Compliance Check API — Run country-specific compliance checks on a listing
 * POST: Run full compliance check with optional AI verification
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { runComplianceCheck } from "@/lib/compliance/checker";
import { verifyListingWithAI } from "@/lib/compliance/ai-verification";
import type { ComplianceCountry, ListingData } from "@/lib/compliance/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

const complianceSchema = z.object({
  listing: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    price_type: z.string().optional(),
    sqm: z.number().optional(),
    rooms: z.number().optional(),
    energy_class: z.string().optional(),
    energy_value: z.number().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    property_type: z.string().optional(),
    photos: z.array(z.string()).optional(),
    has_floor_plan: z.boolean().optional(),
    year_built: z.number().optional(),
    condition: z.string().optional(),
    features: z.array(z.string()).optional(),
    cadastral_reference: z.string().optional(),
    building_permits: z.boolean().optional(),
    habitability_certificate: z.boolean().optional(),
    co2_emissions: z.number().optional(),
  }),
  country: z.enum(["IT", "FR", "ES", "DE", "UK", "PT"]),
  include_ai: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const parsed = complianceSchema.parse(body);
    const listing = parsed.listing as ListingData;
    const country = parsed.country as ComplianceCountry;

    // Run rule-based checks
    const result = runComplianceCheck(listing, country);

    // Optional AI verification
    let aiVerification = null;
    if (parsed.include_ai) {
      aiVerification = await verifyListingWithAI(listing, country);
    }

    // Save report to database
    const { data: report } = await supabase
      .from("compliance_reports")
      .insert({
        user_id: user.id,
        listing_id: null,
        country,
        status: result.status,
        score: result.score,
        checks: result.checks,
        ai_verification: aiVerification,
      })
      .select("id, created_at")
      .single();

    return NextResponse.json({
      report_id: report?.id,
      country,
      status: result.status,
      score: result.score,
      errors: result.errors,
      warnings: result.warnings,
      passed: result.passed,
      checks: result.checks,
      ai_verification: aiVerification,
    });
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map((e) => e.message).join(", ")
      : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
