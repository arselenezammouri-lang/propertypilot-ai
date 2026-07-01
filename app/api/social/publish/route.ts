import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/auth-helper';
import { publishInstagramPost, publishFacebookPost } from '@/lib/integrations/meta';
import { publishPost as publishLinkedIn } from '@/lib/integrations/linkedin';
import { logger } from '@/lib/utils/safe-logger';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const publishSchema = z.object({
  content: z.string().min(1).max(5000),
  mediaUrls: z.array(z.string().url()).optional().default([]),
  platforms: z.array(z.enum(['instagram', 'facebook', 'tiktok', 'linkedin'])).min(1),
  scheduleAt: z.string().datetime().optional(),
  listingId: z.string().uuid().optional(),
  hashtags: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const parsed = publishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { content, mediaUrls, platforms, scheduleAt, listingId, hashtags } = parsed.data;
    const fullContent = hashtags.length > 0 ? `${content}\n\n${hashtags.map(h => `#${h}`).join(' ')}` : content;

    // Create post record
    const { data: post, error: postError } = await supabase.from('social_posts').insert({
      user_id: user.id,
      listing_id: listingId || null,
      content: fullContent,
      media_urls: mediaUrls,
      platforms,
      hashtags,
      status: scheduleAt ? 'scheduled' : 'publishing',
      scheduled_at: scheduleAt || null,
    }).select().single();

    if (postError || !post) {
      logger.error('Failed to create social post', postError);
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }

    // If scheduled, return early
    if (scheduleAt) {
      return NextResponse.json({ success: true, postId: post.id, status: 'scheduled', scheduledAt: scheduleAt });
    }

    // Publish immediately to each platform
    const results: { platform: string; success: boolean; externalId?: string; error?: string }[] = [];

    // Get user's connected accounts
    const { data: accounts } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .in('platform', platforms);

    for (const platform of platforms) {
      const account = accounts?.find((a: { platform: string }) => a.platform === platform);
      if (!account) {
        results.push({ platform, success: false, error: 'Account not connected' });
        continue;
      }

      try {
        let externalId: string | undefined;

        if (platform === 'instagram' && account.platform_user_id) {
          const res = await publishInstagramPost(account.access_token, account.platform_user_id, mediaUrls[0] || '', fullContent);
          externalId = res?.id;
        } else if (platform === 'facebook' && account.page_id) {
          const res = await publishFacebookPost(account.access_token, account.page_id, fullContent, mediaUrls[0]);
          externalId = res?.id;
        } else if (platform === 'linkedin') {
          externalId = await publishLinkedIn(account.access_token, account.platform_user_id || '', fullContent, mediaUrls[0]) || undefined;
        }

        results.push({ platform, success: Boolean(externalId), externalId });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        results.push({ platform, success: false, error: msg });
      }
    }

    // Update post status
    const allSuccess = results.every(r => r.success);
    await supabase.from('social_posts').update({
      status: allSuccess ? 'published' : results.some(r => r.success) ? 'published' : 'failed',
      published_at: new Date().toISOString(),
    }).eq('id', post.id);

    return NextResponse.json({ success: true, postId: post.id, results });
  } catch (err) {
    logger.error('Social publish error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
