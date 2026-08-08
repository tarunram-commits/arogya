import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xllppukhwuxdvonfcokj.supabase.co';
const supabaseAnonKey = 'sb_publishable_cetI1zLsNvW3h4aq8lEY9w_s9d4IsPk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const patients = [
  {
    id: 'AV-P1001',
    name: 'Ramesh Gowda',
    age: 62,
    gender: 'Male',
    mobile: '9845012233',
    village: 'Hosahalli',
    address: 'Door 14, Main Road, Hosahalli, Tumakuru Taluk',
    blood_group: 'B+',
    history: 'Type 2 diabetes since 2013, hypertension on Amlodipine 5mg, past hospitalisation for chest pain (2021).',
    created_at: new Date(Date.now() - 220 * 86400000).toISOString()
  },
  {
    id: 'AV-P1002',
    name: 'Lakshmi Bai',
    age: 34,
    gender: 'Female',
    mobile: '9731122045',
    village: 'Kadalur',
    address: 'Near Anganwadi, Kadalur, Gubbi Taluk',
    blood_group: 'O+',
    history: 'Second pregnancy, mild anaemia (Hb 9.4), no chronic illness.',
    created_at: new Date(Date.now() - 140 * 86400000).toISOString()
  },
  {
    id: 'AV-P1003',
    name: 'Shivanna M',
    age: 47,
    gender: 'Male',
    mobile: '9900456781',
    village: 'Beeranahalli',
    address: 'Farm House Lane, Beeranahalli, Koratagere',
    blood_group: 'A+',
    history: 'Smoker for 20 years, recurring cough, treated for pulmonary TB in 2018.',
    created_at: new Date(Date.now() - 96 * 86400000).toISOString()
  },
  {
    id: 'AV-P1004',
    name: 'Kavya Shetty',
    age: 8,
    gender: 'Female',
    mobile: '9611209876',
    village: 'Nandipura',
    address: 'Ward 3, Nandipura, Tumakuru',
    blood_group: 'AB+',
    history: 'Childhood asthma, uses salbutamol inhaler during episodes.',
    created_at: new Date(Date.now() - 61 * 86400000).toISOString()
  },
  {
    id: 'AV-P1005',
    name: 'Basavaraj Patil',
    age: 71,
    gender: 'Male',
    mobile: '9448771230',
    village: 'Sompura',
    address: 'Old Temple Street, Sompura, Sira Taluk',
    blood_group: 'O-',
    history: 'Chronic kidney disease stage 3, hypertension, cataract surgery (2019).',
    created_at: new Date(Date.now() - 38 * 86400000).toISOString()
  },
  {
    id: 'AV-P1006',
    name: 'Anitha Reddy',
    age: 28,
    gender: 'Female',
    mobile: '9535664411',
    village: 'Chikkabidare',
    address: 'Behind Govt School, Chikkabidare, Tumakuru',
    blood_group: 'B-',
    history: 'No significant medical history. Occasional migraine.',
    created_at: new Date(Date.now() - 21 * 86400000).toISOString()
  }
];

const referrals = [
  {
    id: 'r_1',
    token: 'AV-2026-1042KQZ',
    patient_id: 'AV-P1001',
    vitals: { bp: '168/104', heartRate: 112, temperature: 99.1, spo2: 92, bloodSugar: 268, weight: 74 },
    symptoms: 'Chest tightness on exertion for 3 days, breathlessness while walking, sweating episodes.',
    diagnosis: 'Suspected unstable angina with uncontrolled diabetes',
    priority: 'Emergency',
    hospital: 'Jayadeva Institute of Cardiology',
    department: 'Cardiology',
    reason: 'Critical vitals requiring higher care',
    risk: {
      level: 'High',
      score: 85,
      reasonKeys: ['BP > 160/100', 'SpO2 < 95%', 'Chest tightness', 'Diabetes history']
    },
    summary: {
      en: 'High Risk Handoff: 62yo Male presenting with chest tightness and severe hypertension (168/104 mmHg), SpO2 92%, blood sugar 268 mg/dL. Referred to Jayadeva Institute of Cardiology urgently.',
      kn: 'ಉನ್ನತ ಅಪಾಯದ ಹ್ಯಾಂಡ್‌ಆಫ್: 62 ವರ್ಷದ ಗಂಡಸು ಎದೆ ಬಿಗಿತ ಮತ್ತು ತೀವ್ರ ರಕ್ತದೊತ್ತಡದೊಂದಿಗೆ ಬಂದಿದ್ದಾರೆ.',
      hi: 'उच्च जोखिम हैंडऑफ: 62 वर्षीय पुरुष सीने में जकड़न और गंभीर उच्च रक्तचाप के साथ प्रस्तुत।',
      mr: 'उच्च धोक्याचे हस्तांतरण: 62 वर्षीय पुरुष छातीत घट्टपणा आणि तीव्र उच्च रक्तदाबाने ग्रस्त.'
    },
    status: 'Active',
    created_at: new Date().toISOString(),
    created_by: 'Dr. Sunita Sharma',
    from_facility: 'Hosahalli Primary Health Centre',
    notes: [],
    pdf_language: 'en'
  },
  {
    id: 'r_2',
    token: 'AV-2026-1039TRM',
    patient_id: 'AV-P1002',
    vitals: { bp: '138/88', heartRate: 96, temperature: 98.7, spo2: 97, bloodSugar: 104, weight: 58 },
    symptoms: 'Persistent fatigue, mild pedal oedema at 30 weeks gestation.',
    diagnosis: 'Anaemia in pregnancy, borderline blood pressure',
    priority: 'Urgent',
    hospital: 'District General Hospital, Tumakuru',
    department: 'Obstetrics & Gynaecology',
    reason: 'Specialist consultation required',
    risk: {
      level: 'Medium',
      score: 52,
      reasonKeys: ['Pregnancy 30w', 'Fatigue + Oedema', 'Borderline BP']
    },
    summary: {
      en: 'Medium Risk Handoff: 34yo pregnant female at 30 weeks gestation with fatigue and pedal oedema.',
      kn: 'ಮಧ್ಯಮ ಅಪಾಯದ ಹ್ಯಾಂಡ್‌ಆಫ್: 34 ವರ್ಷದ ಗರ್ಭಿಣಿ ಮಹಿಳೆ.',
      hi: 'मध्यम जोखिम हैंडऑफ: 30 सप्ताह की गर्भवती महिला।',
      mr: 'मध्यम धोक्याचे हस्तांतरण: 30 आठवड्यांची गरोदर महिला.'
    },
    status: 'Active',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    created_by: 'Dr. Sunita Sharma',
    from_facility: 'Kadalur Primary Health Centre',
    notes: [],
    pdf_language: 'en'
  }
];

const reports = [
  {
    id: 'rep_1',
    patient_id: 'AV-P1001',
    title: 'ECG Report & Lipid Profile',
    kind: 'Lab',
    facility: 'Hosahalli PHC Diagnostics',
    date: '2026-08-01'
  },
  {
    id: 'rep_2',
    patient_id: 'AV-P1001',
    title: 'HbA1c & Fasting Blood Glucose',
    kind: 'Lab',
    facility: 'Thyrocare Tumakuru',
    date: '2026-07-20'
  },
  {
    id: 'rep_3',
    patient_id: 'AV-P1002',
    title: 'Obstetric Ultrasound (30 Weeks)',
    kind: 'Imaging',
    facility: 'District Hospital Sonography',
    date: '2026-08-04'
  }
];

async function seedDatabase() {
  console.log('Seeding Supabase database with initial patients, referrals, and reports...');

  const { error: pError } = await supabase.from('patients').upsert(patients);
  if (pError) console.error('Patient seed error:', pError.message);
  else console.log('✅ Patients seeded successfully!');

  const { error: rError } = await supabase.from('referrals').upsert(referrals);
  if (rError) console.error('Referral seed error:', rError.message);
  else console.log('✅ Referrals seeded successfully!');

  const { error: repError } = await supabase.from('reports').upsert(reports);
  if (repError) console.error('Report seed error:', repError.message);
  else console.log('✅ Reports seeded successfully!');
}

seedDatabase();
