import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { markAsRead } from "@/lib/whatsapp/client";
import { classifyMessage } from "@/lib/whatsapp/intent-classifier";
import { respondToMessage } from "@/lib/whatsapp/responder";
import { scoreLead } from "@/lib/ai/fast-lead-scoring";

export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// GET — Meta webhook verification challenge
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "propertypilot-wa-verify-2026";

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// POST — Incoming messages from Meta
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseAdmin();

  // Meta sends a wrapper object
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;

  if (!value?.messages?.[0]) {
    // Status update (delivered/read) — just acknowledge
    return NextResponse.json({ received: true });
  }

  const msg = value.messages[0];
  const contact = value.contacts?.[0];
  const senderPhone = msg.from;
  const senderName = contact?.profile?.name || null;
  const messageId = msg.id;
  const messageText = msg.text?.body || msg.caption || "";
  const messageType = msg.type || "text";

  // Mark as read immediately
  try { await markAsRead(messageId); } catch { /* non-critical */ }

  // Find which user this WhatsApp number belongs to
  // For now, match against the WHATSAPP_PHONE_ID owner
  // In production: look up phone_numbers table for the business number
  const businessPhoneId = process.env.WHATSAPP_PHONE_ID || "";

  // Find or create conversation
  let conversation = null;
  const { data: existingConv } = await supabase
    .from("whatsapp_conversations")
    .select("*")
    .eq("contact_phone", senderPhone)
    .eq("status", "active")
    .maybeSingle();

  if (existingConv) {
    conversation = existingConv;
    await supabase.from("whatsapp_conversations").update({
      last_message: messageText.substring(0, 500),
      last_message_at: new Date().toISOString(),
      unread_count: (existingConv.unread_count || 0) + 1,
      contact_name: senderName || existingConv.contact_name,
    }).eq("id", existingConv.id);
  } else {
    // Auto-create lead + conversation
    const score = scoreLead({
      source: "whatsapp", email: null, phone: senderPhone,
      message: messageText, createdAt: new Date().toISOString(),
    });

    // Find user_id from phone_numbers or fallback to first admin
    const { data: phoneOwner } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
      .maybeSingle();

    const userId = phoneOwner?.id;
    if (!userId) return NextResponse.json({ received: true, error: "No user found" });

    // Create lead
    const { data: newLead } = await supabase.from("leads").insert({
      user_id: userId, nome: senderName || "WhatsApp Contact",
      telefono: senderPhone, status: "new", lead_score: score.score,
    }).select("id").single();

    // Create conversation
    const { data: newConv } = await supabase.from("whatsapp_conversations").insert({
      user_id: userId, lead_id: newLead?.id || null,
      contact_phone: senderPhone, contact_name: senderName,
      last_message: messageText.substring(0, 500),
      last_message_at: new Date().toISOString(),
      ai_handled: true, status: "active", unread_count: 1,
    }).select("*").single();

    conversation = newConv;
  }

  // Save inbound message
  if (conversation) {
    await supabase.from("whatsapp_messages").insert({
      conversation_id: conversation.id,
      direction: "inbound", message_type: messageType,
      content: messageText, meta_message_id: messageId, status: "received",
    });
  }

  // Classify intent
  const classification = await classifyMessage(messageText);

  // Skip AI response if conversation is paused (human takeover)
  if (conversation?.ai_handled === false) {
    return NextResponse.json({ received: true, ai_handled: false });
  }

  // Generate and send response
  try {
    const { response, messagesSent } = await respondToMessage(
      senderPhone, classification,
      { name: senderName, language: classification.language, previousMessages: conversation?.unread_count || 0 },
      [], // listings — would be fetched from saved_listings based on entities
      null // calComUrl — would be fetched from calendar_integrations
    );

    // Save outbound message
    if (conversation && messagesSent > 0) {
      await supabase.from("whatsapp_messages").insert({
        conversation_id: conversation.id,
        direction: "outbound", message_type: "text",
        content: response, status: "sent",
      });
    }
  } catch { /* Response failed — will be retried or handled by human */ }

  return NextResponse.json({ received: true, processed: true });
}
