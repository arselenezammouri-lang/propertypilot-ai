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

// Test credentials
const testEmail = `cliente.test.${Date.now()}@propilot-ai.com`;
const testPassword = 'PasswordSicura123!';
const testFullName = 'Cliente Test PropertyPilot';

async function testSignup() {
  console.log('🧪 Testing Signup Flow...\n');
  console.log('📧 Email:', testEmail);
  console.log('👤 Name:', testFullName);
  console.log('🔒 Password:', '***\n');

  try {
    // Test signup
    console.log('1️⃣ Attempting signup...');
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testFullName,
        },
      },
    });

    if (error) {
      console.error('❌ Signup error:', error.message);
      console.error('   Details:', error);
      
      // If user already exists, try login
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        console.log('\n⚠️  User already exists, testing login instead...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });
        
        if (loginError) {
          console.error('❌ Login error:', loginError.message);
          process.exit(1);
        }
        
        console.log('✅ Login successful!');
        console.log('   User ID:', loginData.user?.id);
        process.exit(0);
      }
      
      process.exit(1);
    }

    if (!data.user) {
      console.error('❌ No user returned from signup');
      process.exit(1);
    }

    console.log('✅ Signup successful!');
    console.log('   User ID:', data.user.id);
    console.log('   Email:', data.user.email);
    console.log('   Email confirmed:', data.user.email_confirmed_at ? 'YES' : 'NO');
    
    if (data.user.identities?.length === 0) {
      console.log('\n⚠️  Note: Email confirmation may be required.');
      console.log('   Check Supabase settings to disable email confirmation for testing.');
    }

    console.log('\n✅ SIGNUP TEST PASSED!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email:', testEmail);
    console.log('   Password:', testPassword);
    console.log('   Full Name:', testFullName);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

testSignup();
