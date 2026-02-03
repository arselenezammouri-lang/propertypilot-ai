const { createClient } = require('@supabase/supabase-js');

const FOUNDER_ID = '84cae443-bedb-4cfd-9c88-bcc2ba817ed2';
const FOUNDER_EMAIL = 'arselenezammouri@gmail.com';

async function updateFounder() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  console.log('🔧 Aggiornamento utente founder...\n');
  
  // Aggiorna l'email dell'utente esistente
  const { data, error } = await supabase.auth.admin.updateUserById(FOUNDER_ID, {
    email: FOUNDER_EMAIL,
    email_confirm: true,
    password: 'PropertyPilot2024!',
    user_metadata: { full_name: 'Arselen Zammour', role: 'founder' }
  });
  
  if (error) {
    console.error('❌ Errore aggiornamento:', error.message);
  } else {
    console.log('✅ Utente aggiornato:');
    console.log('   ID:', data.user.id);
    console.log('   Email:', data.user.email);
  }
  
  // Aggiorna profilo
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: FOUNDER_ID,
      full_name: 'Arselen Zammour',
      email: FOUNDER_EMAIL,
      subscription_status: 'agency',
    }, { onConflict: 'id' });
  
  if (profileError) {
    console.error('⚠️ Profilo:', profileError.message);
  } else {
    console.log('✅ Profilo aggiornato');
  }
  
  console.log('\n🏁 FOUNDER PRONTO!');
  console.log('📧 Email:', FOUNDER_EMAIL);
  console.log('🔑 Password: PropertyPilot2024!');
}

updateFounder();
