/**
 * TikTok Content Posting API
 * Docs: https://developers.tiktok.com/doc/content-posting-api
 */
import { logger } from '@/lib/utils/safe-logger';

const TIKTOK_BASE = 'https://open.tiktokapis.com/v2';

export function getTikTokOAuthUrl(redirectUri: string): string {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  if (!clientKey) return '';
  return `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=user.info.basic,video.publish&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

export async function exchangeTikTokCode(code: string, redirectUri: string): Promise<{ access_token: string; open_id: string } | null> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) return null;
  try {
    const res = await fetch(`${TIKTOK_BASE}/oauth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_key: clientKey, client_secret: clientSecret, code, grant_type: 'authorization_code', redirect_uri: redirectUri }),
    });
    if (!res.ok) throw new Error(`TikTok token ${res.status}`);
    const data = await res.json();
    return { access_token: data.data?.access_token, open_id: data.data?.open_id };
  } catch (err) { logger.error('TikTok token', err); return null; }
}

/** Initiate video upload to TikTok */
export async function initVideoUpload(accessToken: string, videoSize: number): Promise<{ upload_url: string; publish_id: string } | null> {
  try {
    const res = await fetch(`${TIKTOK_BASE}/post/publish/video/init/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_info: { title: '', privacy_level: 'SELF_ONLY' }, source_info: { source: 'FILE_UPLOAD', video_size: videoSize } }),
    });
    if (!res.ok) throw new Error(`TikTok init ${res.status}`);
    const data = await res.json();
    return { upload_url: data.data?.upload_url, publish_id: data.data?.publish_id };
  } catch (err) { logger.error('TikTok init upload', err); return null; }
}
