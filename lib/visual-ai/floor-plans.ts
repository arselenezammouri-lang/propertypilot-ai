/**
 * Floor Plan Generation — Convert photos/sketches to clean floor plans
 * Uses Replicate ControlNet for structured output
 */

import { createPrediction } from "./replicate-client";
import type { FloorPlanStyle } from "./types";

const FLOOR_PLAN_MODEL =
  "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

const STYLE_PROMPTS: Record<FloorPlanStyle, string> = {
  "2d_standard":
    "clean architectural floor plan, black and white, precise measurements, professional blueprint, top-down view, no furniture",
  "2d_furnished":
    "architectural floor plan with furniture layout, colored rooms, professional interior design plan, top-down view, labeled rooms",
  "3d_rendered":
    "3D rendered floor plan, isometric view, realistic materials, furnished rooms, professional architectural visualization",
};

export async function createFloorPlanJob(params: {
  imageUrl: string;
  style: FloorPlanStyle;
  webhookUrl?: string;
}) {
  const prompt = STYLE_PROMPTS[params.style];

  return createPrediction({
    model: FLOOR_PLAN_MODEL,
    input: {
      image: params.imageUrl,
      prompt,
      negative_prompt:
        "blurry, distorted, low quality, watermark, text overlay, people",
      num_inference_steps: 30,
      guidance_scale: 8,
      strength: 0.7,
    },
    webhook: params.webhookUrl,
    webhook_events_filter: ["completed"],
  });
}
