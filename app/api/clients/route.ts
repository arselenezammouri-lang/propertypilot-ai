/**
 * Client Portal API — Manage clients and their assigned listings
 * GET: List clients | POST: Create client | PATCH: Update client
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createClientSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  budget_min: z.number().min(0).optional(),
  budget_max: z.number().min(0).optional(),
  preferred_zones: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20", 10), 50);
    const offset = (page - 1) * limit;

    const { data: clients, count } = await supabase
      .from("clients")
      .select("*, client_assigned_listings(listing_id)", { count: "exact" })
      .eq("agency_user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return NextResponse.json({
      clients: clients ?? [],
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
    const parsed = createClientSchema.parse(body);

    const { data, error } = await supabase
      .from("clients")
      .insert({
        agency_user_id: user.id,
        ...parsed,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
    }

    return NextResponse.json({ client: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map((e) => e.message).join(", ")
      : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
