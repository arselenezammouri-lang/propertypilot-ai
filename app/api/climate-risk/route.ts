import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClimateRisk } from '@/lib/integrations/copernicus';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const schema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  country: z.string().length(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid coordinates', details: parsed.error.flatten() }, { status: 400 });
    }

    const risk = await getClimateRisk(parsed.data.lat, parsed.data.lng, parsed.data.country);

    return NextResponse.json({
      success: true,
      climateRisk: risk,
      badge: risk.overallScore >= 80 ? 'excellent' : risk.overallScore >= 60 ? 'good' : risk.overallScore >= 40 ? 'moderate' : 'high_risk',
      badgeLabel: risk.overallScore >= 80 ? `Climate Score: ${risk.overallScore}/100 ⭐` : `Climate Score: ${risk.overallScore}/100`,
    });
  } catch (err) {
    logger.error('Climate risk API error', err);
    return NextResponse.json({ error: 'Failed to assess climate risk' }, { status: 500 });
  }
}
