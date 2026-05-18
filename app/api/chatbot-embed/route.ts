/**
 * Embeddable AI Chatbot — Script tag agencies add to their website
 * POST /api/chatbot-embed: Handle chat messages from embedded widget
 * GET /api/chatbot-embed: Return widget configuration
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createOpenAIWithTimeout } from "@/lib/utils/openai-retry";
import { z } from "zod";

export const dynamic = "force-dynamic";

const chatSchema = z.object({
  agency_id: z.string().uuid(),
  message: z.string().min(1).max(2000),
  session_id: z.string(),
  visitor_name: z.string().optional(),
  visitor_email: z.string().email().optional(),
  language: z.string().default("auto"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = chatSchema.parse(body);

    const supabase = await createClient();

    // Get agency info for context
    const { data: agency } = await supabase
      .from("profiles")
      .select("full_name, agency_name")
      .eq("id", parsed.agency_id)
      .single();

    const agencyName = agency?.agency_name ?? "the agency";

    const openai = createOpenAIWithTimeout();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for ${agencyName}, a European real estate agency. 
You help website visitors with property inquiries, viewing bookings, and general questions.
Be professional, helpful, and concise. Respond in the visitor's language.
If they want to schedule a viewing or share contact info, collect their name, email, phone and preferred dates.
Never invent property details — only share what you know from the agency's listings.`,
        },
        { role: "user", content: parsed.message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = response.choices[0]?.message?.content ?? "I'm sorry, I couldn't process your request. Please contact the agency directly.";

    // Log conversation for CRM
    try {
      await supabase.from("chatbot_conversations").insert({
        agency_user_id: parsed.agency_id,
        session_id: parsed.session_id,
        visitor_name: parsed.visitor_name ?? null,
        visitor_email: parsed.visitor_email ?? null,
        message: parsed.message,
        reply,
        language: parsed.language,
      });
    } catch {
      // Silent fail — don't block response
    }

    return NextResponse.json({ reply, session_id: parsed.session_id });
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map((e) => e.message).join(", ")
      : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** GET: Return embeddable widget script config */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const agencyId = url.searchParams.get("agency_id");

  if (!agencyId) {
    return NextResponse.json({ error: "agency_id required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: branding } = await supabase
    .from("agency_branding")
    .select("agency_name, primary_color, logo_url")
    .eq("user_id", agencyId)
    .single();

  return NextResponse.json({
    agency_id: agencyId,
    agency_name: branding?.agency_name ?? "Agency",
    primary_color: branding?.primary_color ?? "#6366f1",
    logo_url: branding?.logo_url ?? null,
    embed_script: `<script src="https://propertypilot-ai.vercel.app/chatbot-widget.js" data-agency-id="${agencyId}"></script>`,
  });
}
