// Twilio Inbound Call Webhook — routes incoming calls to Bland AI pathways

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createCall } from "@/lib/voice/bland-client";
import { PATHWAYS, VOICE_MAP, type VoiceLanguage } from "@/lib/voice/pathways";

export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// Twilio sends form-encoded POST
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const calledNumber = formData.get("Called") as string || formData.get("To") as string || "";
  const callerNumber = formData.get("Caller") as string || formData.get("From") as string || "";

  const supabase = getSupabaseAdmin();

  // Find which user owns this number
  const { data: phoneRecord } = await supabase
    .from("phone_numbers")
    .select("user_id, country")
    .eq("number", calledNumber)
    .maybeSingle();

  if (!phoneRecord) {
    // Unknown number — return TwiML with a message
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Thank you for calling. This number is not configured.</Say></Response>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }

  // Determine language from the phone number's country
  const countryToLang: Record<string, VoiceLanguage> = {
    IT: "it", FR: "fr", ES: "es", DE: "de", GB: "en", PT: "pt", US: "en",
  };
  const language = countryToLang[phoneRecord.country] || "en";

  // Forward to Bland AI for the inbound pathway
  try {
    const pathway = PATHWAYS["inbound-listing-inquiry"];

    await createCall({
      phone_number: callerNumber,
      task: pathway.task,
      first_sentence: pathway.first_sentence[language] || pathway.first_sentence.en,
      voice: VOICE_MAP[language]?.voiceId || VOICE_MAP.en.voiceId,
      language,
      max_duration: pathway.max_duration,
      metadata: {
        pathway_id: "inbound-listing-inquiry",
        user_id: phoneRecord.user_id,
        inbound_number: calledNumber,
        caller_number: callerNumber,
      },
    });

    // Save call record
    await supabase.from("calls").insert({
      user_id: phoneRecord.user_id,
      bland_call_id: `inbound-${Date.now()}`,
      pathway: "inbound-listing-inquiry",
      language,
      phone_number: callerNumber,
      status: "initiated",
      direction: "inbound",
    });

    // Return TwiML to connect the call
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Say language="${language}">Please hold while I connect you to our AI assistant.</Say><Pause length="2"/></Response>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  } catch {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Say>We are experiencing technical difficulties. Please try again later.</Say></Response>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }
}
