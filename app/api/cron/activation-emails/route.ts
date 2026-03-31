import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailTemplates } from '@/lib/email-templates';
import { isEmailConfigured, getResendClient } from '@/lib/resend-client';
import { STRIPE_PLANS } from '@/lib/stripe/config';
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
 * Cron job: runs daily via Vercel cron
 * 1. Sends activation nudge to users who signed up 24h ago but never generated
 * 2. Sends usage warning to users at 80%+ of their plan limit
 */
export async function GET(request: NextRequest) {
  // Verify this is a Vercel cron call or has auth
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || process.env.INTERNAL_CALLBACK_SECRET;
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    // Allow Vercel cron (no auth header) in production
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';
    if (!isVercelCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ skipped: true, reason: 'Email not configured' });
  }

  const admin = getAdmin();
  const results = { activation: 0, usageWarning: 0, errors: 0 };

  try {
    // ── 1. ACTIVATION NUDGE ──
    // Find users who signed up 20-28h ago with 0 generations
    const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString();
    const twentyEightHoursAgo = new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString();

    const { data: inactiveUsers } = await admin
      .from('profiles')
      .select('id, email, full_name, created_at')
      .gte('created_at', twentyEightHoursAgo)
      .lte('created_at', twentyHoursAgo);

    if (inactiveUsers?.length) {
      for (const user of inactiveUsers) {
        if (!user.email) continue;

        // Check if they have any generations
        const { data: sub } = await admin
          .from('subscriptions')
          .select('generations_count')
          .eq('user_id', user.id)
          .maybeSingle();

        const generations = sub?.generations_count || 0;
        if (generations > 0) continue; // Already active, skip

        try {
          const { client, fromEmail } = await getResendClient();
          const userName = user.full_name || user.email.split('@')[0] || 'there';
          const template = emailTemplates.activationNudge(userName);

          await client.emails.send({
            from: fromEmail,
            to: user.email,
            subject: template.subject,
            html: template.html,
          });

          results.activation++;
        } catch (err) {
          logger.error('Activation email failed', err, { userId: user.id });
          results.errors++;
        }
      }
    }

    // ── 2. USAGE LIMIT WARNING ──
    // Find users at 80%+ of their plan limit
    const { data: subscriptions } = await admin
      .from('subscriptions')
      .select('user_id, status, generations_count')
      .in('status', ['free', 'starter', 'pro'])
      .gt('generations_count', 0);

    if (subscriptions?.length) {
      for (const sub of subscriptions) {
        const plan = sub.status || 'free';
        const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
        const limit = planConfig?.limits?.listingsPerMonth ?? 5;
        
        if (limit === -1) continue; // Unlimited plan
        
        const usage = sub.generations_count || 0;
        const percentage = usage / limit;

        // Only send at 80% (not every day)
        if (percentage < 0.78 || percentage > 0.85) continue;

        // Get user profile for email
        const { data: profile } = await admin
          .from('profiles')
          .select('email, full_name')
          .eq('id', sub.user_id)
          .maybeSingle();

        if (!profile?.email) continue;

        try {
          const { client, fromEmail } = await getResendClient();
          const userName = profile.full_name || profile.email.split('@')[0] || 'there';
          const template = emailTemplates.usageLimitWarning(userName, usage, limit);

          await client.emails.send({
            from: fromEmail,
            to: profile.email,
            subject: template.subject,
            html: template.html,
          });

          results.usageWarning++;
        } catch (err) {
          logger.error('Usage warning email failed', err, { userId: sub.user_id });
          results.errors++;
        }
      }
    }
  } catch (error) {
    logger.error('Cron email job failed', error);
    return NextResponse.json({ error: 'Cron job failed', results }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    results,
    timestamp: new Date().toISOString(),
  });
}
