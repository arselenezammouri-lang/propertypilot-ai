/**
 * PropertyPilot Mobile — API Client
 * Communicates with Next.js API routes
 */

import { getSession } from "./supabase";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "https://propertypilot-ai.vercel.app";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

export async function apiCall<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const session = await getSession();
  const token = session?.access_token;

  const url = new URL(`${API_BASE}${endpoint}`);
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `API error ${res.status}`);
  }

  return res.json();
}

// ─── CRM ────────────────────────────────────────────────────
export function fetchLeads(page = 1) {
  return apiCall<{ leads: unknown[]; total: number }>("/api/leads", {
    params: { page: String(page) },
  });
}

export function fetchListings(page = 1) {
  return apiCall<{ listings: unknown[]; total: number }>("/api/listings", {
    params: { page: String(page) },
  });
}

// ─── Visual AI ──────────────────────────────────────────────
export function createVisualAIJob(imageUrl: string, jobType: string, options: Record<string, string>) {
  return apiCall<{ job_id: string }>("/api/visual-ai", {
    method: "POST",
    body: { job_type: jobType, image_url: imageUrl, options },
  });
}

// ─── Voice Memos ────────────────────────────────────────────
export function transcribeVoiceMemo(audioUrl: string) {
  return apiCall<{ text: string }>("/api/voice/transcribe", {
    method: "POST",
    body: { audio_url: audioUrl },
  });
}
