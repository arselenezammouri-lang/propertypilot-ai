/**
 * Replicate API client for Visual AI Suite
 * Handles prediction creation, polling, and webhook callbacks
 */

const REPLICATE_API_URL = "https://api.replicate.com/v1";

function getApiToken(): string {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN not configured");
  return token;
}

interface ReplicatePrediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output: string | string[] | null;
  error: string | null;
  urls: { get: string; cancel: string };
}

interface CreatePredictionInput {
  model: string;
  input: Record<string, unknown>;
  webhook?: string;
  webhook_events_filter?: string[];
}

export async function createPrediction(
  params: CreatePredictionInput
): Promise<ReplicatePrediction> {
  const res = await fetch(`${REPLICATE_API_URL}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: params.model,
      input: params.input,
      webhook: params.webhook,
      webhook_events_filter: params.webhook_events_filter ?? ["completed"],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Replicate API error ${res.status}: ${errBody}`);
  }

  return res.json() as Promise<ReplicatePrediction>;
}

export async function getPrediction(id: string): Promise<ReplicatePrediction> {
  const res = await fetch(`${REPLICATE_API_URL}/predictions/${id}`, {
    headers: { Authorization: `Bearer ${getApiToken()}` },
  });

  if (!res.ok) {
    throw new Error(`Replicate GET error ${res.status}`);
  }

  return res.json() as Promise<ReplicatePrediction>;
}

export async function cancelPrediction(id: string): Promise<void> {
  await fetch(`${REPLICATE_API_URL}/predictions/${id}/cancel`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getApiToken()}` },
  });
}

/**
 * Poll until prediction completes (fallback when webhooks aren't available)
 */
export async function waitForPrediction(
  id: string,
  maxWaitMs = 120_000,
  intervalMs = 2_000
): Promise<ReplicatePrediction> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const pred = await getPrediction(id);
    if (pred.status === "succeeded" || pred.status === "failed") return pred;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Prediction timed out");
}
