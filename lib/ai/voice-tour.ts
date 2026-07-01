/**
 * AI Voice Tour Generator
 * Generate narrated property tours using ElevenLabs TTS
 */

import { textToSpeech } from '@/lib/integrations/elevenlabs';
import { logger } from '@/lib/utils/safe-logger';

export interface VoiceTourScript {
  roomName: string;
  narration: string;
  duration: number; // estimated seconds
}

export type VoiceTourStyle = 'factual' | 'emotional' | 'luxury' | 'investment' | 'family';

const STYLE_PROMPTS: Record<VoiceTourStyle, Record<string, string>> = {
  factual: {
    it: 'Descrivi in modo professionale e informativo, con dati precisi su metrature, materiali e finiture.',
    en: 'Describe professionally and informatively, with precise data on measurements, materials, and finishes.',
  },
  emotional: {
    it: 'Descrivi con emozione, facendo immaginare la vita quotidiana in questo spazio. Evoca sensazioni.',
    en: 'Describe with emotion, helping imagine daily life in this space. Evoke feelings.',
  },
  luxury: {
    it: 'Descrivi con tono esclusivo e sofisticato, enfatizzando prestigio, materiali pregiati e dettagli di design.',
    en: 'Describe with exclusive, sophisticated tone, emphasizing prestige, premium materials, and design details.',
  },
  investment: {
    it: 'Descrivi evidenziando il potenziale di rendimento, la posizione strategica e il valore di mercato.',
    en: 'Describe highlighting ROI potential, strategic location, and market value.',
  },
  family: {
    it: 'Descrivi pensando a una famiglia, enfatizzando sicurezza, spazi per bambini, vicinanza a scuole e parchi.',
    en: 'Describe with families in mind, emphasizing safety, children spaces, proximity to schools and parks.',
  },
};

/** Generate voice tour scripts for each room/photo */
export function generateTourScripts(
  propertyDescription: string,
  photos: { id: string; label: string }[],
  style: VoiceTourStyle,
  language: string
): VoiceTourScript[] {
  // In production: call GPT-4o to generate per-room narration
  // For now, generate placeholder scripts based on photos
  return photos.map((photo, i) => ({
    roomName: photo.label || `Room ${i + 1}`,
    narration: `${photo.label || 'This room'}: ${propertyDescription.slice(0, 100)}...`,
    duration: 15 + Math.round(Math.random() * 10),
  }));
}

/** Generate audio for a tour script using ElevenLabs */
export async function generateTourAudio(
  scripts: VoiceTourScript[],
  voiceId?: string,
  language?: string
): Promise<{ roomName: string; audioBuffer: ArrayBuffer | null }[]> {
  const results: { roomName: string; audioBuffer: ArrayBuffer | null }[] = [];

  for (const script of scripts) {
    try {
      const audio = await textToSpeech(script.narration, voiceId);
      results.push({ roomName: script.roomName, audioBuffer: audio });
    } catch (err) {
      logger.error(`Voice tour audio failed for ${script.roomName}`, err);
      results.push({ roomName: script.roomName, audioBuffer: null });
    }
  }

  return results;
}

/** Get style prompt for AI script generation */
export function getStylePrompt(style: VoiceTourStyle, language: string): string {
  const lang = language.startsWith('it') ? 'it' : 'en';
  return STYLE_PROMPTS[style]?.[lang] ?? STYLE_PROMPTS[style].en;
}
