/**
 * WhatsApp Cloud API Client — Meta Business Platform
 * https://developers.facebook.com/docs/whatsapp/cloud-api
 *
 * Required env vars:
 *   WHATSAPP_BUSINESS_TOKEN — Bearer token from Meta Business
 *   WHATSAPP_PHONE_ID — Phone number ID from Meta dashboard
 */

const WA_BASE = "https://graph.facebook.com/v20.0";

function getConfig() {
  const token = process.env.WHATSAPP_BUSINESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) throw new Error("WHATSAPP_BUSINESS_TOKEN or WHATSAPP_PHONE_ID not configured");
  return { token, phoneId };
}

function headers(): Record<string, string> {
  return { Authorization: `Bearer ${getConfig().token}`, "Content-Type": "application/json" };
}

/* ─── Types ─── */

export interface WAMessageResponse {
  messaging_product: string;
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

export interface WAListingCard {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  url: string;
}

/* ─── Send Methods ─── */

export async function sendMessage(phone: string, text: string): Promise<WAMessageResponse> {
  const { phoneId } = getConfig();
  const res = await fetch(`${WA_BASE}/${phoneId}/messages`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone.replace(/[^0-9]/g, ""),
      type: "text",
      text: { body: text },
    }),
  });
  if (!res.ok) throw new Error(`WhatsApp send failed: ${res.status} ${await res.text()}`);
  return await res.json();
}

export async function sendListingCarousel(phone: string, listings: WAListingCard[]): Promise<WAMessageResponse> {
  const { phoneId } = getConfig();

  // WhatsApp interactive list message (up to 10 items)
  const sections = [{
    title: "Properties",
    rows: listings.slice(0, 10).map((l, i) => ({
      id: `listing_${i}`,
      title: l.title.substring(0, 24),
      description: `${l.price} · ${l.description}`.substring(0, 72),
    })),
  }];

  const res = await fetch(`${WA_BASE}/${phoneId}/messages`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone.replace(/[^0-9]/g, ""),
      type: "interactive",
      interactive: {
        type: "list",
        header: { type: "text", text: "🏠 Matching Properties" },
        body: { text: `We found ${listings.length} properties matching your criteria:` },
        footer: { text: "Tap to see details" },
        action: { button: "View Properties", sections },
      },
    }),
  });
  if (!res.ok) throw new Error(`WhatsApp carousel failed: ${res.status}`);
  return await res.json();
}

export async function sendBookingLink(phone: string, calUrl: string, propertyTitle: string): Promise<WAMessageResponse> {
  return sendMessage(phone,
    `📅 *Book a Viewing*\n\n` +
    `Property: ${propertyTitle}\n\n` +
    `Choose your preferred time slot:\n${calUrl}\n\n` +
    `The booking is confirmed instantly. See you there! 🏠`
  );
}

export async function sendTemplate(
  phone: string,
  templateName: string,
  language: string,
  components: Array<{ type: string; parameters: Array<{ type: string; text?: string; image?: { link: string } }> }>
): Promise<WAMessageResponse> {
  const { phoneId } = getConfig();
  const res = await fetch(`${WA_BASE}/${phoneId}/messages`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone.replace(/[^0-9]/g, ""),
      type: "template",
      template: {
        name: templateName,
        language: { code: language },
        components,
      },
    }),
  });
  if (!res.ok) throw new Error(`WhatsApp template failed: ${res.status}`);
  return await res.json();
}

export async function markAsRead(messageId: string): Promise<void> {
  const { phoneId } = getConfig();
  await fetch(`${WA_BASE}/${phoneId}/messages`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    }),
  });
}

export async function sendImage(phone: string, imageUrl: string, caption: string): Promise<WAMessageResponse> {
  const { phoneId } = getConfig();
  const res = await fetch(`${WA_BASE}/${phoneId}/messages`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone.replace(/[^0-9]/g, ""),
      type: "image",
      image: { link: imageUrl, caption },
    }),
  });
  if (!res.ok) throw new Error(`WhatsApp image failed: ${res.status}`);
  return await res.json();
}
