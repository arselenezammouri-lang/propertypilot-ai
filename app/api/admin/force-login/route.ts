import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAppUrl } from '@/lib/env';
import { timingSafeEqual } from 'crypto';
import { logger } from '@/lib/utils/safe-logger';

export const dynamic = 'force-dynamic';

const FOUNDER_USER_ID = process.env.ADMIN_FORCE_LOGIN_USER_ID || '84cae443-bedb-4cfd-9c88-bcc2ba817ed2';

function isSecretValid(providedSecret: string, expectedSecret: string): boolean {
  const provided = Buffer.from(providedSecret);
  const expected = Buffer.from(expectedSecret);

  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

export async function GET(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production';
  const adminForceLoginEnabled = process.env.ADMIN_FORCE_LOGIN_ENABLED === 'true';
  if (isProduction && !adminForceLoginEnabled) {
    return NextResponse.json({ error: 'Endpoint non disponibile.' }, { status: 404 });
  }

  const expectedSecret = process.env.ADMIN_FORCE_LOGIN_SECRET;
  if (!expectedSecret) {
    logger.error('[ADMIN FORCE LOGIN] Missing ADMIN_FORCE_LOGIN_SECRET');
    return NextResponse.json({ error: 'Configurazione admin incompleta.' }, { status: 503 });
  }

  const querySecret = request.nextUrl.searchParams.get('secret');
  const headerSecret = request.headers.get('x-admin-force-login-secret');
  const providedSecret = headerSecret || (!isProduction ? querySecret : null);

  if (!providedSecret || !isSecretValid(providedSecret, expectedSecret)) {
    return NextResponse.json(
      { error: 'Accesso negato. Secret richiesto.' },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Configurazione Supabase mancante' },
      { status: 500 }
    );
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Verifica che l'utente founder esista
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(FOUNDER_USER_ID);
    
    if (userError || !userData.user) {
      return NextResponse.json({
        error: 'Utente founder non trovato in Supabase Auth',
        details: userError?.message,
        hint: 'Esegui lo script setup-founder-supabase.js'
      }, { status: 404 });
    }

    // Genera magic link per login
    const appUrl = getAppUrl(request);

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.user.email!,
      options: {
        redirectTo: `${appUrl}/dashboard`
      }
    });

    if (linkError || !linkData) {
      return NextResponse.json({
        error: 'Impossibile generare link di accesso',
        details: linkError?.message
      }, { status: 500 });
    }

    // Redirect al magic link
    const actionLink = linkData.properties?.action_link;
    if (actionLink) {
      return NextResponse.redirect(actionLink);
    }

    return NextResponse.json({
      success: true,
      message: 'Utente verificato, ma magic link non disponibile',
      user: userData.user.email
    });
    
  } catch (error) {
    logger.error('[ADMIN FORCE LOGIN] Error', error as Error);
    return NextResponse.json({
      error: 'Errore interno',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}
