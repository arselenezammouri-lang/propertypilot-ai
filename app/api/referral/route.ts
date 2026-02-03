import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';
import { nanoid } from 'nanoid';

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
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Errore nel recupero dati' }, { status: 500 });
    }
    
    if (profileError?.code === '42703') {
      console.warn('Profile table missing referral columns, returning defaults');
      return NextResponse.json({
        referralCode: null,
        referralLink: null,
        bonusCredits: 0,
        totalReferrals: 0,
        setupRequired: true,
      });
    }

    let referralCode = profile?.referral_code;

    if (!referralCode) {
      referralCode = nanoid(8).toUpperCase();
      
      const { error: updateError } = await supabaseService
        .from('profiles')
        .update({ referral_code: referralCode })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error creating referral code:', updateError);
        return NextResponse.json({ error: 'Errore nella creazione del codice' }, { status: 500 });
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://propertypilot.ai';
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

    if (!referralCode) {
      return NextResponse.json({ error: 'Codice referral mancante' }, { status: 400 });
    }

    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id, referral_bonus_credits, total_referrals')
      .eq('referral_code', referralCode.toUpperCase())
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json({ error: 'Codice referral non valido' }, { status: 400 });
    }

    if (referrer.id === user.id) {
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
      .update({ referred_by: referrer.id })
      .eq('id', user.id);

    if (updateUserError) {
      console.error('Error updating referred user:', updateUserError);
      return NextResponse.json({ error: 'Errore nella registrazione' }, { status: 500 });
    }

    const { error: updateReferrerError } = await supabase
      .from('profiles')
      .update({ 
        referral_bonus_credits: (referrer.referral_bonus_credits || 0) + BONUS_CREDITS,
        total_referrals: (referrer.total_referrals || 0) + 1 
      })
      .eq('id', referrer.id);

    if (updateReferrerError) {
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
