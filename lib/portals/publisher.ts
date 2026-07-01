/**
 * Portal Publishing Unified Interface
 * Single entry point to publish/update/delete across all 16+ EU portals
 */

import { logger } from '@/lib/utils/safe-logger';
import type { PortalAdapter, PortalId, PortalListingOutput } from './types';
import { createAdapter } from './adapters';

export interface PortalCredentials {
  portalId: PortalId;
  credentials: Record<string, string>;
  feedUrl?: string;
  enabled: boolean;
}

export interface MultiPortalResult {
  portalId: PortalId;
  success: boolean;
  externalId?: string;
  externalUrl?: string;
  error?: string;
}

/**
 * Publish a listing to multiple portals simultaneously
 */
export async function publishToPortals(
  listing: PortalListingOutput, media: string[],
  portalConfigs: PortalCredentials[]
): Promise<MultiPortalResult[]> {
  const enabledPortals = portalConfigs.filter(p => p.enabled);
  if (enabledPortals.length === 0) {
    logger.warn('No enabled portals configured');
    return [];
  }

  const results = await Promise.allSettled(
    enabledPortals.map(async (config): Promise<MultiPortalResult> => {
      try {
        const adapter = createAdapter(config.portalId, config.credentials, config.feedUrl);
        if (!adapter) {
          return { portalId: config.portalId, success: false, error: 'Adapter not available' };
        }
        const result = await adapter.publish(listing, media);
        return {
          portalId: config.portalId,
          success: true,
          externalId: result.externalId,
          externalUrl: result.url,
          error: undefined,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        logger.error(`Portal ${config.portalId} publish failed`, err);
        return { portalId: config.portalId, success: false, error: msg };
      }
    })
  );

  return results.map(r => r.status === 'fulfilled' ? r.value : { portalId: 'unknown' as PortalId, success: false, error: 'Promise rejected' });
}

/**
 * Update a listing across all portals where it was published
 */
export async function updateOnPortals(
  listing: PortalListingOutput, media: string[],
  publications: { portalId: PortalId; externalId: string; credentials: Record<string, string>; feedUrl?: string }[]
): Promise<MultiPortalResult[]> {
  const results = await Promise.allSettled(
    publications.map(async (pub): Promise<MultiPortalResult> => {
      try {
        const adapter = createAdapter(pub.portalId, pub.credentials, pub.feedUrl);
        if (!adapter || !adapter.update) {
          return { portalId: pub.portalId, success: false, error: 'Update not supported' };
        }
        await adapter.update(pub.externalId, listing);
        return { portalId: pub.portalId, success: true, error: undefined };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        return { portalId: pub.portalId, success: false, error: msg };
      }
    })
  );

  return results.map(r => r.status === 'fulfilled' ? r.value : { portalId: 'unknown' as PortalId, success: false, error: 'Promise rejected' });
}

/**
 * Remove a listing from all portals
 */
export async function removeFromPortals(
  publications: { portalId: PortalId; externalId: string; credentials: Record<string, string>; feedUrl?: string }[]
): Promise<MultiPortalResult[]> {
  const results = await Promise.allSettled(
    publications.map(async (pub): Promise<MultiPortalResult> => {
      try {
        const adapter = createAdapter(pub.portalId, pub.credentials, pub.feedUrl);
        if (!adapter || !adapter.unpublish) {
          return { portalId: pub.portalId, success: false, error: 'Delete not supported' };
        }
        const result = await adapter.unpublish(pub.externalId);
        return { portalId: pub.portalId, success: true, error: undefined };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        return { portalId: pub.portalId, success: false, error: msg };
      }
    })
  );

  return results.map(r => r.status === 'fulfilled' ? r.value : { portalId: 'unknown' as PortalId, success: false, error: 'Promise rejected' });
}

/**
 * Portal directory — all supported portals with metadata
 */
export const PORTAL_DIRECTORY: {
  id: PortalId;
  name: string;
  country: string;
  flag: string;
  type: 'self_service' | 'api_partner' | 'aggregator';
  approvalTime: string;
  applicationUrl: string;
  cost: string;
}[] = [
  // Italy
  { id: 'immobiliare_it', name: 'Immobiliare.it', country: 'IT', flag: '🇮🇹', type: 'self_service', approvalTime: 'Immediate', applicationUrl: 'https://www.immobiliare.it', cost: 'Free (agency backoffice)' },
  { id: 'casa_it', name: 'Casa.it', country: 'IT', flag: '🇮🇹', type: 'self_service', approvalTime: 'Immediate', applicationUrl: 'https://www.casa.it', cost: 'Free (agency backoffice)' },
  { id: 'idealista', name: 'Idealista IT', country: 'IT', flag: '🇮🇹', type: 'api_partner', approvalTime: '1-2 weeks', applicationUrl: 'https://developers.idealista.com', cost: 'Free API' },
  // France
  { id: 'seloger', name: 'SeLoger', country: 'FR', flag: '🇫🇷', type: 'api_partner', approvalTime: '4-8 weeks', applicationUrl: 'https://www.avivgroup.com/partners', cost: 'Partner agreement' },
  { id: 'leboncoin', name: 'LeBonCoin', country: 'FR', flag: '🇫🇷', type: 'api_partner', approvalTime: '4-8 weeks', applicationUrl: 'https://adevinta.com/partners', cost: 'Partner agreement' },
  { id: 'bienici', name: "Bien'ici", country: 'FR', flag: '🇫🇷', type: 'api_partner', approvalTime: '2-4 weeks', applicationUrl: 'https://www.poliris.com', cost: 'Via Poliris' },
  // Spain
  { id: 'idealista', name: 'Idealista ES', country: 'ES', flag: '🇪🇸', type: 'api_partner', approvalTime: '1-2 weeks', applicationUrl: 'https://developers.idealista.com', cost: 'Free API' },
  { id: 'fotocasa', name: 'Fotocasa', country: 'ES', flag: '🇪🇸', type: 'api_partner', approvalTime: '4-8 weeks', applicationUrl: 'https://adevinta.com/partners', cost: 'Partner agreement' },
  // Germany
  { id: 'estatesync', name: 'EstateSync', country: 'DE', flag: '🇩🇪', type: 'aggregator', approvalTime: 'Immediate', applicationUrl: 'https://www.estatesync.com', cost: '€50/month (all DE portals)' },
  { id: 'immoscout24', name: 'ImmoScout24', country: 'DE', flag: '🇩🇪', type: 'api_partner', approvalTime: '2-4 weeks', applicationUrl: 'https://api.immobilienscout24.de', cost: 'Via EstateSync recommended' },
  // UK
  { id: 'rightmove', name: 'Rightmove', country: 'UK', flag: '🇬🇧', type: 'api_partner', approvalTime: '4-8 weeks', applicationUrl: 'https://www.rightmove.co.uk/developer/', cost: 'Partner agreement' },
  { id: 'onthemarket', name: 'OnTheMarket', country: 'UK', flag: '🇬🇧', type: 'self_service', approvalTime: '1-2 weeks', applicationUrl: 'https://www.onthemarket.com', cost: 'Agency subscription' },
  { id: 'zoopla', name: 'Zoopla', country: 'UK', flag: '🇬🇧', type: 'self_service', approvalTime: '1-2 weeks', applicationUrl: 'https://www.zoopla.co.uk', cost: 'Agency subscription' },
  // Portugal
  { id: 'idealista_pt', name: 'Idealista PT', country: 'PT', flag: '🇵🇹', type: 'api_partner', approvalTime: '1-2 weeks', applicationUrl: 'https://developers.idealista.com', cost: 'Free API' },
  { id: 'imovirtual', name: 'Imovirtual', country: 'PT', flag: '🇵🇹', type: 'api_partner', approvalTime: '2-4 weeks', applicationUrl: 'https://www.olxgroup.com', cost: 'Partner agreement' },
];
