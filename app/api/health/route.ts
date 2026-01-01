import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Stripe from 'stripe';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: { status: 'ok' | 'error' | 'unconfigured'; latencyMs?: number; error?: string };
    openai: { status: 'ok' | 'error' | 'unconfigured'; latencyMs?: number };
    stripe: { status: 'ok' | 'error' | 'unconfigured'; latencyMs?: number };
  };
  message?: string;
}

const startTime = Date.now();

async function checkDatabase(): Promise<{ status: 'ok' | 'error' | 'unconfigured'; latencyMs?: number; error?: string }> {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return { status: 'unconfigured', error: 'Missing DATABASE_URL' };
  }

  const start = Date.now();
  try {
    const { Pool } = await import('@neondatabase/serverless');
    const pool = new Pool({ connectionString: databaseUrl });
    
    const result = await pool.query('SELECT 1 as ping');
    await pool.end();
    
    if (result.rows[0]?.ping === 1) {
      return { status: 'ok', latencyMs: Date.now() - start };
    }
    return { status: 'error', error: 'Unexpected query result' };
  } catch (err) {
    return { status: 'error', error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

async function checkOpenAI(): Promise<{ status: 'ok' | 'error' | 'unconfigured'; latencyMs?: number }> {
  if (!process.env.OPENAI_API_KEY) {
    return { status: 'unconfigured' };
  }

  const start = Date.now();
  try {
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 5000,
    });
    
    await openai.models.retrieve('gpt-4o-mini');
    return { status: 'ok', latencyMs: Date.now() - start };
  } catch {
    return { status: 'error' };
  }
}

async function checkStripe(): Promise<{ status: 'ok' | 'error' | 'unconfigured'; latencyMs?: number }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { status: 'unconfigured' };
  }

  const start = Date.now();
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
      timeout: 5000,
    });
    
    await stripe.balance.retrieve();
    return { status: 'ok', latencyMs: Date.now() - start };
  } catch {
    return { status: 'error' };
  }
}

export async function GET() {
  const [dbCheck, openaiCheck, stripeCheck] = await Promise.all([
    checkDatabase(),
    checkOpenAI(),
    checkStripe(),
  ]);

  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      database: dbCheck,
      openai: openaiCheck,
      stripe: stripeCheck,
    },
  };

  if (dbCheck.status === 'error') {
    health.status = 'unhealthy';
    health.message = `Database connection failed: ${dbCheck.error || 'Unknown error'}`;
  } else if (openaiCheck.status === 'error' || stripeCheck.status === 'error') {
    health.status = 'degraded';
    health.message = 'Some services unavailable';
  } else if (dbCheck.status === 'unconfigured' || openaiCheck.status === 'unconfigured' || stripeCheck.status === 'unconfigured') {
    health.status = 'degraded';
    health.message = 'Some services not configured';
  }

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
