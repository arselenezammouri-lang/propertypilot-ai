const { createClient } = require('@supabase/supabase-js');

async function getFounderId() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  // Cerca l'utente con email arselenezammouri@gmail.com
  const { data: { users } } = await supabase.auth.admin.listUsers();
  
  console.log('Tutti gli utenti Auth:');
  users?.forEach(u => {
    console.log(`  - ${u.email} (ID: ${u.id})`);
  });
  
  const founder = users?.find(u => u.email === 'arselenezammouri@gmail.com');
  if (founder) {
    console.log('\n✅ FOUNDER TROVATO:');
    console.log('   ID:', founder.id);
    console.log('   Email:', founder.email);
  } else {
    console.log('\n⚠️ Founder non trovato, creiamolo...');
  }
}

getFounderId();
