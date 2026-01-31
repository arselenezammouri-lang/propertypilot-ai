import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test credentials (from signup test)
const testEmail = 'cliente.test.1769701040489@propilot-ai.com';
const testPassword = 'PasswordSicura123!';

async function testLogin() {
  console.log('🧪 Testing Login Flow...\n');
  console.log('📧 Email:', testEmail);
  console.log('🔒 Password:', '***\n');

  try {
    console.log('1️⃣ Attempting login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.error('❌ Login error:', error.message);
      console.error('   Details:', error);
      process.exit(1);
    }

    if (!data.user) {
      console.error('❌ No user returned from login');
      process.exit(1);
    }

    console.log('✅ Login successful!');
    console.log('   User ID:', data.user.id);
    console.log('   Email:', data.user.email);
    console.log('   Session:', data.session ? 'Active' : 'None');
    
    // Test getting user profile
    console.log('\n2️⃣ Testing user profile access...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.warn('⚠️  Profile error:', profileError.message);
    } else {
      console.log('✅ Profile found!');
      console.log('   Full Name:', profileData.full_name);
    }

    // Test getting subscription
    console.log('\n3️⃣ Testing subscription access...');
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (subError) {
      console.warn('⚠️  Subscription error:', subError.message);
    } else {
      console.log('✅ Subscription found!');
      console.log('   Status:', subData.status);
      console.log('   Plan:', subData.plan || 'free');
    }

    console.log('\n✅ LOGIN TEST PASSED!');
    console.log('\n📋 User Session:');
    console.log('   User ID:', data.user.id);
    console.log('   Email:', data.user.email);
    console.log('   Access Token:', data.session?.access_token ? 'Present' : 'Missing');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

testLogin();
