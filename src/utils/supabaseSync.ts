import type { Patient, Referral, VaultReport } from '../types';

export function mapPatientFromDb(row: any): Patient {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    mobile: row.mobile,
    village: row.village,
    address: row.address,
    bloodGroup: row.blood_group || row.bloodGroup,
    history: row.history,
    createdAt: row.created_at || row.createdAt
  };
}

export function mapPatientToDb(patient: Patient) {
  return {
    id: patient.id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    mobile: patient.mobile,
    village: patient.village,
    address: patient.address,
    blood_group: patient.bloodGroup,
    history: patient.history,
    created_at: patient.createdAt
  };
}

export function mapReferralFromDb(row: any): Referral {
  return {
    id: row.id,
    token: row.token,
    patientId: row.patient_id || row.patientId,
    vitals: row.vitals,
    symptoms: row.symptoms,
    diagnosis: row.diagnosis,
    priority: row.priority,
    hospital: row.hospital,
    department: row.department,
    reason: row.reason,
    risk: row.risk,
    summary: row.summary,
    status: row.status,
    createdAt: row.created_at || row.createdAt,
    createdBy: row.created_by || row.createdBy,
    fromFacility: row.from_facility || row.fromFacility,
    notes: row.notes || [],
    pdfLanguage: row.pdf_language || row.pdfLanguage
  };
}

export function mapReferralToDb(referral: Referral) {
  return {
    id: referral.id,
    token: referral.token,
    patient_id: referral.patientId,
    vitals: referral.vitals,
    symptoms: referral.symptoms,
    diagnosis: referral.diagnosis,
    priority: referral.priority,
    hospital: referral.hospital,
    department: referral.department,
    reason: referral.reason,
    risk: referral.risk,
    summary: referral.summary,
    status: referral.status,
    created_at: referral.createdAt,
    created_by: referral.createdBy,
    from_facility: referral.fromFacility,
    notes: referral.notes,
    pdf_language: referral.pdfLanguage
  };
}

export function mapReportFromDb(row: any): VaultReport {
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId,
    title: row.title,
    kind: row.kind,
    facility: row.facility,
    date: row.date
  };
}

export function mapReportToDb(report: VaultReport) {
  return {
    id: report.id,
    patient_id: report.patientId,
    title: report.title,
    kind: report.kind,
    facility: report.facility,
    date: report.date
  };
}
