/**
 * CloudPano API Client
 * Low-cost 360° virtual tour platform
 * Docs: https://www.cloudpano.com/api
 */

import { logger } from '@/lib/utils/safe-logger';

export interface CloudPanoTour {
  id: string;
  title: string;
  status: 'draft' | 'published';
  scenes: number;
  embedUrl: string;
  publicUrl: string;
  createdAt: string;
}

function getApiKey(): string | null {
  return process.env.CLOUDPANO_API_KEY || null;
}

/** Create a new tour from uploaded 360° images */
export async function createTour(title: string, imageUrls: string[]): Promise<CloudPanoTour | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    logger.warn('CloudPano API not configured — CLOUDPANO_API_KEY missing');
    return null;
  }
  // Production: POST https://api.cloudpano.com/v1/tours
  return null;
}

/** Get tour by ID */
export async function getTour(tourId: string): Promise<CloudPanoTour | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return null;
}

/** Add a hotspot to a scene */
export async function addHotspot(
  tourId: string,
  sceneId: string,
  hotspot: { label: string; x: number; y: number; type: 'info' | 'link' | 'media' }
): Promise<boolean> {
  const apiKey = getApiKey();
  if (!apiKey) return false;
  return false;
}
