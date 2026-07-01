/**
 * Meta Graph API — Instagram + Facebook Business publishing
 * Docs: https://developers.facebook.com/docs/graph-api
 */
import { logger } from '@/lib/utils/safe-logger';

const GRAPH_BASE = 'https://graph.facebook.com/v19.0';

export interface MetaPublishResult {
  id: string;
  permalink?: string;
}

/** Publish a post to Instagram Business */
export async function publishInstagramPost(
  accessToken: string,
  igUserId: string,
  imageUrl: string,
  caption: string
): Promise<MetaPublishResult | null> {
  try {
    // Step 1: Create media container
    const containerRes = await fetch(`${GRAPH_BASE}/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: accessToken }),
    });
    if (!containerRes.ok) throw new Error(`IG container ${containerRes.status}`);
    const { id: containerId } = await containerRes.json();

    // Step 2: Publish
    const pubRes = await fetch(`${GRAPH_BASE}/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: containerId, access_token: accessToken }),
    });
    if (!pubRes.ok) throw new Error(`IG publish ${pubRes.status}`);
    return await pubRes.json();
  } catch (err) { logger.error('Meta IG publish', err); return null; }
}

/** Publish a post to Facebook Page */
export async function publishFacebookPost(
  accessToken: string,
  pageId: string,
  message: string,
  photoUrl?: string
): Promise<MetaPublishResult | null> {
  try {
    const endpoint = photoUrl ? `${GRAPH_BASE}/${pageId}/photos` : `${GRAPH_BASE}/${pageId}/feed`;
    const body: Record<string, string> = { access_token: accessToken };
    if (photoUrl) { body.url = photoUrl; body.message = message; }
    else { body.message = message; }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`FB publish ${res.status}`);
    return await res.json();
  } catch (err) { logger.error('Meta FB publish', err); return null; }
}

/** Get OAuth URL for Meta login */
export function getMetaOAuthUrl(redirectUri: string, scopes: string[] = ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'pages_manage_posts']): string {
  const appId = process.env.META_APP_ID;
  if (!appId) return '';
  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join(',')}&response_type=code`;
}

/** Exchange auth code for long-lived token */
export async function exchangeMetaCode(code: string, redirectUri: string): Promise<{ access_token: string; expires_in: number } | null> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) return null;
  try {
    const res = await fetch(`${GRAPH_BASE}/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`);
    if (!res.ok) throw new Error(`Meta token ${res.status}`);
    return await res.json();
  } catch (err) { logger.error('Meta token exchange', err); return null; }
}
