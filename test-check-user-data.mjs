import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testEmail = 'cliente.test.1769701040489@propilot-ai.com';
const testPassword = 'PasswordSicura123!';

async function checkUserData() {
  console.log('🔍 Checking User Data...\n');

  // Login first
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (authError || !authData.user) {
    console.error('❌ Login failed:', authError?.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log('✅ Logged in as:', userId);
  console.log('   Email:', authData.user.email);
  console.log('   Full Name (metadata):', authData.user.user_metadata?.full_name || 'Not set\n');

  // Check profile
  console.log('1️⃣ Checking profile...');
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);

  if (profileError) {
    console.error('❌ Profile query error:', profileError.message);
  } else if (!profiles || profiles.length === 0) {
    console.warn('⚠️  No profile found! Profile should be created by database trigger.');
    console.log('   Attempting to create profile manually...');
    
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: authData.user.user_metadata?.full_name || 'Cliente Test PropertyPilot',
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create profile:', createError.message);
    } else {
      console.log('✅ Profile created manually!');
      console.log('   Full Name:', newProfile.full_name);
    }
  } else {
    console.log('✅ Profile found!');
    profiles.forEach(p => {
      console.log('   Full Name:', p.full_name);
      console.log('   Created:', p.created_at);
    });
  }

  // Check subscription
  console.log('\n2️⃣ Checking subscription...');
  const { data: subscriptions, error: subError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId);

  if (subError) {
    console.error('❌ Subscription query error:', subError.message);
  } else if (!subscriptions || subscriptions.length === 0) {
    console.warn('⚠️  No subscription found! Subscription should be created by database trigger.');
    console.log('   Attempting to create subscription manually...');
    
    const { data: newSub, error: createSubError } = await supabase
      .from('subscriptions')
      .insert({
        id: crypto.randomUUID(),
        user_id: userId,
        status: 'free',
      })
      .select()
      .single();

    if (createSubError) {
      console.error('❌ Failed to create subscription:', createSubError.message);
    } else {
      console.log('✅ Subscription created manually!');
      console.log('   Status:', newSub.status);
      console.log('   Plan:', newSub.plan);
    }
  } else {
    console.log('✅ Subscription found!');
    subscriptions.forEach(s => {
      console.log('   Status:', s.status);
      console.log('   ID:', s.id);
      console.log('   Created:', s.created_at);
    });
  }

  console.log('\n✅ User Data Check Complete!');
  process.exit(0);
}

checkUserData();
