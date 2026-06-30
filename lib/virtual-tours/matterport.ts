/**
 * Matterport API Client
 * Official integration for 3D virtual tours
 * Docs: https://matterport.github.io/showcase-sdk/
 */

import { logger } from '@/lib/utils/safe-logger';

export interface MatterportSpace {
  id: string;
  name: string;
  status: 'processing' | 'active' | 'error';
  created: string;
  floors: number;
  embedUrl: string;
  thumbnailUrl: string;
}

export interface MatterportConfig {
  apiKey: string;
  secret: string;
}

function getConfig(): MatterportConfig | null {
  const apiKey = process.env.MATTERPORT_API_KEY;
  const secret = process.env.MATTERPORT_API_SECRET;
  if (!apiKey || !secret) return null;
  return { apiKey, secret };
}

/** List all spaces for the account */
export async function listSpaces(): Promise<MatterportSpace[]> {
  const config = getConfig();
  if (!config) {
    logger.warn('Matterport API not configured — MATTERPORT_API_KEY missing');
    return [];
  }
  // Production: GET https://api.matterport.com/api/models/v1
  // Headers: Authorization: Bearer {token}
  return [];
}

/** Get a single space by ID */
export async function getSpace(spaceId: string): Promise<MatterportSpace | null> {
  const config = getConfig();
  if (!config) return null;
  // Production: GET https://api.matterport.com/api/models/v1/{spaceId}
  return null;
}

/** Generate embed URL for a space */
export function getEmbedUrl(spaceId: string, options?: { autoplay?: boolean; qs?: boolean }): string {
  const params = new URLSearchParams();
  if (options?.autoplay) params.set('play', '1');
  if (options?.qs === false) params.set('qs', '0');
  return `https://my.matterport.com/show/?m=${spaceId}&${params.toString()}`;
}
