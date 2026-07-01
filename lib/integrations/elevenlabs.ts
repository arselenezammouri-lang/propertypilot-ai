/**
 * ElevenLabs Voice API — TTS, voice cloning, MP3 generation
 * Docs: https://docs.elevenlabs.io/api-reference
 */
import { logger } from '@/lib/utils/safe-logger';

const BASE = 'https://api.elevenlabs.io/v1';

function getApiKey(): string | null {
  return process.env.ELEVENLABS_API_KEY || null;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  labels: Record<string, string>;
  preview_url: string;
}

/** List available voices */
export async function listVoices(): Promise<ElevenLabsVoice[]> {
  const key = getApiKey();
  if (!key) { logger.warn('ElevenLabs not configured'); return []; }
  try {
    const res = await fetch(`${BASE}/voices`, { headers: { 'xi-api-key': key } });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
    const data = await res.json();
    return data.voices ?? [];
  } catch (err) { logger.error('ElevenLabs listVoices', err); return []; }
}

/** Text-to-Speech — returns audio buffer */
export async function textToSpeech(
  text: string,
  voiceId?: string,
  options?: { model?: string; stability?: number; similarity_boost?: number }
): Promise<ArrayBuffer | null> {
  const key = getApiKey();
  if (!key) return null;
  const vid = voiceId ?? process.env.ELEVENLABS_VOICE_ID_DEFAULT ?? '21m00Tcm4TlvDq8ikWAM';
  try {
    const res = await fetch(`${BASE}/text-to-speech/${vid}`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: options?.model ?? 'eleven_multilingual_v2',
        voice_settings: { stability: options?.stability ?? 0.5, similarity_boost: options?.similarity_boost ?? 0.75 },
      }),
    });
    if (!res.ok) throw new Error(`ElevenLabs TTS ${res.status}`);
    return await res.arrayBuffer();
  } catch (err) { logger.error('ElevenLabs TTS', err); return null; }
}

/** Clone a voice from audio samples */
export async function cloneVoice(name: string, audioUrls: string[], description?: string): Promise<string | null> {
  const key = getApiKey();
  if (!key) return null;
  // Production: POST /v1/voices/add with form data containing audio files
  logger.info(`Voice clone requested: ${name} with ${audioUrls.length} samples`);
  return null; // Requires multipart form — implement when audio files available
}
