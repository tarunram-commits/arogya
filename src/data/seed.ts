import type { Patient, Referral, VaultReport } from '../types';
import { assessRisk, generateSummary } from '../utils/ai';

const daysAgo = (n: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};

export const SEED_PATIENTS: Patient[] = [
{
  id: 'AV-P1001',
  name: 'Ramesh Gowda',
  age: 62,
  gender: 'Male',
  mobile: '9845012233',
  village: 'Hosahalli',
  address: 'Door 14, Main Road, Hosahalli, Tumakuru Taluk',
  bloodGroup: 'B+',
  history: 'Type 2 diabetes since 2013, hypertension on Amlodipine 5mg, past hospitalisation for chest pain (2021).',
  createdAt: daysAgo(220)
},
{
  id: 'AV-P1002',
  name: 'Lakshmi Bai',
  age: 34,
  gender: 'Female',
  mobile: '9731122045',
  village: 'Kadalur',
  address: 'Near Anganwadi, Kadalur, Gubbi Taluk',
  bloodGroup: 'O+',
  history: 'Second pregnancy, mild anaemia (Hb 9.4), no chronic illness.',
  createdAt: daysAgo(140)
},
{
  id: 'AV-P1003',
  name: 'Shivanna M',
  age: 47,
  gender: 'Male',
  mobile: '9900456781',
  village: 'Beeranahalli',
  address: 'Farm House Lane, Beeranahalli, Koratagere',
  bloodGroup: 'A+',
  history: 'Smoker for 20 years, recurring cough, treated for pulmonary TB in 2018.',
  createdAt: daysAgo(96)
},
{
  id: 'AV-P1004',
  name: 'Kavya Shetty',
  age: 8,
  gender: 'Female',
  mobile: '9611209876',
  village: 'Nandipura',
  address: 'Ward 3, Nandipura, Tumakuru',
  bloodGroup: 'AB+',
  history: 'Childhood asthma, uses salbutamol inhaler during episodes.',
  createdAt: daysAgo(61)
},
{
  id: 'AV-P1005',
  name: 'Basavaraj Patil',
  age: 71,
  gender: 'Male',
  mobile: '9448771230',
  village: 'Sompura',
  address: 'Old Temple Street, Sompura, Sira Taluk',
  bloodGroup: 'O-',
  history: 'Chronic kidney disease stage 3, hypertension, cataract surgery (2019).',
  createdAt: daysAgo(38)
},
{
  id: 'AV-P1006',
  name: 'Anitha Reddy',
  age: 28,
  gender: 'Female',
  mobile: '9535664411',
  village: 'Chikkabidare',
  address: 'Behind Govt School, Chikkabidare, Tumakuru',
  bloodGroup: 'B-',
  history: 'No significant medical history. Occasional migraine.',
  createdAt: daysAgo(21)
}];


interface SeedReferralSpec {
  id: string;
  token: string;
  patientId: string;
  vitals: Referral['vitals'];
  symptoms: string;
  diagnosis: string;
  priority: Referral['priority'];
  hospital: string;
  department: string;
  reason: string;
  status: Referral['status'];
  createdAt: string;
  notes?: Referral['notes'];
}

const SPECS: SeedReferralSpec[] = [
{
  id: 'r_1',
  token: 'AV-2026-1042KQZ',
  patientId: 'AV-P1001',
  vitals: { bp: '168/104', heartRate: 112, temperature: 99.1, spo2: 92, bloodSugar: 268, weight: 74 },
  symptoms: 'Chest tightness on exertion for 3 days, breathlessness while walking, sweating episodes.',
  diagnosis: 'Suspected unstable angina with uncontrolled diabetes',
  priority: 'Emergency',
  hospital: 'Jayadeva Institute of Cardiology',
  department: 'Cardiology',
  reason: 'Critical vitals requiring higher care',
  status: 'Active',
  createdAt: daysAgo(0, 9)
},
{
  id: 'r_2',
  token: 'AV-2026-1039TRM',
  patientId: 'AV-P1002',
  vitals: { bp: '138/88', heartRate: 96, temperature: 98.7, spo2: 97, bloodSugar: 104, weight: 58 },
  symptoms: 'Persistent fatigue, mild pedal oedema at 30 weeks gestation.',
  diagnosis: 'Anaemia in pregnancy, borderline blood pressure',
  priority: 'Urgent',
  hospital: 'District General Hospital, Tumakuru',
  department: 'Obstetrics & Gynaecology',
  reason: 'Specialist consultation required',
  status: 'Active',
  createdAt: daysAgo(1, 11)
},
{
  id: 'r_3',
  token: 'AV-2026-1031PLC',
  patientId: 'AV-P1003',
  vitals: { bp: '128/82', heartRate: 88, temperature: 101.2, spo2: 93, bloodSugar: 118, weight: 55 },
  symptoms: 'Productive cough for 4 weeks with blood-streaked sputum, evening fever, weight loss.',
  diagnosis: 'Suspected TB relapse',
  priority: 'Urgent',
  hospital: 'Victoria Hospital, Bengaluru',
  department: 'Pulmonology',
  reason: 'Diagnostic facility unavailable at PHC',
  status: 'In Treatment',
  createdAt: daysAgo(4, 14),
  notes: [
  {
    id: 'n_1',
    author: 'Dr. Arjun Rao',
    text: 'CBNAAT sent, chest X-ray shows right upper zone infiltrate. Started on DOTS Category II pending sensitivity.',
    createdAt: daysAgo(3, 16)
  }]

},
{
  id: 'r_4',
  token: 'AV-2026-1024HBN',
  patientId: 'AV-P1004',
  vitals: { bp: '104/68', heartRate: 118, temperature: 100.6, spo2: 91, bloodSugar: 92, weight: 22 },
  symptoms: 'Wheezing since last night, nasal flaring, unable to complete sentences.',
  diagnosis: 'Acute asthma exacerbation',
  priority: 'Emergency',
  hospital: 'District General Hospital, Tumakuru',
  department: 'Paediatrics',
  reason: 'ICU / emergency admission',
  status: 'Completed',
  createdAt: daysAgo(9, 8),
  notes: [
  {
    id: 'n_2',
    author: 'Dr. Arjun Rao',
    text: 'Nebulised salbutamol + ipratropium, oral steroids for 5 days. SpO₂ recovered to 97%. Discharged with action plan.',
    createdAt: daysAgo(8, 12)
  }]

},
{
  id: 'r_5',
  token: 'AV-2026-1018GFD',
  patientId: 'AV-P1005',
  vitals: { bp: '152/94', heartRate: 78, temperature: 98.4, spo2: 95, bloodSugar: 148, weight: 62 },
  symptoms: 'Reduced urine output, swelling of both feet, generalised weakness.',
  diagnosis: 'CKD stage 3 with fluid overload',
  priority: 'Urgent',
  hospital: 'Victoria Hospital, Bengaluru',
  department: 'Nephrology',
  reason: 'Specialist consultation required',
  status: 'Completed',
  createdAt: daysAgo(16, 10),
  notes: [
  {
    id: 'n_3',
    author: 'Dr. Arjun Rao',
    text: 'Creatinine 2.4, diuretics adjusted, salt restriction advised. Review in 3 weeks with repeat RFT.',
    createdAt: daysAgo(15, 9)
  }]

},
{
  id: 'r_6',
  token: 'AV-2026-1011XWQ',
  patientId: 'AV-P1006',
  vitals: { bp: '118/76', heartRate: 82, temperature: 98.2, spo2: 98, bloodSugar: 96, weight: 51 },
  symptoms: 'Recurrent one-sided headache with light sensitivity, 3 episodes per week.',
  diagnosis: 'Chronic migraine without aura',
  priority: 'Routine',
  hospital: 'KIMS Taluk Hospital, Hubballi',
  department: 'General Medicine',
  reason: 'Second opinion on diagnosis',
  status: 'Completed',
  createdAt: daysAgo(19, 15)
}];


export const SEED_REFERRALS: Referral[] = SPECS.map((spec) => {
  const patient = SEED_PATIENTS.find((p) => p.id === spec.patientId)!;
  const risk = assessRisk({ vitals: spec.vitals, patient, priority: spec.priority });
  const summary = generateSummary({
    patient,
    vitals: spec.vitals,
    symptoms: spec.symptoms,
    diagnosis: spec.diagnosis,
    hospital: spec.hospital,
    department: spec.department,
    reason: spec.reason,
    priority: spec.priority,
    risk
  });
  return {
    ...spec,
    risk,
    summary,
    notes: spec.notes ?? [],
    createdBy: 'Dr. Meera Kulkarni',
    fromFacility: 'PHC Hosahalli, Tumakuru District',
    pdfLanguage: 'en'
  };
});

export const SEED_REPORTS: VaultReport[] = [
{ id: 'rep_1', patientId: 'AV-P1001', title: 'HbA1c & Lipid Profile', kind: 'Lab', facility: 'PHC Hosahalli', date: daysAgo(34) },
{ id: 'rep_2', patientId: 'AV-P1001', title: 'ECG — 12 Lead', kind: 'Imaging', facility: 'PHC Hosahalli', date: daysAgo(2) },
{ id: 'rep_3', patientId: 'AV-P1002', title: 'Haemoglobin & CBC', kind: 'Lab', facility: 'PHC Hosahalli', date: daysAgo(12) },
{ id: 'rep_4', patientId: 'AV-P1003', title: 'Chest X-Ray PA View', kind: 'Imaging', facility: 'Victoria Hospital', date: daysAgo(3) },
{ id: 'rep_5', patientId: 'AV-P1004', title: 'Nebulisation & Steroid Course', kind: 'Prescription', facility: 'District General Hospital', date: daysAgo(8) },
{ id: 'rep_6', patientId: 'AV-P1005', title: 'Renal Function Test', kind: 'Lab', facility: 'Victoria Hospital', date: daysAgo(15) }];