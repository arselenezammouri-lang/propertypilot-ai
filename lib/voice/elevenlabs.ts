/**
 * ElevenLabs Voice Integration — Multilingual v2
 * https://elevenlabs.io/docs
 *
 * Used for: voice selection per language, voice cloning (Agency tier)
 */

const ELEVEN_BASE = "https://api.elevenlabs.io/v1";

function getApiKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY not configured");
  return key;
}

function headers(): Record<string, string> {
  return { "xi-api-key": getApiKey(), "Content-Type": "application/json" };
}

export interface ElevenVoice {
  voice_id: string;
  name: string;
  labels: Record<string, string>;
  preview_url: string;
  category: string;
}

export interface VoiceCloneResult {
  voice_id: string;
  name: string;
}

export async function listVoices(): Promise<ElevenVoice[]> {
  const res = await fetch(`${ELEVEN_BASE}/voices`, { headers: headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.voices || [];
}

export async function getVoice(voiceId: string): Promise<ElevenVoice | null> {
  const res = await fetch(`${ELEVEN_BASE}/voices/${voiceId}`, { headers: headers() });
  if (!res.ok) return null;
  return await res.json();
}

/**
 * Clone a voice from an audio sample (Agency tier)
 * Requires: 60+ second audio sample, clear speech, minimal background noise
 */
export async function cloneVoice(
  name: string,
  description: string,
  audioFile: Blob
): Promise<VoiceCloneResult> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("files", audioFile, "voice-sample.mp3");

  const res = await fetch(`${ELEVEN_BASE}/voices/add`, {
    method: "POST",
    headers: { "xi-api-key": getApiKey() },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs voice clone failed: ${res.status} ${err}`);
  }

  return await res.json();
}

export async function deleteVoice(voiceId: string): Promise<void> {
  await fetch(`${ELEVEN_BASE}/voices/${voiceId}`, {
    method: "DELETE",
    headers: headers(),
  });
}
