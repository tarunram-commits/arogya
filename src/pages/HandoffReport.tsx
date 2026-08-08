import React, { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon, PrinterIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button, EmptyState } from '../components/ui/Primitives';
import { LanguageSelector } from '../components/AISummaryPanel';
import { ReferralQR, tokenPayload } from '../components/ReferralQR';
import { analyzeVitals, LANGUAGES } from '../utils/ai';
import { formatDateTime } from '../utils/format';
import type { Language } from '../types';

export function HandoffReport() {
  const { token = '' } = useParams();
  const [params] = useSearchParams();
  const { getReferralByToken, getPatient } = useApp();
  const referral = getReferralByToken(token);
  const [language, setLanguage] = useState<Language>(params.get('lang') as Language || referral?.pdfLanguage || 'en');

  if (!referral) {
    return (
      <div className="app-canvas min-h-screen w-full px-4 py-16">
        <EmptyState
          icon={<PrinterIcon className="h-5 w-5" />}
          title="Referral not found"
          description={`No referral matches token ${token}. Open the report from the patient's health vault.`}
          action={
          <Link to="/">
              <Button>Back to console</Button>
            </Link>
          } />
        
      </div>);

  }

  const patient = getPatient(referral.patientId);
  const flags = analyzeVitals(referral.vitals);
  const riskColor =
  referral.risk.level === 'High' ? '#e11d48' : referral.risk.level === 'Medium' ? '#f59e0b' : '#059669';

  return (
    <div className="app-canvas min-h-screen w-full py-6">
      <div className="no-print mx-auto mb-4 flex max-w-[860px] flex-wrap items-center justify-between gap-3 px-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
          <ArrowLeftIcon className="h-4 w-4" /> Back to console
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSelector value={language} onChange={setLanguage} />
          <Button onClick={() => window.print()}>
            <PrinterIcon className="h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      <article
        className="print-sheet mx-auto max-w-[860px] bg-white px-8 py-8 text-[#0b1b33] shadow-lift sm:px-10"
        style={{ minHeight: '1000px' }}
        aria-label="Medical handoff report">
        
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#0b1b33] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a63d4]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                <path d="M12 21s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 8.2 4.5 4.5 0 0 1 19.5 11c0 5.4-7.5 10-7.5 10Z" fill="rgba(255,255,255,0.2)" />
                <path d="M6.5 13h3l1.5-3 2 6 1.5-3h3" stroke="#fff" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold leading-tight tracking-tight">Arogya-Vahini</h1>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a63d4]">
                Universal Rural Referral & Health Vault
              </p>
              <p className="mt-0.5 text-[11px] text-[#6b829f]">{referral.fromFacility}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b829f]">Medical Handoff Report</p>
            <p className="font-mono text-sm font-bold">{referral.token}</p>
            <p className="mt-0.5 text-[11px] text-[#6b829f]">{formatDateTime(referral.createdAt)}</p>
            <span
              className="mt-1.5 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: referral.priority === 'Emergency' ? '#e11d48' : referral.priority === 'Urgent' ? '#f59e0b' : '#1a63d4' }}>
              
              {referral.priority}
            </span>
          </div>
        </header>

        {/* Patient */}
        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a63d4]">Patient details</h2>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-4">
            {[
            ['Name', patient?.name ?? '—'],
            ['Patient ID', patient?.id ?? '—'],
            ['Age / Gender', `${patient?.age ?? '—'} / ${patient?.gender ?? '—'}`],
            ['Blood group', patient?.bloodGroup ?? '—'],
            ['Mobile', patient?.mobile ?? '—'],
            ['Village', patient?.village ?? '—'],
            ['Address', patient?.address ?? '—'],
            ['Referred by', referral.createdBy]].
            map(([label, value]) =>
            <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b829f]">{label}</p>
                <p className="font-medium leading-snug">{value}</p>
              </div>
            )}
          </div>
        </section>

        {/* Vitals */}
        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a63d4]">Vital signs</h2>
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#eef6ff] text-left text-[10px] uppercase tracking-wide text-[#154fab]">
                <th className="border border-[#d9ebff] px-2.5 py-1.5 font-bold">Parameter</th>
                <th className="border border-[#d9ebff] px-2.5 py-1.5 font-bold">Reading</th>
                <th className="border border-[#d9ebff] px-2.5 py-1.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {flags.map((flag) =>
              <tr key={flag.key}>
                  <td className="border border-[#d9ebff] px-2.5 py-1.5">{flag.label}</td>
                  <td className="border border-[#d9ebff] px-2.5 py-1.5 font-semibold">{flag.value}</td>
                  <td
                  className="border border-[#d9ebff] px-2.5 py-1.5 font-semibold"
                  style={{ color: flag.status === 'critical' ? '#e11d48' : flag.status === 'watch' ? '#b45309' : '#059669' }}>
                  
                    {flag.status === 'critical' ? 'Critical' : flag.status === 'watch' ? 'Needs watch' : 'Normal'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Clinical */}
        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a63d4]">Symptoms</h2>
            <p className="mt-1.5 text-sm leading-relaxed">{referral.symptoms}</p>
          </div>
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a63d4]">Provisional diagnosis</h2>
            <p className="mt-1.5 text-sm leading-relaxed">{referral.diagnosis}</p>
            <h2 className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a63d4]">Previous history</h2>
            <p className="mt-1.5 text-sm leading-relaxed">{patient?.history || '—'}</p>
          </div>
        </section>

        {/* AI */}
        <section className="mt-5 rounded-xl border border-[#d9ebff] bg-[#f7fbff] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a63d4]">
              AI medical summary · {LANGUAGES.find((l) => l.code === language)?.label}
            </h2>
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: riskColor }}>
              
              {referral.risk.level} risk · {referral.risk.score}/100
            </span>
          </div>
          <p className={`mt-2 text-sm leading-relaxed ${language === 'en' ? '' : 'font-indic'}`}>
            {referral.summary[language]}
          </p>
          <p className="mt-2 text-[10px] italic text-[#6b829f]">
            AI-generated clinical support only. Final decision rests with the treating physician.
          </p>
        </section>

        {/* Referral + QR */}
        <section className="mt-5 grid gap-4 sm:grid-cols-[1fr,auto]">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a63d4]">Referral instruction</h2>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              {[
              ['Referral hospital', referral.hospital],
              ['Department', referral.department],
              ['Referral reason', referral.reason],
              ['Priority', referral.priority],
              ['Referral token', referral.token],
              ['Status', referral.status]].
              map(([label, value]) =>
              <div key={label}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b829f]">{label}</p>
                  <p className="font-medium leading-snug">{value}</p>
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <ReferralQR token={referral.token} size={116} />
            <p className="mt-1.5 text-[10px] font-semibold text-[#6b829f]">Scan at referral hospital</p>
            <p className="max-w-[130px] break-all font-mono text-[8px] text-[#9db3cc]">{tokenPayload(referral.token)}</p>
          </div>
        </section>

        {/* Signatures */}
        <section className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <div className="h-16 border-b border-dashed border-[#6b829f]" />
            <p className="mt-1.5 text-[11px] font-bold">{referral.createdBy}</p>
            <p className="text-[10px] text-[#6b829f]">Medical Officer · Signature & Date</p>
          </div>
          <div>
            <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-[#6b829f] text-[10px] uppercase tracking-widest text-[#9db3cc]">
              Hospital stamp
            </div>
            <p className="mt-1.5 text-[11px] font-bold">{referral.fromFacility}</p>
            <p className="text-[10px] text-[#6b829f]">Official seal</p>
          </div>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#d9ebff] pt-3 text-[10px] text-[#6b829f]">
          <span>Arogya-Vahini · Universal Rural Referral & AI Health Vault</span>
          <span>Report generated {formatDateTime(new Date().toISOString())}</span>
        </footer>
      </article>
    </div>);

}