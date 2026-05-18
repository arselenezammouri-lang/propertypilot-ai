/**
 * Virtual Staging — AI-powered furniture placement
 * Uses Replicate stable-diffusion-inpainting for room staging
 */

import { createPrediction } from "./replicate-client";
import type { StagingStyle, RoomType } from "./types";

/** Stable Diffusion img2img model version for staging */
const STAGING_MODEL =
  "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

const STYLE_PROMPTS: Record<StagingStyle, string> = {
  modern:
    "modern interior design, clean lines, neutral colors, designer furniture, professional real estate photo",
  scandinavian:
    "scandinavian interior, light wood, white walls, minimalist furniture, cozy textiles, hygge atmosphere",
  industrial:
    "industrial loft interior, exposed brick, metal fixtures, Edison bulbs, vintage furniture",
  classic:
    "classic elegant interior, traditional furniture, warm colors, crown molding, refined decor",
  minimalist:
    "minimalist interior, sparse furniture, zen aesthetic, open space, natural light",
  luxury:
    "luxury interior design, high-end furniture, marble accents, gold fixtures, premium materials",
};

const ROOM_CONTEXT: Record<RoomType, string> = {
  living_room: "spacious living room with sofa, coffee table, rug, and artwork",
  bedroom: "cozy bedroom with bed, nightstands, wardrobe, and soft lighting",
  kitchen: "modern kitchen with island, bar stools, and premium appliances",
  bathroom: "spa-like bathroom with vanity, towels, and elegant fixtures",
  dining_room: "elegant dining room with table, chairs, and chandelier",
  office: "professional home office with desk, chair, shelving, and plants",
  terrace: "inviting outdoor terrace with lounge furniture and planters",
};

export async function createStagingJob(params: {
  imageUrl: string;
  style: StagingStyle;
  roomType: RoomType;
  webhookUrl?: string;
}) {
  const prompt = `${STYLE_PROMPTS[params.style]}, ${ROOM_CONTEXT[params.roomType]}, photorealistic, 8k, professional photography, well-lit`;

  return createPrediction({
    model: STAGING_MODEL,
    input: {
      image: params.imageUrl,
      prompt,
      negative_prompt:
        "blurry, distorted, low quality, watermark, text, people, animals, cartoon",
      num_inference_steps: 30,
      guidance_scale: 7.5,
      strength: 0.65,
      scheduler: "K_EULER_ANCESTRAL",
    },
    webhook: params.webhookUrl,
    webhook_events_filter: ["completed"],
  });
}
