import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xllppukhwuxdvonfcokj.supabase.co';
const supabaseAnonKey = 'sb_publishable_cetI1zLsNvW3h4aq8lEY9w_s9d4IsPk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDoctorRegistration() {
  console.log('--- TESTING DOCTOR REGISTRATION & UPSERT ---');
  const newDoctor = {
    id: 'doc_test_' + Date.now(),
    name: 'Dr. Test Doctor',
    role: 'phc',
    designation: 'Medical Officer',
    facility: 'PHC Hosahalli, Tumakuru District',
    registration: 'KMC-99999'
  };

  const { data, error } = await supabase.from('doctor_users').upsert(newDoctor).select();

  if (error) {
    console.error('❌ Direct DB Registration Error:', error.message);
  } else {
    console.log('✅ Doctor Registration Succeeded! Registered doctor:', data[0].name);
  }
}

testDoctorRegistration();
