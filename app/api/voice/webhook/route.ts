// Bland AI Webhook — receives call_ended, call_failed, recording_ready events
// Saves transcript + summary + outcome to calls table
// Triggers next CRM action (update lead, log activity)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseAdmin();

  const callId = body.call_id || body.callId;
  const status = body.status || body.event;

  if (!callId) {
    return NextResponse.json({ error: "Missing call_id" }, { status: 400 });
  }

  // Find our call record
  const { data: call } = await supabase
    .from("calls")
    .select("id, user_id, lead_id")
    .eq("bland_call_id", callId)
    .maybeSingle();

  if (!call) {
    return NextResponse.json({ received: true, matched: false });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  // Process based on event type
  if (status === "completed" || status === "call_ended" || body.completed) {
    updates.status = "completed";
    updates.duration_seconds = body.call_length || body.duration || 0;
    updates.transcript = body.concatenated_transcript || body.transcript || null;
    updates.summary = body.summary || null;
    updates.recording_url = body.recording_url || null;

    // Extract outcome from summary
    const summary = (body.summary || "").toLowerCase();
    if (summary.includes("booked") || summary.includes("prenotato") || summary.includes("réservé")) {
      updates.outcome = "viewing_booked";
    } else if (summary.includes("interested") || summary.includes("interessato") || summary.includes("intéressé")) {
      updates.outcome = "interested";
    } else if (summary.includes("not interested") || summary.includes("non interessato")) {
      updates.outcome = "not_interested";
    } else if (summary.includes("callback") || summary.includes("richiamare")) {
      updates.outcome = "callback_requested";
    } else {
      updates.outcome = "completed";
    }

    // Update voice minutes usage
    const durationMinutes = Math.ceil((body.call_length || body.duration || 0) / 60);
    if (durationMinutes > 0) {
      try {
        await supabase.rpc("increment_voice_minutes", {
          p_user_id: call.user_id,
          p_minutes: durationMinutes,
        });
      } catch {
        // Fallback: direct upsert
        await supabase
          .from("usage_credits")
          .upsert({
            user_id: call.user_id,
            voice_minutes_used: durationMinutes,
          }, { onConflict: "user_id" });
      }
    }

    // Log CRM activity if lead_id exists
    if (call.lead_id) {
      await supabase.from("activities").insert({
        user_id: call.user_id,
        lead_id: call.lead_id,
        type: "voice_call_completed",
        payload: {
          call_id: callId,
          duration: durationMinutes,
          outcome: updates.outcome,
          summary: updates.summary,
        },
      });

      // Update lead stage based on outcome
      if (updates.outcome === "viewing_booked") {
        await supabase.from("leads").update({ status: "contacted" }).eq("id", call.lead_id).then(() => {});
      }
    }
  }

  if (status === "failed" || status === "call_failed" || status === "no-answer") {
    updates.status = status === "no-answer" ? "no_answer" : "failed";
    updates.outcome = status === "no-answer" ? "no_answer" : "failed";
  }

  // Update call record
  await supabase.from("calls").update(updates).eq("id", call.id);

  return NextResponse.json({ received: true, processed: true });
}
