import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const FOUNDER_USER_ID = '84cae443-bedb-4cfd-9c88-bcc2ba817ed2';
const FOUNDER_EMAIL = 'arselenezammouri@gmail.com';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  // Accetta sia SESSION_SECRET che LANCIO_IMPERO_2026
  const validSecrets = [
    process.env.SESSION_SECRET,
    'LANCIO_IMPERO_2026',
    'propertypilot-admin-2024'
  ].filter(Boolean);
  
  if (!secret || !validSecrets.includes(secret)) {
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
      'https://6e654fc4-30bf-4598-8519-3d3a94ef0cab-00-2iz1mwnl39tyd.spock.replit.dev';

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
    console.error('Force login error:', error);
    return NextResponse.json({
      error: 'Errore interno',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}
