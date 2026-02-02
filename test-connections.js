const { Client } = require('pg');

async function testNeonDB() {
  console.log('=== TEST 1: DATABASE POSTGRESQL NEON ===');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query('SELECT NOW() as time, current_database() as db');
    console.log('✅ Neon DB OK:', res.rows[0]);
    
    // Check if profiles table exists
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log('📊 Tabelle disponibili:', tables.rows.map(r => r.table_name).join(', '));
    
    await client.end();
    return true;
  } catch (e) {
    console.error('❌ Neon DB Error:', e.message);
    return false;
  }
}

async function testSupabaseURL() {
  console.log('\n=== TEST 2: SUPABASE URL PING ===');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  console.log('URL:', url);
  
  try {
    const response = await fetch(url + '/rest/v1/', {
      headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY }
    });
    console.log('✅ Supabase raggiungibile, status:', response.status);
    return true;
  } catch (e) {
    console.error('❌ Supabase NON raggiungibile:', e.cause?.code || e.message);
    return false;
  }
}

async function main() {
  const neonOk = await testNeonDB();
  const supabaseOk = await testSupabaseURL();
  
  console.log('\n=== RISULTATO ===');
  console.log('Neon PostgreSQL:', neonOk ? '✅ FUNZIONA' : '❌ NON FUNZIONA');
  console.log('Supabase:', supabaseOk ? '✅ FUNZIONA' : '❌ NON FUNZIONA');
  
  if (!supabaseOk && neonOk) {
    console.log('\n⚠️ SOLUZIONE: Il progetto Supabase non è raggiungibile.');
    console.log('   Opzioni:');
    console.log('   1. Aggiornare SUPABASE_URL con URL corretto');
    console.log('   2. Usare il database Neon di Replit invece di Supabase');
  }
}

main();
