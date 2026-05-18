/**
 * Visual AI Suite — Shared types
 * Replicate-powered: virtual staging, photo enhancement, floor plans
 */

export type VisualAIJobType = "virtual_staging" | "photo_enhancement" | "floor_plan";

export type VisualAIStatus = "pending" | "processing" | "completed" | "failed";

export interface VisualAIJob {
  id: string;
  user_id: string;
  job_type: VisualAIJobType;
  status: VisualAIStatus;
  input_url: string;
  output_url: string | null;
  replicate_id: string | null;
  options: VisualAIOptions;
  error_message: string | null;
  credits_used: number;
  created_at: string;
  completed_at: string | null;
}

export interface VisualAIOptions {
  style?: StagingStyle;
  room_type?: RoomType;
  enhancement_type?: EnhancementType;
  floor_plan_style?: FloorPlanStyle;
}

export type StagingStyle =
  | "modern"
  | "scandinavian"
  | "industrial"
  | "classic"
  | "minimalist"
  | "luxury";

export type RoomType =
  | "living_room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "dining_room"
  | "office"
  | "terrace";

export type EnhancementType =
  | "hdr"
  | "sky_replacement"
  | "declutter"
  | "color_correction"
  | "twilight";

export type FloorPlanStyle = "2d_standard" | "2d_furnished" | "3d_rendered";

export interface VisualAIRequest {
  job_type: VisualAIJobType;
  image_url: string;
  options: VisualAIOptions;
}

export interface VisualAIResponse {
  job_id: string;
  status: VisualAIStatus;
  output_url?: string;
  estimated_seconds?: number;
}

/** Plan-based visual AI limits (jobs/month) */
export const VISUAL_AI_LIMITS: Record<string, number> = {
  free: 2,
  starter: 20,
  pro: 100,
  agency: 500,
};
