import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, subscriptions, users } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const FOUNDER_USER_ID = '84cae443-bedb-4cfd-9c88-bcc2ba817ed2';
const FOUNDER_EMAIL = 'arselenezammouri@gmail.com';
const ADMIN_SECRET = process.env.SESSION_SECRET || 'propertypilot-admin-2024';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json(
      { error: 'Accesso negato. Secret richiesto.' },
      { status: 401 }
    );
  }

  try {
    // Verifica che il founder esista nel database locale
    const [founderProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, FOUNDER_USER_ID))
      .limit(1);

    const [founderSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, FOUNDER_USER_ID))
      .limit(1);

    const [founderUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, FOUNDER_EMAIL))
      .limit(1);

    if (!founderProfile && !founderUser) {
      return NextResponse.json({
        error: 'Utente founder non trovato nel database',
        hint: 'Esegui lo script SQL per creare il founder'
      }, { status: 404 });
    }

    // Genera JWT session token
    const sessionSecret = new TextEncoder().encode(ADMIN_SECRET);
    const token = await new SignJWT({
      sub: FOUNDER_USER_ID,
      email: FOUNDER_EMAIL,
      name: founderProfile?.fullName || 'Arselen Zammour',
      plan: founderSubscription?.status || 'agency',
      role: 'founder',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 giorni
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(sessionSecret);

    // Set cookie di sessione
    const cookieStore = await cookies();
    cookieStore.set('pp-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 giorni
      path: '/'
    });

    // Redirect alla dashboard
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
      'https://6e654fc4-30bf-4598-8519-3d3a94ef0cab-00-2iz1mwnl39tyd.spock.replit.dev';
    
    return NextResponse.redirect(`${appUrl}/dashboard`);
    
  } catch (error) {
    console.error('Force login error:', error);
    return NextResponse.json({
      error: 'Errore interno',
      details: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
