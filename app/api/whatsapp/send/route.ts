import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/auth-helper";
import { sendMessage, sendTemplate } from "@/lib/whatsapp/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const sendSchema = z.object({
  phone: z.string().min(5),
  message: z.string().min(1).max(4096).optional(),
  templateName: z.string().optional(),
  templateLanguage: z.string().default("en"),
  templateParams: z.array(z.string()).optional(),
});

// GET — list user's WhatsApp conversations
export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);

  let query = supabase
    .from("whatsapp_conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("last_message_at", { ascending: false })
    .limit(limit);

  if (filter === "ai") query = query.eq("ai_handled", true);
  if (filter === "human") query = query.eq("ai_handled", false);
  if (filter === "active") query = query.eq("status", "active");

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  return NextResponse.json({ conversations: data || [] });
}

// POST — send manual message
export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) return auth.response;
  const { user, supabase } = auth;

  const body = await request.json();
  const parsed = sendSchema.parse(body);

  if (parsed.templateName) {
    // Send template message
    const components = parsed.templateParams?.length
      ? [{ type: "body", parameters: parsed.templateParams.map((t) => ({ type: "text" as const, text: t })) }]
      : [];
    await sendTemplate(parsed.phone, parsed.templateName, parsed.templateLanguage, components);
  } else if (parsed.message) {
    await sendMessage(parsed.phone, parsed.message);
  } else {
    return NextResponse.json({ error: "Provide message or templateName" }, { status: 400 });
  }

  // Find/create conversation and log message
  const { data: conv } = await supabase
    .from("whatsapp_conversations")
    .select("id")
    .eq("user_id", user.id)
    .eq("contact_phone", parsed.phone)
    .maybeSingle();

  if (conv) {
    await supabase.from("whatsapp_messages").insert({
      conversation_id: conv.id, direction: "outbound",
      message_type: parsed.templateName ? "template" : "text",
      content: parsed.message || `Template: ${parsed.templateName}`, status: "sent",
    });
    await supabase.from("whatsapp_conversations").update({
      last_message: (parsed.message || `Template: ${parsed.templateName}`).substring(0, 500),
      last_message_at: new Date().toISOString(),
    }).eq("id", conv.id);
  }

  return NextResponse.json({ success: true });
}
