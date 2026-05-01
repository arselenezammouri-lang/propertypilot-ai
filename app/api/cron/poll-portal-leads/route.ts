// Portal Lead Polling — Vercel Cron
// Runs every 15 minutes. Polls each active portal connection for new leads.
// Saves to Supabase leads table with source attribution.
// vercel.json schedule: "every-15-min" => poll-portal-leads

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Vercel Cron handler — polls portal leads
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Get all active portal connections
  const { data: connections, error } = await supabase
    .from("portal_connections")
    .select("*")
    .eq("status", "active");

  if (error || !connections || connections.length === 0) {
    return NextResponse.json({
      message: "No active connections",
      connections: 0,
    });
  }

  let totalLeads = 0;
  let errors = 0;
  const results: Array<{ portal: string; userId: string; leadsFound: number; error?: string }> = [];

  for (const conn of connections) {
    try {
      // Determine since: last_sync_at or 1 hour ago
      const since = conn.last_sync_at
        ? new Date(conn.last_sync_at)
        : new Date(Date.now() - 60 * 60 * 1000);

      // Import adapter factory dynamically
      // In production, this would call the actual portal API
      // For now, we log the intent and skip the API call
      const portalId = conn.portal_id;
      const leadsFound = 0; // Placeholder until adapter APIs are connected

      // When adapter is connected:
      // const adapter = createAdapter(portalId, JSON.parse(decryptedCredentials));
      // const leads = await adapter.pollLeads(since);
      // for (const lead of leads) {
      //   await supabase.from("leads").upsert({
      //     user_id: conn.user_id,
      //     name: lead.name,
      //     email: lead.email,
      //     phone: lead.phone,
      //     source: `portal:${lead.portalId}`,
      //     notes: lead.message,
      //     stage: "new",
      //     score: 0,
      //     external_lead_id: lead.externalLeadId,
      //     portal_id: lead.portalId,
      //   }, { onConflict: "external_lead_id,portal_id" });
      // }

      // Update sync timestamp
      await supabase
        .from("portal_connections")
        .update({
          last_sync_at: new Date().toISOString(),
          leads_imported: (conn.leads_imported || 0) + leadsFound,
        })
        .eq("id", conn.id);

      totalLeads += leadsFound;
      results.push({ portal: portalId, userId: conn.user_id, leadsFound });
    } catch (err) {
      errors++;
      results.push({
        portal: conn.portal_id,
        userId: conn.user_id,
        leadsFound: 0,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    message: `Polled ${connections.length} connections`,
    totalLeads,
    errors,
    results,
  });
}
