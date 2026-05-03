import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { findComparables } from "@/lib/cma/comparables-finder";
import { calculateValuation } from "@/lib/cma/avm";
import { calculateTrends } from "@/lib/cma/market-trends";
import type { CMAProperty, CMAReport, CMACitation } from "@/lib/cma/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

const generateSchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  zone: z.string().default(""),
  country: z.string().default("IT"),
  property_type: z.string().default("Apartment"),
  sqm: z.number().positive(),
  rooms: z.number().positive(),
  bathrooms: z.number().min(0).default(1),
  floor: z.number().nullable().default(null),
  year_built: z.number().nullable().default(null),
  condition: z.enum(["new", "excellent", "good", "fair", "needs_renovation"]).default("good"),
  energy_class: z.string().nullable().default(null),
  features: z.array(z.string()).default([]),
  asking_price: z.number().nullable().default(null),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const parsed = generateSchema.parse(body);

    // Build subject property
    const property: CMAProperty = {
      id: crypto.randomUUID(),
      ...parsed,
      photos: [],
      latitude: null,
      longitude: null,
    };

    // Fetch comparable listings from database
    const { data: rawListings } = await supabase
      .from("saved_listings")
      .select("id, title, property_data, generated_content, created_at")
      .eq("user_id", user.id)
      .limit(200);

    const listings = (rawListings || []).map((l) => {
      const pd = (l.property_data || {}) as Record<string, unknown>;
      return {
        id: l.id,
        title: l.title || "",
        address: String(pd.location || ""),
        city: String(pd.city || parsed.city),
        price: Number(pd.price) || 0,
        sqm: Number(pd.size || pd.sqm || pd.surface) || 0,
        rooms: Number(pd.rooms) || 0,
        bathrooms: Number(pd.bathrooms) || 1,
        condition: "good",
        source_url: "",
        source_name: "PropertyPilot Database",
        photos: [] as string[],
        created_at: l.created_at,
      };
    });

    // Also fetch from external_listings if available
    const { data: externalListings } = await supabase
      .from("external_listings")
      .select("*")
      .limit(500);

    const externals = (externalListings || []).map((l) => ({
      id: l.id,
      title: String(l.title || ""),
      address: String(l.address || ""),
      city: String(l.city || parsed.city),
      price: Number(l.price) || 0,
      sqm: Number(l.surface || l.sqm) || 0,
      rooms: Number(l.rooms) || 0,
      bathrooms: Number(l.bathrooms) || 1,
      condition: "good",
      source_url: String(l.source_url || l.url || ""),
      source_name: String(l.source || "Portal"),
      photos: [] as string[],
      created_at: l.created_at || new Date().toISOString(),
    }));

    const allListings = [...listings, ...externals];

    // Find comparables
    const comparables = findComparables(property, allListings, { maxResults: 10, maxDistanceKm: 3 });

    // Run AVM
    const valuation = calculateValuation(property, comparables);

    // Calculate market trends (using available data)
    const trends = calculateTrends(
      allListings.filter((l) => l.price > 0 && l.sqm > 0).map((l) => ({
        price: l.price, sqm: l.sqm, captured_at: l.created_at, status: "active",
      })),
      12
    );

    // Build AI Citations
    const citations: CMACitation[] = comparables.map((comp) => ({
      id: crypto.randomUUID(),
      data_type: "comparable" as const,
      source_url: comp.source_url,
      source_name: comp.source_name,
      claim_text: `${comp.address}: €${comp.price.toLocaleString()} (${comp.price_per_sqm}€/m²)`,
      value: String(comp.price),
      captured_at: comp.sold_date || new Date().toISOString(),
    }));

    // Get agency info
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, agency_name, email, phone, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    // Build report
    const report: CMAReport = {
      id: crypto.randomUUID(),
      property,
      valuation,
      comparables,
      market_trends: trends,
      citations,
      agency: {
        name: profile?.agency_name || profile?.full_name || "Agency",
        logo_url: profile?.avatar_url || null,
        agent_name: profile?.full_name || "Agent",
        agent_email: profile?.email || "",
        agent_phone: profile?.phone || "",
      },
      generated_at: new Date().toISOString(),
      pdf_url: null,
    };

    // Save report to database
    await supabase.from("cma_reports").insert({
      id: report.id,
      user_id: user.id,
      property_address: property.address,
      property_city: property.city,
      valuation_low: valuation.confidence_low,
      valuation_expected: valuation.estimated_value,
      valuation_high: valuation.confidence_high,
      confidence_score: valuation.confidence_score,
      comparables_count: comparables.length,
      methodology: valuation.methodology,
      report_data: report,
      status: "completed",
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("[CMA] Error:", error);
    return NextResponse.json({ error: "Failed to generate CMA" }, { status: 500 });
  }
}
