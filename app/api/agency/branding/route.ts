/**
 * Agency Branding API — Get/update agency branding for white-label portals
 * GET: Fetch current branding
 * PUT: Update branding (Agency plan only)
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { z } from "zod";

export const dynamic = "force-dynamic";

const brandingSchema = z.object({
  agency_name: z.string().min(1).max(100).optional(),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
  logo_url: z.string().url().nullable().optional(),
  favicon_url: z.string().url().nullable().optional(),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  text_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  font_family: z.string().max(200).optional(),
  custom_domain: z.string().max(255).nullable().optional(),
  footer_text: z.string().max(500).nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  contact_phone: z.string().max(30).nullable().optional(),
  social_links: z.record(z.string()).optional(),
});

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const { data } = await supabase
      .from("agency_branding")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({ branding: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    // Check Agency plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_plan !== "agency") {
      return NextResponse.json(
        { error: "White-label branding requires the Agency plan" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = brandingSchema.parse(body);

    // Upsert branding
    const { data, error } = await supabase
      .from("agency_branding")
      .upsert(
        { user_id: user.id, ...parsed, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      )
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update branding" }, { status: 500 });
    }

    return NextResponse.json({ branding: data });
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map((e) => e.message).join(", ")
      : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
