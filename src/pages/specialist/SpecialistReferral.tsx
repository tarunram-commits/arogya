import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  DownloadIcon,
  FileTextIcon,
  HistoryIcon,
  QrCodeIcon,
  SendIcon } from
'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../../contexts/AppContext';
import { PatientSummaryCard } from '../../components/PatientSummaryCard';
import { VitalsGrid } from '../../components/VitalsGrid';
import { AISummaryPanel } from '../../components/AISummaryPanel';
import { TokenChip } from '../../components/ReferralQR';
import {
  Button,
  DataRow,
  EmptyState,
  GlassCard,
  PriorityBadge,
  SectionTitle,
  StatusBadge,
  inputClass } from
'../../components/ui/Primitives';
import { formatDate, formatDateTime } from '../../utils/format';
import type { Language } from '../../types';

export function SpecialistReferral() {
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const { user, getReferralByToken, getPatient, referralsForPatient, reportsForPatient, addNote, setStatus } = useApp();
  const [language, setLanguage] = useState<Language>('en');
  const [note, setNote] = useState('');

  const referral = getReferralByToken(token);
  const patient = referral ? getPatient(referral.patientId) : undefined;

  if (!referral || !patient) {
    return (
      <EmptyState
        icon={<QrCodeIcon className="h-5 w-5" />}
        title="Referral not found"
        description={`No referral matches token ${token}. Scan the QR again or enter the token manually.`}
        action={
        <Link to="/specialist/scan">
            <Button>Back to scanner</Button>
          </Link>
        } />);


  }

  const history = referralsForPatient(patient.id).filter((r) => r.id !== referral.id);
  const reports = reportsForPatient(patient.id);

  const submitNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (note.trim().length < 5) {
      toast.error('Add a little more detail to the treatment note');
      return;
    }
    addNote(referral.id, note.trim(), user?.name ?? 'Specialist');
    setNote('');
    toast.success('Treatment note saved to health vault', { description: 'Visible to the referring PHC doctor instantly.' });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/specialist/queue')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
          
          <ArrowLeftIcon className="h-4 w-4" /> Referral queue
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2Icon className="h-3.5 w-3.5" /> QR verified · vault unlocked
          </span>
          <TokenChip token={referral.token} />
        </div>
      </div>

      <PatientSummaryCard patient={patient} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <GlassCard className="p-5">
            <SectionTitle
              title="Referral details"
              subtitle={`${referral.department} · ${referral.hospital}`}
              action={
              <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority={referral.priority} />
                  <StatusBadge status={referral.status} />
                </div>
              } />
            
            <div className="mt-4">
              <VitalsGrid vitals={referral.vitals} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white/70 p-4 ring-1 ring-brand-100">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Symptoms recorded at PHC</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{referral.symptoms}</p>
              </div>
              <div className="rounded-xl bg-white/70 p-4 ring-1 ring-brand-100">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Provisional diagnosis</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{referral.diagnosis}</p>
              </div>
            </div>
          </GlassCard>

          <AISummaryPanel summary={referral.summary} language={language} onLanguageChange={setLanguage} risk={referral.risk} />

          <GlassCard className="p-5">
            <SectionTitle title="Treatment notes" subtitle="Written back into the patient's health vault" icon={<ClipboardListIcon className="h-4 w-4" />} />
            <form onSubmit={submitNote} className="mt-4">
              <textarea
                className={twMerge(inputClass, 'min-h-[100px] resize-y')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Examination findings, investigations ordered, treatment started, follow-up plan…"
                aria-label="Treatment note" />
              
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="submit" variant="emerald">
                  <SendIcon className="h-4 w-4" /> Save note
                </Button>
                {referral.status !== 'Completed' ?
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStatus(referral.id, 'Completed');
                    toast.success('Referral marked completed');
                  }}>
                  
                    Mark referral completed
                  </Button> :
                null}
              </div>
            </form>

            {referral.notes.length ?
            <ul className="mt-5 space-y-3">
                {referral.notes.map((entry, index) =>
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.28 }}
                className="rounded-xl bg-violet-50/70 p-4 ring-1 ring-violet-200">
                
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-ink">{entry.author}</p>
                      <p className="text-[11px] text-ink-muted">{formatDateTime(entry.createdAt)}</p>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{entry.text}</p>
                  </motion.li>
              )}
              </ul> :

            <p className="mt-4 text-sm text-ink-muted">No treatment notes recorded yet for this referral.</p>
            }
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="p-5">
            <SectionTitle title="Handoff document" subtitle="One-page medical report" icon={<FileTextIcon className="h-4 w-4" />} />
            <div className="mt-4">
              <DataRow label="Token" value={<span className="font-mono">{referral.token}</span>} />
              <DataRow label="Raised on" value={formatDateTime(referral.createdAt)} />
              <DataRow label="Referring doctor" value={referral.createdBy} />
              <DataRow label="From" value={referral.fromFacility} />
              <DataRow label="Reason" value={referral.reason} />
            </div>
            <Link to={`/report/${referral.token}?lang=${language}`}>
              <Button className="mt-4 w-full">
                <DownloadIcon className="h-4 w-4" /> Download PDF report
              </Button>
            </Link>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionTitle title="Medical history" subtitle="Earlier referrals & documents" icon={<HistoryIcon className="h-4 w-4" />} />
            {history.length === 0 && reports.length === 0 ?
            <p className="mt-4 text-sm text-ink-muted">No earlier records in this vault.</p> :

            <ul className="mt-4 space-y-3">
                {history.map((item) =>
              <li key={item.id} className="rounded-xl bg-white/70 p-3.5 ring-1 ring-brand-100">
                    <p className="text-sm font-semibold text-ink">{item.diagnosis}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {item.department} · {formatDate(item.createdAt)} · {item.risk.level} risk
                    </p>
                    <Link
                  to={`/specialist/referral/${item.token}`}
                  className="mt-1.5 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700">
                  
                      Open referral →
                    </Link>
                  </li>
              )}
                {reports.map((report) =>
              <li key={report.id} className="flex items-center gap-3 rounded-xl bg-white/70 p-3.5 ring-1 ring-brand-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                      <FileTextIcon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{report.title}</span>
                      <span className="block text-xs text-ink-muted">
                        {report.kind} · {formatDate(report.date)}
                      </span>
                    </span>
                  </li>
              )}
              </ul>
            }
          </GlassCard>
        </div>
      </div>
    </div>);

}