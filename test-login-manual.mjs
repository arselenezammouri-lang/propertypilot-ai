import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testEmail = 'cliente.test.1769701040489@propilot-ai.com';
const testPassword = 'PasswordSicura123!';

console.log('🔐 Testing Login Manually...\n');
console.log('='.repeat(60));
console.log(`📧 Email: ${testEmail}`);
console.log(`🔒 Password: ${'*'.repeat(testPassword.length)}\n`);

async function testLogin() {
  try {
    console.log('1️⃣ Attempting login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.error('❌ Login failed!');
      console.error(`   Error: ${error.message}`);
      console.error(`   Status: ${error.status || 'N/A'}`);
      process.exit(1);
    }

    if (!data.user) {
      console.error('❌ Login failed: No user data returned');
      process.exit(1);
    }

    console.log('✅ Login successful!');
    console.log(`   User ID: ${data.user.id}`);
    console.log(`   Email: ${data.user.email}`);
    console.log(`   Session: ${data.session ? 'Active' : 'Inactive'}`);
    
    if (data.session) {
      console.log(`   Access Token: ${data.session.access_token.substring(0, 20)}...`);
    }

    // Test profile access
    console.log('\n2️⃣ Testing profile access...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.warn(`   ⚠️  Profile error: ${profileError.message}`);
    } else {
      console.log(`   ✅ Profile found: ${profile.full_name || 'No name'}`);
    }

    // Test subscription access
    console.log('\n3️⃣ Testing subscription access...');
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (subError) {
      console.warn(`   ⚠️  Subscription error: ${subError.message}`);
    } else if (subscription) {
      console.log(`   ✅ Subscription found: ${subscription.status}`);
    } else {
      console.log(`   ⚠️  No subscription found (defaults to free)`);
    }

    console.log('\n✅ LOGIN TEST PASSED!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Go to: http://localhost:3000/dashboard');
    console.log('   2. You should be redirected if not logged in');
    console.log('   3. Check browser console for any errors');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

testLogin();
