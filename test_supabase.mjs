import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xllppukhwuxdvonfcokj.supabase.co';
const supabaseAnonKey = 'sb_publishable_cetI1zLsNvW3h4aq8lEY9w_s9d4IsPk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('--- SUPABASE DATABASE CHECK ---');
  
  const { data: patients, error: pError } = await supabase.from('patients').select('*');
  if (pError) {
    console.error('❌ Error querying patients table:', pError.message);
  } else {
    console.log(`✅ Patients table exists! Found ${patients.length} patient record(s).`);
    if (patients.length > 0) {
      console.log('Sample Patient:', patients[0].name, `(${patients[0].id})`);
    }
  }

  const { data: referrals, error: rError } = await supabase.from('referrals').select('*');
  if (rError) {
    console.error('❌ Error querying referrals table:', rError.message);
  } else {
    console.log(`✅ Referrals table exists! Found ${referrals.length} referral record(s).`);
  }

  const { data: reports, error: repError } = await supabase.from('reports').select('*');
  if (repError) {
    console.error('❌ Error querying reports table:', repError.message);
  } else {
    console.log(`✅ Reports table exists! Found ${reports.length} report record(s).`);
  }

  console.log('--- CHECK COMPLETE ---');
}

testConnection();
