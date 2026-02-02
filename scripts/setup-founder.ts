import { createClient } from '@supabase/supabase-js';

const FOUNDER_ID = '84cae443-bedb-4cfd-9c88-bcc2ba817ed2';
const FOUNDER_EMAIL = 'arselenezammouri@gmail.com';

async function main() {
  console.log('🔧 PropertyPilot AI - Founder Setup Script\n');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ ERRORE: SUPABASE_URL non configurato');
    console.log('Variabili disponibili:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error('❌ ERRORE: SUPABASE_SERVICE_ROLE_KEY non configurato');
    process.exit(1);
  }

  console.log('📡 Supabase URL:', supabaseUrl);
  console.log('🔑 Service Role Key:', serviceRoleKey.substring(0, 20) + '...');

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // STEP 1: Test connessione leggendo profiles
  console.log('\n--- STEP 1: Test Connessione ---');
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.error('❌ Errore lettura profiles:', profilesError.message);
      console.error('Dettagli:', profilesError);
    } else {
      console.log('✅ Connessione DB OK! Profili trovati:', profiles?.length || 0);
      if (profiles && profiles.length > 0) {
        console.log('Esempio profilo:', JSON.stringify(profiles[0], null, 2));
      }
    }
  } catch (e) {
    console.error('❌ Errore di rete:', e);
  }

  // STEP 2: Verifica/Crea utente Auth
  console.log('\n--- STEP 2: Setup Utente Auth ---');
  try {
    // Prima verifica se l'utente esiste
    const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserById(FOUNDER_ID);
    
    if (existingUser?.user) {
      console.log('✅ Utente Auth già esiste:', existingUser.user.email);
    } else {
      console.log('⚠️ Utente non trovato, tentativo creazione...');
      
      // Crea nuovo utente con ID specifico
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        id: FOUNDER_ID,
        email: FOUNDER_EMAIL,
        password: 'PropertyPilot2024!',
        email_confirm: true,
        user_metadata: {
          full_name: 'Arselen Zammour',
          role: 'founder'
        }
      });

      if (createError) {
        console.error('❌ Errore creazione utente:', createError.message);
        
        // Se l'email esiste già, proviamo a recuperare l'utente
        if (createError.message.includes('already') || createError.message.includes('exists')) {
          console.log('📧 Email già registrata, cercando utente...');
          const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
          const foundUser = users?.find(u => u.email === FOUNDER_EMAIL);
          if (foundUser) {
            console.log('✅ Utente trovato con ID diverso:', foundUser.id);
            console.log('⚠️ Usa questo ID invece:', foundUser.id);
          }
        }
      } else {
        console.log('✅ Utente creato:', newUser?.user?.email);
      }
    }
  } catch (e) {
    console.error('❌ Errore Auth:', e);
  }

  // STEP 3: Verifica/Crea profilo nel DB
  console.log('\n--- STEP 3: Setup Profilo DB ---');
  try {
    // Verifica se il profilo esiste
    const { data: existingProfile, error: getProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', FOUNDER_ID)
      .single();

    if (existingProfile) {
      console.log('✅ Profilo già esiste:', existingProfile);
      
      // Aggiorna a piano agency se necessario
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_status: 'agency' })
        .eq('user_id', FOUNDER_ID);
        
      if (updateError) {
        console.error('❌ Errore aggiornamento piano:', updateError.message);
      } else {
        console.log('✅ Piano aggiornato a Agency');
      }
    } else {
      console.log('⚠️ Profilo non trovato, creazione...');
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: FOUNDER_ID,
          full_name: 'Arselen Zammour',
          email: FOUNDER_EMAIL,
          subscription_status: 'agency',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Errore creazione profilo:', insertError.message);
        console.error('Dettagli:', insertError);
      } else {
        console.log('✅ Profilo creato:', newProfile);
      }
    }
  } catch (e) {
    console.error('❌ Errore profilo:', e);
  }

  // STEP 4: Verifica subscription
  console.log('\n--- STEP 4: Setup Subscription ---');
  try {
    const { data: existingSub, error: getSubError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', FOUNDER_ID)
      .single();

    if (existingSub) {
      console.log('✅ Subscription già esiste:', existingSub.status);
      
      // Aggiorna a agency
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: 'agency', plan: 'agency' })
        .eq('user_id', FOUNDER_ID);
        
      if (!updateError) {
        console.log('✅ Subscription aggiornata a Agency');
      }
    } else {
      console.log('⚠️ Subscription non trovata, creazione...');
      
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: FOUNDER_ID,
          status: 'agency',
          plan: 'agency',
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('❌ Errore creazione subscription:', insertError.message);
      } else {
        console.log('✅ Subscription creata');
      }
    }
  } catch (e) {
    console.error('❌ Errore subscription:', e);
  }

  console.log('\n🏁 Setup Founder completato!');
  console.log('📧 Email:', FOUNDER_EMAIL);
  console.log('🔑 Password: PropertyPilot2024!');
  console.log('💎 Piano: Agency');
}

main().catch(console.error);
