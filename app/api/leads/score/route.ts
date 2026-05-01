import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { scoreLead } from "@/lib/ai/fast-lead-scoring";
import { z } from "zod";

export const dynamic = "force-dynamic";

const singleSchema = z.object({ leadId: z.string().uuid() });
const bulkSchema = z.object({ all: z.literal(true) });

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();

  // Bulk re-score all leads
  if (body.all === true) {
    const { data: leads, error } = await supabase
      .from("leads")
      .select("id, email, telefono, status, created_at")
      .eq("user_id", user.id);

    if (error || !leads) {
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }

    let updated = 0;
    for (const lead of leads) {
      const result = scoreLead({
        source: "website",
        email: lead.email || null,
        phone: lead.telefono || null,
        message: null,
        createdAt: lead.created_at,
      });

      await supabase
        .from("leads")
        .update({ lead_score: result.score })
        .eq("id", lead.id)
        .eq("user_id", user.id);

      updated++;
    }

    return NextResponse.json({ success: true, scored: updated });
  }

  // Single lead score
  const parsed = singleSchema.parse(body);

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", parsed.leadId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const result = scoreLead({
    source: "website",
    email: lead.email || null,
    phone: lead.telefono || null,
    message: null,
    createdAt: lead.created_at,
  });

  await supabase
    .from("leads")
    .update({ lead_score: result.score })
    .eq("id", parsed.leadId)
    .eq("user_id", user.id);

  return NextResponse.json({
    success: true,
    score: result.score,
    category: result.category,
    badge: result.badge,
    factors: result.factors,
  });
}
