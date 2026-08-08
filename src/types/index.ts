export type Gender = 'Male' | 'Female' | 'Other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Language = 'en' | 'kn' | 'hi' | 'mr';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Priority = 'Routine' | 'Urgent' | 'Emergency';

export type ReferralStatus = 'Active' | 'In Treatment' | 'Completed';

export type Role = 'phc' | 'specialist';

export interface DoctorUser {
  id: string;
  name: string;
  role: Role;
  designation: string;
  facility: string;
  registration: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  mobile: string;
  village: string;
  address: string;
  bloodGroup: BloodGroup;
  history: string;
  createdAt: string;
}

export interface Vitals {
  bp: string;
  heartRate: number;
  temperature: number;
  spo2: number;
  bloodSugar: number;
  weight: number;
}

export interface VitalFlag {
  key: string;
  label: string;
  value: string;
  status: 'normal' | 'watch' | 'critical';
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  reasonKeys: string[];
}

export interface Referral {
  id: string;
  token: string;
  patientId: string;
  vitals: Vitals;
  symptoms: string;
  diagnosis: string;
  priority: Priority;
  hospital: string;
  department: string;
  reason: string;
  risk: RiskAssessment;
  summary: Record<Language, string>;
  status: ReferralStatus;
  createdAt: string;
  createdBy: string;
  fromFacility: string;
  notes: TreatmentNote[];
  pdfLanguage: Language;
}

export interface TreatmentNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface VaultReport {
  id: string;
  patientId: string;
  title: string;
  kind: 'Lab' | 'Imaging' | 'Prescription' | 'Handoff PDF' | 'Medical Report (PDF/Pic)';
  facility: string;
  date: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'image' | 'document';
  fileSize?: string;
}