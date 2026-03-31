import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailTemplates } from '@/lib/email-templates';
import { isEmailConfigured, getResendClient } from '@/lib/resend-client';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Weekly digest — runs every Monday at 8 AM via Vercel cron
 * Sends each active user their weekly stats
 */
export async function GET(request: NextRequest) {
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || process.env.INTERNAL_CALLBACK_SECRET;

  if (!isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ skipped: true, reason: 'Email not configured' });
  }

  const admin = getAdmin();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let sent = 0;
  let errors = 0;

  try {
    // Get all users who have been active (have subscriptions with generations)
    const { data: subs } = await admin
      .from('subscriptions')
      .select('user_id, generations_count');

    if (!subs?.length) {
      return NextResponse.json({ success: true, sent: 0, message: 'No active users' });
    }

    for (const sub of subs) {
      if (!sub.user_id) continue;

      // Get profile
      const { data: profile } = await admin
        .from('profiles')
        .select('email, full_name')
        .eq('id', sub.user_id)
        .maybeSingle();

      if (!profile?.email) continue;

      // Count leads added this week
      const { count: leadsCount } = await admin
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', sub.user_id)
        .gte('created_at', sevenDaysAgo);

      // Count listings saved this week
      const { count: listingsCount } = await admin
        .from('saved_listings')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', sub.user_id)
        .gte('created_at', sevenDaysAgo);

      const listingsGenerated = listingsCount || 0;
      const leadsAdded = leadsCount || 0;

      // Skip users with zero activity
      if (listingsGenerated === 0 && leadsAdded === 0) continue;

      const hoursSaved = Math.round((listingsGenerated * 45) / 60 * 10) / 10;

      // Get most recent listing title
      const { data: recentListing } = await admin
        .from('saved_listings')
        .select('title')
        .eq('user_id', sub.user_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      try {
        const { client, fromEmail } = await getResendClient();
        const userName = profile.full_name || profile.email.split('@')[0] || 'there';
        const template = emailTemplates.weeklyDigest(userName, {
          listingsGenerated,
          leadsAdded,
          hoursSaved,
          topTitle: recentListing?.title || undefined,
        });

        await client.emails.send({
          from: fromEmail,
          to: profile.email,
          subject: template.subject,
          html: template.html,
        });

        sent++;
      } catch (err) {
        logger.error('Weekly digest email failed', err, { userId: sub.user_id });
        errors++;
      }
    }
  } catch (error) {
    logger.error('Weekly digest cron failed', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    sent,
    errors,
    timestamp: new Date().toISOString(),
  });
}
