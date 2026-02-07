import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/safe-logger';

/**
 * POST /api/analytics/web-vitals
 * Track Core Web Vitals server-side
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, id } = body;

    // Log web vital (in production, send to analytics service)
    logger.debug('Web Vital', {
      name,
      value,
      id,
      endpoint: '/api/analytics/web-vitals',
    });

    // In production, you might want to:
    // - Store in database for analysis
    // - Send to external analytics (Google Analytics, Mixpanel, etc.)
    // - Alert if metrics exceed thresholds

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Web vitals tracking error', error, { endpoint: '/api/analytics/web-vitals' });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
