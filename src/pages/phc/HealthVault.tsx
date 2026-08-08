import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  FileTextIcon,
  FolderOpenIcon,
  HistoryIcon,
  PlusIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Trash2Icon } from
'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../../contexts/AppContext';
import { PatientSummaryCard } from '../../components/PatientSummaryCard';
import { VitalsGrid } from '../../components/VitalsGrid';
import { AISummaryPanel } from '../../components/AISummaryPanel';
import { ReferralQR, TokenChip } from '../../components/ReferralQR';
import {
  Button,
  DataRow,
  EmptyState,
  GlassCard,
  PriorityBadge,
  RiskBadge,
  SectionTitle,
  StatusBadge } from
'../../components/ui/Primitives';
import { UploadMedicalReportModal } from '../../components/UploadMedicalReportModal';
import { formatDate, formatDateTime } from '../../utils/format';
import type { Language } from '../../types';

const TABS = ['Overview', 'Referral history', 'AI summaries', 'Reports & PDFs'] as const;

export function HealthVault() {
  const { patientId = '' } = useParams();
  const navigate = useNavigate();
  const { getPatient, deletePatient, referralsForPatient, reportsForPatient } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
  const [language, setLanguage] = useState<Language>('en');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const patient = getPatient(patientId);
  const referrals = referralsForPatient(patientId);
  const reports = reportsForPatient(patientId);
  const latest = referrals[0];

  const handleDeleteConfirm = () => {
    if (!patient) return;
    deletePatient(patient.id);
    toast.success(`Patient record deleted`, {
      description: `${patient.name} (${patient.id}) and all associated records have been removed.`
    });
    navigate('/phc/search');
  };

  if (!patient) {
    return (
      <EmptyState
        icon={<FolderOpenIcon className="h-5 w-5" />}
        title="Patient not found"
        description="This vault does not exist. Search again from the patient directory."
        action={
        <Link to="/phc/search">
            <Button>Back to search</Button>
          </Link>
        } />);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/phc/search" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
          <ArrowLeftIcon className="h-4 w-4" /> Patient directory
        </Link>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <ShieldCheckIcon className="h-3.5 w-3.5" /> Health Vault · {referrals.length + reports.length} records
          </span>
          <Button
            size="sm"
            variant="emerald"
            onClick={() => setShowUploadModal(true)}>
            <PlusIcon className="h-4 w-4" /> Upload Report (PDF/Pic)
          </Button>
          <Link to={`/phc/referral/new?patientId=${patient.id}`}>
            <Button size="sm">
              <PlusIcon className="h-4 w-4" /> New referral
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
            onClick={() => setShowDeleteModal(true)}>
            <Trash2Icon className="h-4 w-4 text-rose-600" /> Delete Patient
          </Button>
        </div>
      </div>

      <PatientSummaryCard patient={patient} />

      <div className="glass flex flex-wrap gap-1.5 rounded-2xl p-1.5" role="tablist" aria-label="Health vault sections">
        {TABS.map((item) =>
        <button
          key={item}
          role="tab"
          aria-selected={tab === item}
          type="button"
          onClick={() => setTab(item)}
          className={twMerge(
            'relative rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors',
            tab === item ? 'text-white' : 'text-ink-soft hover:text-brand-700'
          )}>
          
            {tab === item ?
          <motion.span layoutId="vault-tab" className="absolute inset-0 rounded-xl bg-brand-600" transition={{ type: 'spring', stiffness: 380, damping: 32 }} /> :
          null}
            <span className="relative">{item}</span>
          </button>
        )}
      </div>

      {tab === 'Overview' ?
      latest ?
      <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <GlassCard className="p-5">
                <SectionTitle
              title="Latest referral"
              subtitle={`${latest.department} · ${latest.hospital}`}
              action={
              <div className="flex flex-wrap gap-2">
                      <PriorityBadge priority={latest.priority} />
                      <StatusBadge status={latest.status} />
                    </div>
              } />
            
                <div className="mt-4">
                  <VitalsGrid vitals={latest.vitals} />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/70 p-4 ring-1 ring-brand-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Symptoms</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{latest.symptoms}</p>
                  </div>
                  <div className="rounded-xl bg-white/70 p-4 ring-1 ring-brand-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Diagnosis</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{latest.diagnosis}</p>
                  </div>
                </div>
                {latest.notes.length ?
            <div className="mt-4 rounded-xl bg-violet-50/70 p-4 ring-1 ring-violet-200">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">Specialist treatment notes</p>
                    <ul className="mt-2 space-y-2">
                      {latest.notes.map((note) =>
                <li key={note.id} className="text-sm text-ink-soft">
                          <span className="font-semibold text-ink">{note.author}</span> · {formatDateTime(note.createdAt)}
                          <p className="mt-0.5 leading-relaxed">{note.text}</p>
                        </li>
                )}
                    </ul>
                  </div> :
            null}
              </GlassCard>

              <AISummaryPanel summary={latest.summary} language={language} onLanguageChange={setLanguage} risk={latest.risk} />
            </div>

            <GlassCard className="p-5">
              <SectionTitle title="Referral token" subtitle="Scan at the referral hospital" />
              <div className="mt-4 flex flex-col items-center gap-3">
                <ReferralQR token={latest.token} size={148} />
                <TokenChip token={latest.token} />
              </div>
              <div className="mt-4">
                <DataRow label="Raised on" value={formatDateTime(latest.createdAt)} />
                <DataRow label="Raised by" value={latest.createdBy} />
                <DataRow label="From" value={latest.fromFacility} />
                <DataRow label="Reason" value={latest.reason} />
                <DataRow label="Risk" value={<RiskBadge level={latest.risk.level} score={latest.risk.score} />} />
              </div>
              <Link to={`/report/${latest.token}?lang=${language}`}>
                <Button className="mt-4 w-full">
                  <FileTextIcon className="h-4 w-4" /> Open handoff PDF
                </Button>
              </Link>
            </GlassCard>
          </div> :

      <EmptyState
        icon={<HistoryIcon className="h-5 w-5" />}
        title="No referrals yet"
        description="This patient has a vault but no referral history. Raise the first digital referral."
        action={
        <Link to={`/phc/referral/new?patientId=${patient.id}`}>
                <Button variant="emerald">Create referral</Button>
              </Link>
        } /> :


      null}

      {tab === 'Referral history' ?
      <div className="space-y-3">
          {referrals.length === 0 ?
        <EmptyState icon={<HistoryIcon className="h-5 w-5" />} title="No referral history" description="Referrals raised for this patient will appear here." /> :

        referrals.map((referral, index) =>
        <motion.div
          key={referral.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}>
          
                <GlassCard className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-base font-bold text-ink">{referral.diagnosis}</p>
                      <p className="mt-0.5 text-sm text-ink-muted">
                        {referral.department} · {referral.hospital}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">{formatDateTime(referral.createdAt)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityBadge priority={referral.priority} />
                      <RiskBadge level={referral.risk.level} score={referral.risk.score} />
                      <StatusBadge status={referral.status} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <VitalsGrid vitals={referral.vitals} compact />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <TokenChip token={referral.token} />
                    <Link to={`/report/${referral.token}`}>
                      <Button variant="outline" size="sm">
                        <FileTextIcon className="h-4 w-4" /> PDF
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
        )
        }
        </div> :
      null}

      {tab === 'AI summaries' ?
      <div className="space-y-4">
          {referrals.length === 0 ?
        <EmptyState icon={<SparklesIcon className="h-5 w-5" />} title="No AI summaries" description="Summaries are generated with each referral." /> :

        referrals.map((referral) =>
        <div key={referral.id} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {formatDate(referral.createdAt)} · {referral.department} · token {referral.token}
                </p>
                <AISummaryPanel summary={referral.summary} language={language} onLanguageChange={setLanguage} risk={referral.risk} />
              </div>
        )
        }
        </div> :
      null}

      {tab === 'Reports & PDFs' ?
      <GlassCard className="p-5">
          <SectionTitle title="Previous reports & generated PDFs" subtitle="Labs, imaging, prescriptions and handoff documents" />
          {reports.length === 0 ?
        <p className="mt-4 text-sm text-ink-muted">No documents stored yet.</p> :

        <ul className="mt-4 divide-y divide-brand-100/70">
              {reports.map((report) =>
          <li key={report.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                      <FileTextIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{report.title}</p>
                      <p className="text-xs text-ink-muted">
                        {report.kind} · {report.facility} · {formatDate(report.date)}
                      </p>
                    </div>
                  </div>
                  {report.kind === 'Handoff PDF' ?
            <Link to={`/report/${report.title.split('· ')[1] ?? ''}`}>
                      <Button variant="outline" size="sm">
                        Open
                      </Button>
                    </Link> :

            <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-ink-muted ring-1 ring-brand-100">
                      Archived
                    </span>
            }
                </li>
          )}
            </ul>
        }
        </GlassCard> :
      null}

      {/* Delete Confirmation Modal */}
      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangleIcon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink">Delete Patient Record?</h3>
                <p className="text-xs text-rose-600 font-semibold">This action cannot be undone.</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-ink-soft leading-relaxed">
              Are you sure you want to delete the medical profile, health vault, and all referral records for{' '}
              <strong className="text-ink font-bold">{patient.name}</strong> (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{patient.id}</code>)?
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                onClick={handleDeleteConfirm}>
                <Trash2Icon className="h-4 w-4" /> Permanently Delete
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}

      <UploadMedicalReportModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        patientId={patient.id}
        patientName={patient.name}
      />
    </div>);
}