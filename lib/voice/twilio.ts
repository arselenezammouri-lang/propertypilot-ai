/**
 * Twilio Integration — EU phone numbers + SIP
 * https://www.twilio.com/docs
 *
 * Used for: purchasing per-country phone numbers, routing inbound calls to Bland AI
 */

const TWILIO_BASE = "https://api.twilio.com/2010-04-01";

function getAuth(): { sid: string; token: string } {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not configured");
  return { sid, token };
}

function authHeaders(): Record<string, string> {
  const { sid, token } = getAuth();
  return { Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64") };
}

export interface TwilioNumber {
  sid: string;
  phone_number: string;
  friendly_name: string;
  country_code: string;
  capabilities: { voice: boolean; sms: boolean };
}

export interface AvailableNumber {
  phone_number: string;
  friendly_name: string;
  locality: string;
  region: string;
  country: string;
  monthly_price: string;
}

const COUNTRY_CODES: Record<string, string> = {
  IT: "IT", FR: "FR", ES: "ES", DE: "DE", GB: "GB", PT: "PT", US: "US",
};

/**
 * Search available phone numbers in a country
 */
export async function searchNumbers(country: string, limit: number = 5): Promise<AvailableNumber[]> {
  const { sid } = getAuth();
  const cc = COUNTRY_CODES[country.toUpperCase()] || country;
  const res = await fetch(
    `${TWILIO_BASE}/Accounts/${sid}/AvailablePhoneNumbers/${cc}/Local.json?PageSize=${limit}&VoiceEnabled=true`,
    { headers: authHeaders() }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.available_phone_numbers || []).map((n: Record<string, unknown>) => ({
    phone_number: String(n.phone_number),
    friendly_name: String(n.friendly_name),
    locality: String(n.locality || ""),
    region: String(n.region || ""),
    country: cc,
    monthly_price: "1.00", // Twilio local numbers ~$1-3/mo
  }));
}

/**
 * Purchase a phone number
 */
export async function buyNumber(phoneNumber: string, voiceWebhookUrl: string): Promise<TwilioNumber> {
  const { sid } = getAuth();
  const res = await fetch(`${TWILIO_BASE}/Accounts/${sid}/IncomingPhoneNumbers.json`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      PhoneNumber: phoneNumber,
      VoiceUrl: voiceWebhookUrl,
      VoiceMethod: "POST",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twilio buy failed: ${res.status} ${err}`);
  }
  const data = await res.json();
  return {
    sid: data.sid,
    phone_number: data.phone_number,
    friendly_name: data.friendly_name,
    country_code: data.iso_country,
    capabilities: { voice: data.capabilities?.voice ?? true, sms: data.capabilities?.sms ?? false },
  };
}

/**
 * Release a phone number
 */
export async function releaseNumber(numberSid: string): Promise<void> {
  const { sid } = getAuth();
  await fetch(`${TWILIO_BASE}/Accounts/${sid}/IncomingPhoneNumbers/${numberSid}.json`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

/**
 * List owned phone numbers
 */
export async function listNumbers(): Promise<TwilioNumber[]> {
  const { sid } = getAuth();
  const res = await fetch(`${TWILIO_BASE}/Accounts/${sid}/IncomingPhoneNumbers.json?PageSize=50`, {
    headers: authHeaders(),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.incoming_phone_numbers || []).map((n: Record<string, unknown>) => ({
    sid: String(n.sid),
    phone_number: String(n.phone_number),
    friendly_name: String(n.friendly_name),
    country_code: String(n.iso_country),
    capabilities: { voice: true, sms: false },
  }));
}
