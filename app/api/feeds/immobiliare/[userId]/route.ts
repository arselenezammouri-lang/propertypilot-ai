import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateImmobiliareXML } from "@/lib/portals/adapters/immobiliare";

export const dynamic = "force-dynamic";

/**
 * GET /api/feeds/immobiliare/[userId].xml
 *
 * Serves an Immobiliare.it-compliant XML feed for a specific user.
 * Immobiliare.it's crawler pulls this URL periodically.
 * The agency registers this URL in their Immobiliare.it backoffice.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId: rawUserId } = await params;
  const userId = rawUserId.replace(".xml", "");

  if (!userId || userId.length < 10) {
    return new NextResponse("<error>Invalid user ID</error>", {
      status: 400,
      headers: { "Content-Type": "application/xml" },
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return new NextResponse("<error>Server misconfigured</error>", {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, agency_name, email, phone")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    return new NextResponse("<error>User not found</error>", {
      status: 404,
      headers: { "Content-Type": "application/xml" },
    });
  }

  // Get user's saved listings that should be published to Immobiliare.it
  const { data: listings } = await supabase
    .from("saved_listings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(500);

  const xmlListings = (listings || []).map((l) => {
    const pd = (l.property_data || {}) as Record<string, unknown>;
    const gc = (l.generated_content || {}) as Record<string, string>;
    return {
      id: String(l.id),
      title: l.title || String(gc.professional || "").substring(0, 100),
      description: String(gc.professional || gc.short || l.title || ""),
      propertyType: String(pd.propertyType || "Appartamento"),
      transactionType: "vendita" as const,
      price: Number(pd.price) || 0,
      surface: Number(pd.size || pd.surface) || 0,
      rooms: Number(pd.rooms) || 0,
      bathrooms: Number(pd.bathrooms) || 1,
      floor: pd.floor ? Number(pd.floor) : null,
      totalFloors: pd.totalFloors ? Number(pd.totalFloors) : null,
      energyClass: pd.energyClass ? String(pd.energyClass) : null,
      address: {
        city: String(pd.location || pd.city || ""),
        province: "",
        postalCode: "",
        country: "IT",
      },
      features: pd.features
        ? String(pd.features).split(",").map((f: string) => f.trim())
        : [],
      images: [] as string[],
      agentName: profile.full_name || profile.agency_name || "Agent",
      agentEmail: profile.email || "",
      agentPhone: profile.phone || "",
    };
  });

  const xml = generateImmobiliareXML(
    xmlListings,
    profile.agency_name || profile.full_name || "PropertyPilot Agency",
    profile.email || ""
  );

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900", // 15 min cache
      "X-Feed-Version": "3.0",
      "X-Listings-Count": String(xmlListings.length),
    },
  });
}
