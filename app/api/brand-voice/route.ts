import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  tone: z.enum(["professional", "friendly", "luxury", "casual", "authoritative"]),
  style_keywords: z.array(z.string().min(1).max(50)).min(1).max(20),
  example_text: z.string().max(5000).default(""),
  is_default: z.boolean().default(false),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  tone: z.enum(["professional", "friendly", "luxury", "casual", "authoritative"]).optional(),
  style_keywords: z.array(z.string().min(1).max(50)).min(1).max(20).optional(),
  example_text: z.string().max(5000).optional(),
  is_default: z.boolean().optional(),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

// GET — list user's brand voice profiles
export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const { data, error } = await supabase
    .from("brand_voice_profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }

  return NextResponse.json({ profiles: data || [] });
}

// POST — create new brand voice profile
export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();
  const parsed = createSchema.parse(body);

  // Max 10 profiles per user
  const { count } = await supabase
    .from("brand_voice_profiles")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count || 0) >= 10) {
    return NextResponse.json({ error: "Maximum 10 brand voice profiles allowed" }, { status: 400 });
  }

  // If marking as default, unset others first
  if (parsed.is_default) {
    await supabase
      .from("brand_voice_profiles")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);
  }

  const { data, error } = await supabase
    .from("brand_voice_profiles")
    .insert({
      user_id: user.id,
      name: parsed.name,
      tone: parsed.tone,
      style_keywords: parsed.style_keywords,
      example_text: parsed.example_text,
      is_default: parsed.is_default,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }

  return NextResponse.json({ success: true, profile: data });
}

// PATCH — update existing profile
export async function PATCH(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();
  const parsed = updateSchema.parse(body);
  const { id, ...updates } = parsed;

  // Verify ownership
  const { data: existing } = await supabase
    .from("brand_voice_profiles")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // If marking as default, unset others first
  if (updates.is_default) {
    await supabase
      .from("brand_voice_profiles")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);
  }

  const { data, error } = await supabase
    .from("brand_voice_profiles")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({ success: true, profile: data });
}

// DELETE — remove profile
export async function DELETE(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();
  const parsed = deleteSchema.parse(body);

  // Check if it's the default — don't allow deletion of default
  const { data: existing } = await supabase
    .from("brand_voice_profiles")
    .select("id, is_default")
    .eq("id", parsed.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (existing.is_default) {
    return NextResponse.json({ error: "Cannot delete the default profile. Set another profile as default first." }, { status: 400 });
  }

  const { error } = await supabase
    .from("brand_voice_profiles")
    .delete()
    .eq("id", parsed.id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
