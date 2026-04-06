import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const allowedFields = [
      "agency_name",
      "agency_slug",
      "bio",
      "city",
      "country",
      "website",
      "phone",
      "is_public",
    ];

    const update: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        update[field] = body[field];
      }
    }

    // Validate slug format
    if (update.agency_slug) {
      const slug = String(update.agency_slug);
      if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 50) {
        return NextResponse.json(
          { error: "Slug must be lowercase letters, numbers, and hyphens only (max 50 chars)" },
          { status: 400 }
        );
      }

      // Check slug uniqueness
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("agency_slug", slug)
        .neq("id", user.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "This URL slug is already taken. Try a different one." },
          { status: 409 }
        );
      }
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Could not update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
