/**
 * CubiCasa — AI Floor Plans from Photos
 * Docs: https://www.cubicasa.com/api
 */
import { logger } from '@/lib/utils/safe-logger';

export interface FloorPlanJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  format: '2d' | '3d';
}

function getApiKey(): string | null { return process.env.CUBICASA_API_KEY || null; }

/** Submit photos for floor plan generation */
export async function createFloorPlan(imageUrls: string[], format: '2d' | '3d' = '2d'): Promise<FloorPlanJob | null> {
  const key = getApiKey();
  if (!key) { logger.warn('CubiCasa not configured'); return null; }
  // Production: POST to CubiCasa API with images
  return { id: `fp_${Date.now()}`, status: 'pending', format };
}

/** Check floor plan job status */
export async function getFloorPlanStatus(jobId: string): Promise<FloorPlanJob | null> {
  const key = getApiKey();
  if (!key) return null;
  return null;
}
