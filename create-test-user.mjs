import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Use valid email domain
const testEmail = 'test.propertycopy@gmail.com';
const testPassword = 'TestPassword123!';

async function createTestUser() {
  console.log('Creating test user:', testEmail);
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      emailRedirectTo: undefined,
      data: {
        full_name: 'Test User E2E',
        company: 'E2E Testing Inc'
      }
    }
  });

  if (error) {
    console.error('Error creating test user:', error.message);
    
    // Try to sign in if user already exists
    console.log('\nTrying to sign in with existing credentials...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.error('Sign in error:', signInError.message);
      process.exit(1);
    }
    
    console.log('✅ Successfully signed in with existing user');
    console.log('\n📧 Test Credentials:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    console.log('User ID:', signInData.user?.id);
    process.exit(0);
  }

  console.log('✅ Test user created successfully!');
  console.log('\n📧 Test Credentials:');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('User ID:', data.user?.id);
  
  if (data.user?.identities?.length === 0) {
    console.log('\n⚠️  Note: Email confirmation may be required. Check if email confirmation is disabled in Supabase settings.');
  }
}

createTestUser();
