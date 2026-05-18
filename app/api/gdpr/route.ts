/**
 * GDPR API — DSAR requests, consent management, data export
 * POST: Create DSAR request or update consent
 * GET: List DSAR requests + export user data
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { calculateDeadline } from "@/lib/gdpr/types";
import type { DSARType, ConsentType } from "@/lib/gdpr/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

const dsarSchema = z.object({
  action: z.enum(["create_dsar", "update_consent", "export_data"]),
  request_type: z.enum(["access", "deletion", "rectification", "portability", "restriction"]).optional(),
  consent_type: z.enum(["marketing_email", "marketing_sms", "marketing_whatsapp", "data_processing", "analytics", "third_party_sharing"]).optional(),
  granted: z.boolean().optional(),
  requester_email: z.string().email().optional(),
  requester_name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const parsed = dsarSchema.parse(body);

    switch (parsed.action) {
      case "create_dsar": {
        if (!parsed.request_type) {
          return NextResponse.json({ error: "request_type required" }, { status: 400 });
        }
        const deadline = calculateDeadline(new Date());
        const { data, error } = await supabase
          .from("gdpr_dsar_requests")
          .insert({
            user_id: user.id,
            requester_email: parsed.requester_email ?? user.email,
            requester_name: parsed.requester_name ?? "",
            request_type: parsed.request_type,
            status: "received",
            deadline,
          })
          .select("id, status, deadline, created_at")
          .single();

        if (error) return NextResponse.json({ error: "Failed to create DSAR" }, { status: 500 });
        return NextResponse.json({ dsar: data }, { status: 201 });
      }

      case "update_consent": {
        if (!parsed.consent_type || parsed.granted === undefined) {
          return NextResponse.json({ error: "consent_type and granted required" }, { status: 400 });
        }
        const ip = request.headers.get("x-forwarded-for") ?? "unknown";
        const ua = request.headers.get("user-agent") ?? "unknown";

        const { error } = await supabase.from("gdpr_consents").upsert({
          user_id: user.id,
          consent_type: parsed.consent_type,
          granted: parsed.granted,
          ip_address: ip,
          user_agent: ua,
          source: "dashboard",
          ...(parsed.granted ? { granted_at: new Date().toISOString() } : { revoked_at: new Date().toISOString() }),
        }, { onConflict: "user_id,consent_type" });

        if (error) return NextResponse.json({ error: "Failed to update consent" }, { status: 500 });
        return NextResponse.json({ updated: true });
      }

      case "export_data": {
        // Gather all user data
        const [profileRes, leadsRes, listingsRes, consentsRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("leads").select("*").eq("user_id", user.id),
          supabase.from("saved_listings").select("id, title, property_data, created_at").eq("user_id", user.id),
          supabase.from("gdpr_consents").select("*").eq("user_id", user.id),
        ]);

        return NextResponse.json({
          export: {
            profile: profileRes.data ?? {},
            leads: leadsRes.data ?? [],
            listings: listingsRes.data ?? [],
            consents: consentsRes.data ?? [],
            export_date: new Date().toISOString(),
            format: "json",
          },
        });
      }
    }
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map((e) => e.message).join(", ")
      : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const [dsarRes, consentsRes] = await Promise.all([
      supabase.from("gdpr_dsar_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("gdpr_consents").select("*").eq("user_id", user.id),
    ]);

    return NextResponse.json({
      dsar_requests: dsarRes.data ?? [],
      consents: consentsRes.data ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
