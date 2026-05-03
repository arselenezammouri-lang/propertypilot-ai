/**
 * Bland AI Client — Voice agent API wrapper
 * https://docs.bland.ai
 *
 * Bland AI handles conversational AI phone calls.
 * We send a pathway + phone number + context, Bland makes the call,
 * and sends a webhook when done with transcript + outcome.
 */

const BLAND_BASE = "https://api.bland.ai/v1";

function getApiKey(): string {
  const key = process.env.BLAND_AI_API_KEY;
  if (!key) throw new Error("BLAND_AI_API_KEY not configured");
  return key;
}

function headers(): Record<string, string> {
  return {
    Authorization: getApiKey(),
    "Content-Type": "application/json",
  };
}

/* ─── Types ─── */

export interface BlandCallRequest {
  phone_number: string;
  pathway_id?: string;
  task?: string;
  voice?: string;
  first_sentence?: string;
  language?: string;
  model?: string;
  max_duration?: number; // minutes
  record?: boolean;
  webhook?: string;
  metadata?: Record<string, string>;
  transfer_phone_number?: string;
}

export interface BlandCallResponse {
  status: string;
  call_id: string;
  batch_id?: string;
}

export interface BlandCallStatus {
  call_id: string;
  status: "queued" | "ringing" | "in-progress" | "completed" | "failed" | "no-answer" | "busy";
  created_at: string;
  started_at: string | null;
  end_at: string | null;
  duration: number; // seconds
  from: string;
  to: string;
  answered_by: string | null;
  recording_url: string | null;
  price: number;
}

export interface BlandTranscript {
  call_id: string;
  transcripts: Array<{
    role: "agent" | "user";
    text: string;
    timestamp: number;
  }>;
  summary: string;
  concatenated_transcript: string;
}

/* ─── API Methods ─── */

export async function createCall(params: BlandCallRequest): Promise<BlandCallResponse> {
  const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/webhook`
    : "https://propertypilot-ai.vercel.app/api/voice/webhook";

  const res = await fetch(`${BLAND_BASE}/calls`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      ...params,
      record: params.record ?? true,
      webhook: params.webhook || webhookUrl,
      model: params.model || "enhanced",
      max_duration: params.max_duration || 5,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bland AI call failed: ${res.status} ${err}`);
  }

  return await res.json();
}

export async function getCallStatus(callId: string): Promise<BlandCallStatus> {
  const res = await fetch(`${BLAND_BASE}/calls/${callId}`, { headers: headers() });
  if (!res.ok) throw new Error(`Bland AI status failed: ${res.status}`);
  return await res.json();
}

export async function getTranscript(callId: string): Promise<BlandTranscript> {
  const res = await fetch(`${BLAND_BASE}/calls/${callId}/transcript`, { headers: headers() });
  if (!res.ok) throw new Error(`Bland AI transcript failed: ${res.status}`);
  return await res.json();
}

export async function listVoices(): Promise<Array<{ id: string; name: string; language: string; preview_url?: string }>> {
  const res = await fetch(`${BLAND_BASE}/voices`, { headers: headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.voices || data || [];
}

export async function endCall(callId: string): Promise<void> {
  await fetch(`${BLAND_BASE}/calls/${callId}/stop`, {
    method: "POST",
    headers: headers(),
  });
}
