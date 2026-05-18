/**
 * Photo Enhancement — HDR, sky replacement, declutter, color correction, twilight
 * Uses various Replicate models per enhancement type
 */

import { createPrediction } from "./replicate-client";
import type { EnhancementType } from "./types";

/** Model versions for each enhancement type */
const ENHANCEMENT_MODELS: Record<EnhancementType, string> = {
  hdr: "tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
  sky_replacement:
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
  declutter:
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
  color_correction:
    "tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
  twilight:
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
};

const ENHANCEMENT_PROMPTS: Record<EnhancementType, string> = {
  hdr: "",
  sky_replacement:
    "beautiful blue sky with wispy clouds, golden hour lighting, professional real estate photography",
  declutter:
    "clean empty room, no clutter, no personal items, professional real estate photo, well-lit",
  color_correction: "",
  twilight:
    "twilight exterior photo, warm interior lights glowing, dramatic dusk sky, professional real estate photography",
};

export async function createEnhancementJob(params: {
  imageUrl: string;
  enhancementType: EnhancementType;
  webhookUrl?: string;
}) {
  const model = ENHANCEMENT_MODELS[params.enhancementType];
  const prompt = ENHANCEMENT_PROMPTS[params.enhancementType];

  // HDR and color_correction use the restoration model (no prompt needed)
  const isRestoration =
    params.enhancementType === "hdr" ||
    params.enhancementType === "color_correction";

  const input: Record<string, unknown> = isRestoration
    ? {
        img: params.imageUrl,
        scale: 2,
        version: "v1.4",
      }
    : {
        image: params.imageUrl,
        prompt,
        negative_prompt: "blurry, distorted, low quality, watermark, text",
        num_inference_steps: 25,
        guidance_scale: 7.5,
        strength: params.enhancementType === "twilight" ? 0.55 : 0.45,
      };

  return createPrediction({
    model,
    input,
    webhook: params.webhookUrl,
    webhook_events_filter: ["completed"],
  });
}
