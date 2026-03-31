import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/env';
import { logger } from '@/lib/utils/safe-logger';
import { supabaseService } from '@/lib/supabase/service';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

function fallbackReferralCode(userId: string): string {
  return `PPID-${userId}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabaseService
      .from('profiles')
      .select('referral_code, referral_bonus_credits, total_referrals')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116' && profileError.code !== '42703') {
      logger.error('Error fetching profile', profileError, { endpoint: '/api/referral' });
      return NextResponse.json({ error: 'Errore nel recupero dati' }, { status: 500 });
    }
    
    if (profileError?.code === '42703') {
      logger.warn('Profile table missing referral columns, using fallback referral code', { endpoint: '/api/referral' });
      const appUrl = getAppUrl(request);
      const code = fallbackReferralCode(user.id);
      return NextResponse.json({
        referralCode: code,
        referralLink: `${appUrl}/auth/signup?ref=${encodeURIComponent(code)}`,
        bonusCredits: 0,
        totalReferrals: 0,
        setupRequired: true,
      });
    }

    let referralCode = profile?.referral_code || fallbackReferralCode(user.id);

    if (!profile?.referral_code) {
      const generatedCode = nanoid(8).toUpperCase();
      
      const { error: updateError } = await supabaseService
        .from('profiles')
        .update({ referral_code: generatedCode })
        .eq('id', user.id);

      if (updateError && updateError.code !== '42703') {
        console.error('Error creating referral code:', updateError);
        return NextResponse.json({ error: 'Errore nella creazione del codice' }, { status: 500 });
      }

      if (!updateError) {
        referralCode = generatedCode;
      }
    }

    const appUrl = getAppUrl(request);
    const referralLink = `${appUrl}/auth/signup?ref=${referralCode}`;

    return NextResponse.json({
      referralCode,
      referralLink,
      bonusCredits: profile?.referral_bonus_credits || 0,
      totalReferrals: profile?.total_referrals || 0,
    });
  } catch (error) {
    console.error('Error in referral endpoint:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { referralCode } = await request.json();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json({ error: 'Codice referral mancante' }, { status: 400 });
    }

    const normalizedCode = referralCode.trim();
    let referrerId: string | null = null;
    let referrerCredits = 0;
    let referrerTotal = 0;

    if (normalizedCode.startsWith('PPID-')) {
      referrerId = normalizedCode.replace('PPID-', '');
      const { data: referrerFromId, error: referrerFromIdError } = await supabase
        .from('profiles')
        .select('id, referral_bonus_credits, total_referrals')
        .eq('id', referrerId)
        .maybeSingle();

      if (referrerFromIdError && referrerFromIdError.code !== '42703') {
        return NextResponse.json({ error: 'Codice referral non valido' }, { status: 400 });
      }
      if (!referrerFromId && !referrerFromIdError) {
        return NextResponse.json({ error: 'Codice referral non valido' }, { status: 400 });
      }
      referrerCredits = referrerFromId?.referral_bonus_credits || 0;
      referrerTotal = referrerFromId?.total_referrals || 0;
    } else {
      const { data: referrer, error: referrerError } = await supabase
        .from('profiles')
        .select('id, referral_bonus_credits, total_referrals')
        .eq('referral_code', normalizedCode.toUpperCase())
        .single();

      if (referrerError || !referrer) {
        return NextResponse.json({ error: 'Codice referral non valido' }, { status: 400 });
      }

      referrerId = referrer.id;
      referrerCredits = referrer.referral_bonus_credits || 0;
      referrerTotal = referrer.total_referrals || 0;
    }

    if (referrerId === user.id) {
      return NextResponse.json({ error: 'Non puoi usare il tuo stesso codice' }, { status: 400 });
    }

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('referred_by')
      .eq('id', user.id)
      .single();

    if (userProfile?.referred_by) {
      return NextResponse.json({ error: 'Hai già utilizzato un codice referral' }, { status: 400 });
    }

    const BONUS_CREDITS = 10;
    
    const { error: updateUserError } = await supabase
      .from('profiles')
      .update({ referred_by: referrerId })
      .eq('id', user.id);

    if (updateUserError) {
      if (updateUserError.code === '42703') {
        return NextResponse.json({
          success: true,
          message: 'Codice referral ricevuto. Tracking completo disponibile dopo aggiornamento schema referral.',
          setupRequired: true,
        });
      }
      console.error('Error updating referred user:', updateUserError);
      return NextResponse.json({ error: 'Errore nella registrazione' }, { status: 500 });
    }

    const { error: updateReferrerError } = await supabase
      .from('profiles')
      .update({ 
        referral_bonus_credits: referrerCredits + BONUS_CREDITS,
        total_referrals: referrerTotal + 1 
      })
      .eq('id', referrerId);

    if (updateReferrerError) {
      if (updateReferrerError.code === '42703') {
        return NextResponse.json({
          success: true,
          message: 'Referral registrato. Statistiche bonus disponibili dopo aggiornamento schema referral.',
          setupRequired: true,
        });
      }
      console.error('Error updating referrer bonus:', updateReferrerError);
      await supabase
        .from('profiles')
        .update({ referred_by: null })
        .eq('id', user.id);
      return NextResponse.json({ error: 'Errore nel bonus referral' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Referral registrato con successo! +10 crediti AI per il tuo amico!' 
    });
  } catch (error) {
    console.error('Error processing referral:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
