const { createClient } = require('@supabase/supabase-js');

const FOUNDER_ID = '84cae443-bedb-4cfd-9c88-bcc2ba817ed2';
const FOUNDER_EMAIL = 'arselenezammouri@gmail.com';

async function setupFounder() {
  console.log('🔧 SETUP FOUNDER SU NUOVO SUPABASE\n');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // STEP 1: Verifica/Crea utente Auth
  console.log('--- STEP 1: Utente Auth ---');
  const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserById(FOUNDER_ID);
  
  if (existingUser?.user) {
    console.log('✅ Utente Auth già esiste:', existingUser.user.email);
  } else {
    console.log('⚠️ Utente non trovato, creazione...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      id: FOUNDER_ID,
      email: FOUNDER_EMAIL,
      password: 'PropertyPilot2024!',
      email_confirm: true,
      user_metadata: { full_name: 'Arselen Zammour', role: 'founder' }
    });
    
    if (createError) {
      console.error('❌ Errore creazione:', createError.message);
      
      // Se email esiste, trova l'utente
      if (createError.message.includes('already') || createError.message.includes('exists')) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const found = users?.find(u => u.email === FOUNDER_EMAIL);
        if (found) {
          console.log('✅ Utente trovato con ID:', found.id);
          console.log('   Aggiorna FOUNDER_ID a:', found.id);
        }
      }
    } else {
      console.log('✅ Utente creato:', newUser?.user?.email);
    }
  }

  // STEP 2: Crea profilo
  console.log('\n--- STEP 2: Profilo DB ---');
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', FOUNDER_ID)
    .single();
  
  if (existingProfile) {
    console.log('✅ Profilo già esiste');
    await supabase.from('profiles').update({ subscription_status: 'agency' }).eq('id', FOUNDER_ID);
    console.log('✅ Piano aggiornato a Agency');
  } else {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: FOUNDER_ID,
      full_name: 'Arselen Zammour',
      email: FOUNDER_EMAIL,
      subscription_status: 'agency',
    });
    if (insertError) console.error('❌ Errore profilo:', insertError.message);
    else console.log('✅ Profilo creato');
  }

  // STEP 3: Crea subscription
  console.log('\n--- STEP 3: Subscription ---');
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', FOUNDER_ID)
    .single();
  
  if (existingSub) {
    console.log('✅ Subscription già esiste');
    await supabase.from('subscriptions').update({ status: 'agency' }).eq('user_id', FOUNDER_ID);
  } else {
    const { error: subError } = await supabase.from('subscriptions').insert({
      user_id: FOUNDER_ID,
      status: 'agency',
      plan: 'agency',
    });
    if (subError) console.log('⚠️ Subscription non creata (tabella potrebbe non esistere):', subError.message);
    else console.log('✅ Subscription creata');
  }

  console.log('\n🏁 FOUNDER SETUP COMPLETATO!');
  console.log('📧 Email:', FOUNDER_EMAIL);
  console.log('🔑 Password: PropertyPilot2024!');
  console.log('💎 Piano: Agency');
}

setupFounder().catch(console.error);
