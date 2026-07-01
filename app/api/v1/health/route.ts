import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Public API v1 Health Check */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: 'v1',
    timestamp: new Date().toISOString(),
    services: {
      api: 'operational',
      database: 'operational',
      ai: 'operational',
    },
  });
}
