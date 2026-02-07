import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/health
 * Health check endpoint for monitoring
 */
export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: 'ok' | 'error'; message?: string; latency?: number }> = {};

  // Check Supabase connection
  try {
    const supabase = await createClient();
    const supabaseStart = Date.now();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    const supabaseLatency = Date.now() - supabaseStart;
    
    if (error) {
      checks.supabase = { status: 'error', message: error.message, latency: supabaseLatency };
    } else {
      checks.supabase = { status: 'ok', latency: supabaseLatency };
    }
  } catch (error: any) {
    checks.supabase = { status: 'error', message: error.message };
  }

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  
  const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
  if (missingEnvVars.length > 0) {
    checks.environment = { status: 'error', message: `Missing: ${missingEnvVars.join(', ')}` };
  } else {
    checks.environment = { status: 'ok' };
  }

  const totalLatency = Date.now() - startTime;
  const allHealthy = Object.values(checks).every(check => check.status === 'ok');

  return NextResponse.json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
    latency: totalLatency,
  }, {
    status: allHealthy ? 200 : 503,
  });
}
