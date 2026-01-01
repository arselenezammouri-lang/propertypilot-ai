import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testEmail = 'test.propertycopy@gmail.com';

async function confirmUserEmail() {
  console.log('Confirming email for test user:', testEmail);
  
  // Get user by email
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
    process.exit(1);
  }
  
  const user = users.find(u => u.email === testEmail);
  
  if (!user) {
    console.error('Test user not found');
    process.exit(1);
  }
  
  console.log('Found user:', user.id);
  console.log('Email confirmed:', user.email_confirmed_at ? 'YES' : 'NO');
  
  if (user.email_confirmed_at) {
    console.log('✅ Email already confirmed!');
    process.exit(0);
  }
  
  // Update user to confirm email
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { email_confirm: true }
  );
  
  if (error) {
    console.error('Error confirming email:', error.message);
    process.exit(1);
  }
  
  console.log('✅ Email confirmed successfully!');
  console.log('\n📧 Test Credentials:');
  console.log('Email:', testEmail);
  console.log('Password: TestPassword123!');
  console.log('User ID:', user.id);
  console.log('Email confirmed:', new Date().toISOString());
}

confirmUserEmail();
