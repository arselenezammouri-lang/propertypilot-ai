import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti nelle env.');
  process.exit(1);
}

// Founder email to promote to agency
const founderEmail = 'arselenezammouri@gmail.com';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function makeFounderAgency() {
  console.log('👑 Promozione founder a piano AGENCY');
  console.log('   Email:', founderEmail);

  // 1) Trova l'utente per email
  const { data: usersResult, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Errore nel recupero utenti:', listError.message);
    process.exit(1);
  }

  const user = usersResult.users.find((u) => u.email === founderEmail);

  if (!user) {
    console.error('❌ Utente non trovato con questa email:', founderEmail);
    process.exit(1);
  }

  console.log('✅ Utente trovato, id:', user.id);

  // 2) Assicura che esista il profilo (solo id; subscription_plan può non esistere in alcuni DB)
  const { data: existingProfile, error: profileFetchError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (profileFetchError) {
    console.error('❌ Errore nel recupero del profilo:', profileFetchError.message);
    process.exit(1);
  }

  if (!existingProfile) {
    console.log('ℹ️ Nessun profilo trovato, lo creo ora...');
    const { error: profileInsertError } = await supabaseAdmin.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Founder',
    });

    if (profileInsertError) {
      console.error('❌ Errore nella creazione del profilo:', profileInsertError.message);
      process.exit(1);
    }
  }

  // Opzionale: aggiorna profiles.subscription_plan se la colonna esiste
  const { error: planErr } = await supabaseAdmin.from('profiles').update({ subscription_plan: 'agency' }).eq('id', user.id);
  if (planErr) console.warn('(profiles.subscription_plan ignorato:', planErr.message, ')');

  // 3) Assicura che la tabella subscriptions segni lo stato come agency
  const { data: existingSubscription, error: subFetchError } = await supabaseAdmin
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (subFetchError) {
    console.error('❌ Errore nel recupero della subscription:', subFetchError.message);
    process.exit(1);
  }

  if (!existingSubscription) {
    console.log('ℹ️ Nessuna subscription trovata, la creo ora con stato agency...');
    const { error: subInsertError } = await supabaseAdmin.from('subscriptions').insert({
      user_id: user.id,
      status: 'agency',
    });

    if (subInsertError) {
      console.error('❌ Errore nella creazione della subscription:', subInsertError.message);
      process.exit(1);
    }
  } else {
    console.log('ℹ️ Subscription esistente, aggiorno status -> agency...');
    const { error: subUpdateError } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'agency' })
      .eq('id', existingSubscription.id);

    if (subUpdateError) {
      console.error('❌ Errore nell\'aggiornamento della subscription:', subUpdateError.message);
      process.exit(1);
    }
  }

  console.log('\n✅ Operazione completata: il tuo account ora è segnato come AGENCY in Supabase.');
}

makeFounderAgency().catch((err) => {
  console.error('❌ Script make-me-agency crashed:', err);
  process.exit(1);
});

