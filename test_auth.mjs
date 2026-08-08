import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xllppukhwuxdvonfcokj.supabase.co';
const supabaseAnonKey = 'sb_publishable_cetI1zLsNvW3h4aq8lEY9w_s9d4IsPk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('--- TESTING SUPABASE AUTHENTICATION ---');
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('❌ Supabase auth error:', error.message);
  } else {
    console.log('✅ Supabase Auth client initialized successfully!');
    console.log('Active session:', data.session ? 'Active' : 'No active session');
  }
}

testAuth();
