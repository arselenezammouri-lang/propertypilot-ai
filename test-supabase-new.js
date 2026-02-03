const { createClient } = require('@supabase/supabase-js');

async function testNewSupabase() {
  console.log('=== TEST NUOVO SUPABASE ===\n');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('URL:', url);
  console.log('Service Key:', serviceKey?.substring(0, 30) + '...');
  
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  // Test 1: Ping
  console.log('\n--- TEST 1: Ping Supabase ---');
  try {
    const response = await fetch(url + '/rest/v1/', {
      headers: { 'apikey': serviceKey }
    });
    console.log('✅ Supabase raggiungibile, status:', response.status);
  } catch (e) {
    console.error('❌ Supabase NON raggiungibile:', e.message);
    process.exit(1);
  }
  
  // Test 2: Check profiles table
  console.log('\n--- TEST 2: Tabella profiles ---');
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);
  
  if (profilesError) {
    console.log('⚠️ Tabella profiles non esiste o errore:', profilesError.message);
    console.log('   Creeremo le tabelle necessarie...');
  } else {
    console.log('✅ Tabella profiles esiste, record:', profiles?.length || 0);
  }
  
  // Test 3: Check Auth users
  console.log('\n--- TEST 3: Auth Users ---');
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('❌ Errore Auth:', authError.message);
  } else {
    console.log('✅ Auth funzionante, utenti:', authData.users?.length || 0);
    if (authData.users?.length > 0) {
      console.log('   Primo utente:', authData.users[0].email);
    }
  }
  
  console.log('\n✅ CONNESSIONE SUPABASE OK!');
}

testNewSupabase().catch(console.error);
