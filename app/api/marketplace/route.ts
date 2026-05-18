/**
 * Marketplace API — List, search, and match cross-border properties
 * GET: Browse marketplace | POST: List property on marketplace
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { z } from "zod";

export const dynamic = "force-dynamic";

const listPropertySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  price: z.number().positive(),
  currency: z.string().default("EUR"),
  country: z.string().length(2),
  city: z.string().min(1),
  property_type: z.string(),
  sqm: z.number().positive(),
  rooms: z.number().positive(),
  photos: z.array(z.string()).default([]),
  languages_available: z.array(z.string()).default(["en"]),
  commission_rate: z.number().min(0).max(10).default(3),
  cross_border: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const country = url.searchParams.get("country");
    const minPrice = url.searchParams.get("min_price");
    const maxPrice = url.searchParams.get("max_price");
    const propertyType = url.searchParams.get("property_type");
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20", 10), 50);
    const offset = (page - 1) * limit;

    // Public endpoint — no auth required for browsing
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    let query = supabase
      .from("marketplace_listings")
      .select("*", { count: "exact" })
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (country) query = query.eq("country", country);
    if (minPrice) query = query.gte("price", parseInt(minPrice));
    if (maxPrice) query = query.lte("price", parseInt(maxPrice));
    if (propertyType) query = query.eq("property_type", propertyType);

    const { data, count } = await query;

    return NextResponse.json({
      listings: data ?? [],
      total: count ?? 0,
      page,
      limit,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const parsed = listPropertySchema.parse(body);

    const { data, error } = await supabase
      .from("marketplace_listings")
      .insert({
        agent_user_id: user.id,
        ...parsed,
        status: "active",
      })
      .select("id, title, status, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to list property" }, { status: 500 });
    }

    return NextResponse.json({ listing: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map((e) => e.message).join(", ")
      : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
