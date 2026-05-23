// Portal Lead Polling — Vercel Cron
// Runs every 15 minutes. Polls each active portal connection for new leads.
// Saves to Supabase leads table with source attribution.
// After save: runs Lead Scoring v2 → triggers Speed-to-Lead automation
// vercel.json schedule: "every-15-min" => poll-portal-leads

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateLeadScoreV2 } from "@/lib/ai/lead-scoring-v2";
import type { LeadSignals } from "@/lib/ai/lead-scoring-v2";
import { determineAction, canExecuteAction, isWithinBusinessHours, getDefaultConfig } from "@/lib/automation/speed-to-lead";

export const dynamic = "force-dynamic";

// Vercel Cron handler — polls portal leads
export async function GET(request: NextRequest) {
  // Verify Vercel Cron authorization
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

      // Auto-scoring note: When real leads arrive, score them before insert:
      // import { scoreLead } from "@/lib/ai/fast-lead-scoring";
      // for (const lead of polledLeads) {
      //   const score = scoreLead({
      //     source: `portal:${portalId}`,
      //     email: lead.email, phone: lead.phone,
      //     message: lead.message, createdAt: lead.receivedAt,
      //   });
      //   await supabase.from("leads").upsert({
      //     ...lead, lead_score: score.score, user_id: conn.user_id,
      //   });
      // }

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

  // ─── Speed-to-Lead: Score new leads + trigger automations ────
  // Fetch all new/unscored leads from the last 15 minutes
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { data: newLeads } = await supabase
    .from("leads")
    .select("id, user_id, name, email, phone, source, notes, created_at, score")
    .gte("created_at", fifteenMinAgo)
    .or("score.is.null,score.eq.0");

  let automationsTriggered = 0;

  for (const lead of newLeads ?? []) {
    try {
      // Build lead signals from available data
      const signals: LeadSignals = {
        source: lead.source?.startsWith("portal:") ? "portal" : "website",
        first_contact_at: lead.created_at,
        last_activity_at: lead.created_at,
        messages_sent: lead.notes ? 1 : 0,
        messages_received: 0,
        viewings_booked: 0,
        viewings_attended: 0,
        documents_requested: 0,
        listings_viewed: 0,
        time_on_site_seconds: 0,
        pages_visited: 0,
        has_mortgage_preapproval: false,
        budget_declared: false,
        timeline: "exploring",
        is_investor: false,
        is_first_time_buyer: false,
        opened_last_email: false,
        clicked_email_link: false,
        visited_pricing_page: false,
        downloaded_brochure: false,
        requested_callback: !!lead.phone,
        left_voicemail: false,
      };

      const scoreResult = calculateLeadScoreV2(signals);

      // Update lead score
      await supabase
        .from("leads")
        .update({ score: scoreResult.score })
        .eq("id", lead.id);

      // Save score to v2 table
      await supabase.from("lead_scores_v2").insert({
        user_id: lead.user_id,
        lead_id: lead.id,
        score: scoreResult.score,
        category: scoreResult.category,
        confidence: scoreResult.confidence,
        breakdown: scoreResult.breakdown,
        feature_vector: scoreResult.feature_vector,
        speed_to_lead_action: scoreResult.speed_to_lead_trigger,
      });

      // Check automation config and trigger action
      if (scoreResult.speed_to_lead_trigger && scoreResult.speed_to_lead_trigger !== "none") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_plan")
          .eq("id", lead.user_id)
          .single();

        const plan = profile?.subscription_plan ?? "free";
        const config = getDefaultConfig(lead.user_id, plan);

        if (config.enabled && isWithinBusinessHours(config)) {
          const action = determineAction(scoreResult.score, config);
          const { allowed } = canExecuteAction(action, plan, 0);

          if (allowed) {
            await supabase.from("automation_runs").insert({
              user_id: lead.user_id,
              lead_id: lead.id,
              action,
              score: scoreResult.score,
              status: "triggered",
              metadata: { breakdown: scoreResult.breakdown, recommended: scoreResult.recommended_action },
            });
            automationsTriggered++;
          }
        }
      }
    } catch {
      // Skip individual lead errors
    }
  }

  return NextResponse.json({
    message: `Polled ${connections.length} connections`,
    totalLeads,
    errors,
    results,
    scoring: {
      leads_scored: newLeads?.length ?? 0,
      automations_triggered: automationsTriggered,
    },
  });
}
