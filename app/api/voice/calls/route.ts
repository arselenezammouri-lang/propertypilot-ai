import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { createCall, getCallStatus, getTranscript } from "@/lib/voice/bland-client";
import { buildCallRequest, type PathwayId, type VoiceLanguage } from "@/lib/voice/pathways";
import { z } from "zod";

export const dynamic = "force-dynamic";

const initiateSchema = z.object({
  phone: z.string().min(5),
  pathway: z.enum(["inbound-listing-inquiry", "outbound-new-lead-callback", "viewing-booking"]),
  language: z.enum(["it", "fr", "es", "de", "en", "pt"]).default("en"),
  leadId: z.string().uuid().optional(),
  context: z.object({
    agencyName: z.string().optional(),
    propertyTitle: z.string().optional(),
    propertyAddress: z.string().optional(),
    propertyPrice: z.string().optional(),
    leadName: z.string().optional(),
    leadEmail: z.string().optional(),
  }).optional(),
});

// GET — list user's calls
export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const offset = Number(searchParams.get("offset")) || 0;

  const { data: calls, error, count } = await supabase
    .from("calls")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 });
  return NextResponse.json({ calls: calls || [], total: count || 0 });
}

// POST — initiate outbound call
export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();
  const parsed = initiateSchema.parse(body);

  // Check voice minutes usage
  const { data: usage } = await supabase
    .from("usage_credits")
    .select("voice_minutes_used")
    .eq("user_id", user.id)
    .maybeSingle();

  const minutesUsed = usage?.voice_minutes_used || 0;
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  const plan = sub?.status || "free";
  const limits: Record<string, number> = { free: 0, starter: 60, pro: 300, agency: 1500 };
  const maxMinutes = limits[plan] ?? 0;

  if (maxMinutes === 0) {
    return NextResponse.json({ error: "Voice AI not available on Free plan. Upgrade to Starter." }, { status: 403 });
  }
  if (maxMinutes > 0 && minutesUsed >= maxMinutes) {
    return NextResponse.json({ error: `Voice minutes limit reached (${minutesUsed}/${maxMinutes}). Upgrade your plan.` }, { status: 429 });
  }

  // Build the call request
  const callRequest = buildCallRequest(
    parsed.pathway as PathwayId,
    parsed.phone,
    parsed.language as VoiceLanguage,
    parsed.context || {}
  );

  // Initiate the call via Bland AI
  const blandResult = await createCall({
    phone_number: callRequest.phone_number,
    task: callRequest.task,
    first_sentence: callRequest.first_sentence,
    voice: callRequest.voice,
    language: callRequest.language,
    max_duration: callRequest.max_duration,
    metadata: { ...callRequest.metadata, user_id: user.id },
  });

  // Save call record
  const { data: callRecord } = await supabase
    .from("calls")
    .insert({
      user_id: user.id,
      lead_id: parsed.leadId || null,
      bland_call_id: blandResult.call_id,
      pathway: parsed.pathway,
      language: parsed.language,
      phone_number: parsed.phone,
      status: "initiated",
      direction: "outbound",
    })
    .select("id")
    .single();

  return NextResponse.json({
    success: true,
    callId: blandResult.call_id,
    recordId: callRecord?.id,
    status: "initiated",
  });
}

// PATCH — update call notes/outcome
export async function PATCH(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();
  const callId = body.callId as string;
  if (!callId) return NextResponse.json({ error: "callId required" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (body.notes) updates.notes = body.notes;
  if (body.outcome) updates.outcome = body.outcome;

  // If requesting transcript refresh from Bland
  if (body.refreshTranscript) {
    try {
      const transcript = await getTranscript(callId);
      updates.transcript = transcript.concatenated_transcript;
      updates.summary = transcript.summary;
    } catch { /* Transcript not ready yet */ }

    try {
      const status = await getCallStatus(callId);
      updates.status = status.status;
      updates.duration_seconds = status.duration;
      updates.recording_url = status.recording_url;
    } catch { /* Status not available */ }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  await supabase
    .from("calls")
    .update(updates)
    .eq("bland_call_id", callId)
    .eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
