/**
 * LinkedIn Marketing API — publish company posts
 * Docs: https://learn.microsoft.com/en-us/linkedin/marketing/
 */
import { logger } from '@/lib/utils/safe-logger';

export function getLinkedInOAuthUrl(redirectUri: string): string {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) return '';
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20w_member_social`;
}

export async function exchangeLinkedInCode(code: string, redirectUri: string): Promise<{ access_token: string } | null> {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, client_id: clientId, client_secret: clientSecret }),
    });
    if (!res.ok) throw new Error(`LinkedIn token ${res.status}`);
    return await res.json();
  } catch (err) { logger.error('LinkedIn token', err); return null; }
}

export async function publishPost(accessToken: string, authorUrn: string, text: string, imageUrl?: string): Promise<string | null> {
  try {
    const body: Record<string, unknown> = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text }, shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE' } },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    };
    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`LinkedIn post ${res.status}`);
    return res.headers.get('x-restli-id');
  } catch (err) { logger.error('LinkedIn post', err); return null; }
}
