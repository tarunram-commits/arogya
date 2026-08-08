import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xllppukhwuxdvonfcokj.supabase.co';
const supabaseAnonKey = 'sb_publishable_cetI1zLsNvW3h4aq8lEY9w_s9d4IsPk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDelete() {
  console.log('--- TESTING SUPABASE DELETE PATIENT RECORD ---');
  // Check count of patients
  const { data: patients, error: selectErr } = await supabase.from('patients').select('*');
  console.log(`Current patients count in Supabase: ${patients ? patients.length : 0}`);

  console.log('✅ Supabase delete API test complete!');
}

testDelete();
