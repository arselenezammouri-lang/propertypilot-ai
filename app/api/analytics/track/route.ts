import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/safe-logger';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const trackEventSchema = z.object({
  event: z.string().min(1).max(100),
  properties: z.record(z.any()).optional(),
});

/**
 * POST /api/analytics/track
 * Track custom events server-side
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = trackEventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { event, properties } = validation.data;

    // Get user if authenticated
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch {
      // Not authenticated, continue without userId
    }

    // Log event (in production, send to analytics service)
    logger.debug('Analytics event', {
      event,
      properties,
      userId,
      endpoint: '/api/analytics/track',
    });

    // In production, you might want to:
    // - Store in database (analytics_events table)
    // - Send to external analytics (Mixpanel, Amplitude, etc.)
    // - Real-time dashboard updates

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Analytics tracking error', error, { endpoint: '/api/analytics/track' });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
