import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ActivityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingIcon,
  CheckCircle2Icon,
  FileTextIcon,
  HeartPulseIcon,
  Loader2Icon,
  QrCodeIcon,
  SearchIcon,
  SparklesIcon,
  UploadCloudIcon,
  UserRoundIcon } from
'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../../contexts/AppContext';
import { Button, EmptyState, Field, GlassCard, PriorityBadge, SectionTitle, inputClass } from '../../components/ui/Primitives';
import { VitalsGrid } from '../../components/VitalsGrid';
import { AISummaryPanel } from '../../components/AISummaryPanel';
import { ReferralQR, TokenChip } from '../../components/ReferralQR';
import { UploadMedicalReportModal } from '../../components/UploadMedicalReportModal';
import { HOSPITALS, REFERRAL_REASONS } from '../../data/reference';
import { assessRisk, generateSummary } from '../../utils/ai';
import { initials, nextReferralToken, uid } from '../../utils/format';
import type { Language, Patient, Priority, Referral, Vitals } from '../../types';

const STEPS = ['Patient', 'Clinical record', 'Referral & AI', 'Handoff'];

interface VitalsForm {
  bp: string;
  heartRate: string;
  temperature: string;
  spo2: string;
  bloodSugar: string;
  weight: string;
}

const EMPTY_VITALS: VitalsForm = { bp: '', heartRate: '', temperature: '', spo2: '', bloodSugar: '', weight: '' };

export function CreateReferral() {
  const { user, patients, getPatient, addReferral, addReport, reportsForPatient, searchPatients } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const initialPatient = getPatient(params.get('patientId') ?? '');
  const [patient, setPatient] = useState<Patient | undefined>(initialPatient);
  const [step, setStep] = useState(initialPatient ? 1 : 0);
  const [query, setQuery] = useState('');

  const [vitals, setVitals] = useState<VitalsForm>(EMPTY_VITALS);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [priority, setPriority] = useState<Priority>('Urgent');

  const [hospital, setHospital] = useState(HOSPITALS[0].name);
  const [department, setDepartment] = useState(HOSPITALS[0].departments[0]);
  const [reason, setReason] = useState(REFERRAL_REASONS[0]);

  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState<Record<Language, string> | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [created, setCreated] = useState<Referral | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const numericVitals: Vitals = useMemo(
    () => ({
      bp: vitals.bp || '0/0',
      heartRate: Number(vitals.heartRate) || 0,
      temperature: Number(vitals.temperature) || 0,
      spo2: Number(vitals.spo2) || 0,
      bloodSugar: Number(vitals.bloodSugar) || 0,
      weight: Number(vitals.weight) || 0
    }),
    [vitals]
  );

  const risk = useMemo(
    () => patient ? assessRisk({ vitals: numericVitals, patient, priority }) : null,
    [patient, numericVitals, priority]
  );

  const clinicalReady =
  /^\d{2,3}\/\d{2,3}$/.test(vitals.bp) &&
  Boolean(vitals.heartRate && vitals.temperature && vitals.spo2 && vitals.weight) &&
  symptoms.trim().length > 6 &&
  diagnosis.trim().length > 2;

  const results = useMemo(() => query.trim() ? searchPatients(query) : patients.slice(0, 5), [query, patients, searchPatients]);
  const departments = HOSPITALS.find((h) => h.name === hospital)?.departments ?? [];

  const runAi = () => {
    if (!patient || !risk) return;
    setGenerating(true);
    window.setTimeout(() => {
      setSummary(
        generateSummary({
          patient,
          vitals: numericVitals,
          symptoms,
          diagnosis,
          hospital,
          department,
          reason,
          priority,
          risk
        })
      );
      setGenerating(false);
      toast.success('AI medical summary generated', { description: `Risk assessed as ${risk.level} (${risk.score}/100)` });
    }, 1200);
  };

  const finalise = () => {
    if (!patient || !risk || !summary) return;
    const referral: Referral = {
      id: uid('r'),
      token: nextReferralToken(),
      patientId: patient.id,
      vitals: numericVitals,
      symptoms: symptoms.trim(),
      diagnosis: diagnosis.trim(),
      priority,
      hospital,
      department,
      reason,
      risk,
      summary,
      status: 'Active',
      createdAt: new Date().toISOString(),
      createdBy: user?.name ?? 'PHC Doctor',
      fromFacility: user?.facility ?? 'PHC',
      notes: [],
      pdfLanguage: language
    };
    addReferral(referral);
    addReport({
      patientId: patient.id,
      title: `Medical Handoff Report · ${referral.token}`,
      kind: 'Handoff PDF',
      facility: referral.fromFacility,
      date: referral.createdAt
    });
    setCreated(referral);
    setStep(3);
    toast.success('Referral token & QR generated', { description: 'Saved to the patient health vault.' });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Digital referral</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Record vitals, generate the AI summary, and issue a scannable handoff in one flow.
          </p>
        </div>
        {patient ?
        <div className="glass flex items-center gap-3 rounded-2xl px-4 py-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
              {initials(patient.name)}
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold text-ink">{patient.name}</span>
              <span className="block font-mono text-[11px] text-ink-muted">{patient.id}</span>
            </span>
          </div> :
        null}
      </header>

      {/* Stepper */}
      <ol className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3" aria-label="Referral progress">
        {STEPS.map((label, index) => {
          const state = index === step ? 'current' : index < step ? 'done' : 'todo';
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={twMerge(
                  'flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors',
                  state === 'current' ?
                  'bg-brand-600 text-white' :
                  state === 'done' ?
                  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                  'bg-white/60 text-ink-muted ring-1 ring-brand-100'
                )}>
                
                {state === 'done' ?
                <CheckCircle2Icon className="h-3.5 w-3.5" /> :

                <span className="font-mono">{index + 1}</span>
                }
                {label}
              </span>
              {index < STEPS.length - 1 ? <span className="h-px w-4 bg-brand-200 sm:w-8" aria-hidden="true" /> : null}
            </li>);

        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
          
          {/* STEP 0 — patient */}
          {step === 0 ?
          <div className="space-y-4">
              <GlassCard className="p-5">
                <SectionTitle
                title="Select patient"
                subtitle="Search by Patient ID, mobile number or name"
                icon={<UserRoundIcon className="h-4 w-4" />}
                action={
                <Link to="/phc/register">
                      <Button variant="outline" size="sm">
                        Register new patient
                      </Button>
                    </Link>
                } />
              
                <div className="relative mt-4">
                  <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                  className={twMerge(inputClass, 'pl-10 py-3')}
                  placeholder="AV-P1001 · 9845012233 · Ramesh"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search patient" />
                
                </div>
              </GlassCard>

              {results.length === 0 ?
            <EmptyState
              icon={<UserRoundIcon className="h-5 w-5" />}
              title="No matching patient"
              description="Register the patient to create a vault, then return to this referral."
              action={
              <Link to="/phc/register">
                      <Button variant="emerald">Register patient</Button>
                    </Link>
              } /> :


            <div className="grid gap-3 md:grid-cols-2">
                  {results.map((p) =>
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPatient(p);
                  setStep(1);
                }}
                className="glass flex items-center gap-3 rounded-2xl p-4 text-left shadow-glass transition-all hover:-translate-y-0.5 hover:shadow-lift">
                
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                        {initials(p.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-ink">{p.name}</span>
                        <span className="block text-xs text-ink-muted">
                          {p.id} · {p.age}y {p.gender} · {p.village}
                        </span>
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-brand-400" />
                    </button>
              )}
                </div>
            }
            </div> :
          null}

          {/* STEP 1 — clinical */}
          {step === 1 && patient ?
          <div className="grid gap-4 lg:grid-cols-3">
              <GlassCard className="space-y-5 p-5 lg:col-span-2">
                <SectionTitle title="Vital signs" subtitle="Recorded at the PHC today" icon={<HeartPulseIcon className="h-4 w-4" />} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Blood pressure" required hint="systolic/diastolic">
                    <input
                    className={inputClass}
                    value={vitals.bp}
                    onChange={(e) => setVitals((v) => ({ ...v, bp: e.target.value.replace(/[^\d/]/g, '').slice(0, 7) }))}
                    placeholder="140/90" />
                  
                  </Field>
                  <Field label="Heart rate (bpm)" required>
                    <input
                    className={inputClass}
                    value={vitals.heartRate}
                    inputMode="numeric"
                    onChange={(e) => setVitals((v) => ({ ...v, heartRate: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                    placeholder="88" />
                  
                  </Field>
                  <Field label="Temperature (°F)" required>
                    <input
                    className={inputClass}
                    value={vitals.temperature}
                    onChange={(e) => setVitals((v) => ({ ...v, temperature: e.target.value.replace(/[^\d.]/g, '').slice(0, 5) }))}
                    placeholder="98.6" />
                  
                  </Field>
                  <Field label="SpO₂ (%)" required>
                    <input
                    className={inputClass}
                    value={vitals.spo2}
                    inputMode="numeric"
                    onChange={(e) => setVitals((v) => ({ ...v, spo2: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                    placeholder="97" />
                  
                  </Field>
                  <Field label="Blood sugar (mg/dL)">
                    <input
                    className={inputClass}
                    value={vitals.bloodSugar}
                    inputMode="numeric"
                    onChange={(e) => setVitals((v) => ({ ...v, bloodSugar: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                    placeholder="110" />
                  
                  </Field>
                  <Field label="Weight (kg)" required>
                    <input
                    className={inputClass}
                    value={vitals.weight}
                    onChange={(e) => setVitals((v) => ({ ...v, weight: e.target.value.replace(/[^\d.]/g, '').slice(0, 5) }))}
                    placeholder="62" />
                  
                  </Field>
                </div>

                <div className="border-t border-brand-100/70 pt-5">
                  <SectionTitle title="Clinical notes" icon={<ActivityIcon className="h-4 w-4" />} />
                  <div className="mt-4 space-y-4">
                    <Field label="Symptoms" required hint="Onset, duration, severity">
                      <textarea
                      className={twMerge(inputClass, 'min-h-[92px] resize-y')}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Chest tightness on exertion for 3 days, breathlessness while walking…" />
                    
                    </Field>
                    <Field label="Provisional diagnosis" required>
                      <input
                      className={inputClass}
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Suspected unstable angina" />
                    
                    </Field>
                    <Field label="Emergency priority" required>
                      <div className="flex flex-wrap gap-2">
                        {(['Routine', 'Urgent', 'Emergency'] as Priority[]).map((option) =>
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPriority(option)}
                        aria-pressed={priority === option}
                        className={twMerge(
                          'rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition-all',
                          priority === option ?
                          option === 'Emergency' ?
                          'bg-rose-600 text-white shadow-lift' :
                          option === 'Urgent' ?
                          'bg-amber-500 text-white shadow-lift' :
                          'bg-brand-600 text-white shadow-lift' :
                          'bg-white/70 text-ink-soft ring-1 ring-brand-100 hover:bg-white'
                        )}>
                        
                            {option}
                          </button>
                      )}
                      </div>
                    </Field>
                  </div>
                </div>

                <div className="border-t border-brand-100/70 pt-5 space-y-3">
                  <SectionTitle
                    title="Attached Medical Reports (PDF / Pictures)"
                    subtitle="Upload previous lab results, ECG scans, X-rays, or prescriptions"
                    icon={<FileTextIcon className="h-4 w-4" />}
                    action={
                      <Button
                        type="button"
                        size="sm"
                        variant="emerald"
                        onClick={() => setShowUploadModal(true)}>
                        <UploadCloudIcon className="h-4 w-4" /> Upload PDF / Pic
                      </Button>
                    }
                  />

                  {reportsForPatient(patient.id).length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {reportsForPatient(patient.id).map((rep) => (
                        <div key={rep.id} className="flex items-center gap-3 rounded-xl border border-brand-100 bg-white/80 p-3 text-xs shadow-sm">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                            {rep.fileType === 'image' ? 'IMG' : 'PDF'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-ink truncate">{rep.title}</p>
                            <p className="text-[10px] text-ink-muted">{rep.kind} · {rep.fileSize || 'Attached'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-4 text-center text-xs text-ink-muted">
                      No reports attached yet. Click <strong className="text-brand-700">Upload PDF / Pic</strong> to attach medical files to this referral.
                    </div>
                  )}
                </div>
              </GlassCard>

              <div className="space-y-4">
                <GlassCard className="p-5">
                  <SectionTitle title="Live vitals read" subtitle="Auto-flagged as you type" />
                  <div className="mt-4">
                    <VitalsGrid vitals={numericVitals} compact />
                  </div>
                </GlassCard>
                <GlassCard className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Patient history on file</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{patient.history || 'No history recorded.'}</p>
                </GlassCard>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setStep(0)}>
                    <ArrowLeftIcon className="h-4 w-4" /> Back
                  </Button>
                  <Button
                  className="flex-1"
                  disabled={!clinicalReady}
                  onClick={() => setStep(2)}>
                  
                    Continue <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
                {!clinicalReady ?
              <p className="text-xs text-ink-muted">
                    Complete BP (e.g. 140/90), heart rate, temperature, SpO₂, weight, symptoms and diagnosis to continue.
                  </p> :
              null}
              </div>
            </div> :
          null}

          {/* STEP 2 — referral target + AI */}
          {step === 2 && patient && risk ?
          <div className="grid gap-4 lg:grid-cols-3">
              <GlassCard className="space-y-5 p-5 lg:col-span-2">
                <SectionTitle title="Referral destination" icon={<BuildingIcon className="h-4 w-4" />} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Referral hospital" required className="sm:col-span-2">
                    <select
                    className={inputClass}
                    value={hospital}
                    onChange={(e) => {
                      setHospital(e.target.value);
                      const next = HOSPITALS.find((h) => h.name === e.target.value);
                      setDepartment(next?.departments[0] ?? '');
                      setSummary(null);
                    }}>
                    
                      {HOSPITALS.map((h) =>
                    <option key={h.name} value={h.name}>
                          {h.name} · {h.city}
                        </option>
                    )}
                    </select>
                  </Field>
                  <Field label="Department" required>
                    <select
                    className={inputClass}
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setSummary(null);
                    }}>
                    
                      {departments.map((d) =>
                    <option key={d} value={d}>
                          {d}
                        </option>
                    )}
                    </select>
                  </Field>
                  <Field label="Referral reason" required>
                    <select
                    className={inputClass}
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setSummary(null);
                    }}>
                    
                      {REFERRAL_REASONS.map((r) =>
                    <option key={r} value={r}>
                          {r}
                        </option>
                    )}
                    </select>
                  </Field>
                </div>

                <div className="border-t border-brand-100/70 pt-5">
                  {summary ?
                <AISummaryPanel summary={summary} language={language} onLanguageChange={setLanguage} risk={risk} /> :

                <div className="rounded-2xl border border-dashed border-brand-200 bg-white/50 p-6 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                        {generating ?
                    <Loader2Icon className="h-5 w-5 animate-spin" /> :

                    <SparklesIcon className="h-5 w-5" />
                    }
                      </span>
                      <p className="mt-3 font-display text-base font-bold text-ink">
                        {generating ? 'Analysing clinical record…' : 'Generate AI medical summary'}
                      </p>
                      <p className="mx-auto mt-1 max-w-md text-sm text-ink-muted">
                        {generating ?
                    'Correlating vitals, symptoms, diagnosis and previous history.' :
                    'One concise handoff note built from vitals, symptoms, diagnosis and history — translatable into 4 languages.'}
                      </p>
                      <Button className="mt-4" onClick={runAi} disabled={generating}>
                        <SparklesIcon className="h-4 w-4" />
                        {generating ? 'Generating…' : 'Generate summary'}
                      </Button>
                    </div>
                }
                </div>
              </GlassCard>

              <div className="space-y-4">
                <GlassCard className="p-5">
                  <SectionTitle title="AI risk indicator" subtitle="Advisory triage score" />
                  <div className="mt-4">
                    <div className="flex items-end justify-between">
                      <p
                      className={twMerge(
                        'font-display text-3xl font-extrabold tracking-tight',
                        risk.level === 'High' ? 'text-rose-600' : risk.level === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                      )}>
                      
                        {risk.level}
                      </p>
                      <p className="font-mono text-sm font-bold text-ink-muted">{risk.score}/100</p>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-brand-100">
                      <motion.div
                      className={twMerge(
                        'h-full rounded-full',
                        risk.level === 'High' ? 'bg-rose-500' : risk.level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${risk.score}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
                    
                    </div>
                    <PriorityBadge priority={priority} />
                  </div>
                  <div className="mt-4">
                    <VitalsGrid vitals={numericVitals} compact />
                  </div>
                </GlassCard>

                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeftIcon className="h-4 w-4" /> Back
                  </Button>
                  <Button variant="emerald" className="flex-1" disabled={!summary} onClick={finalise}>
                    <QrCodeIcon className="h-4 w-4" /> Generate token & QR
                  </Button>
                </div>
                {!summary ? <p className="text-xs text-ink-muted">Generate the AI summary to issue the referral token.</p> : null}
              </div>
            </div> :
          null}

          {/* STEP 3 — handoff */}
          {step === 3 && created && patient ?
          <div className="grid gap-4 lg:grid-cols-3">
              <GlassCard className="p-5 lg:col-span-2">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                    <CheckCircle2Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">Referral issued</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      Saved to {patient.name}'s health vault and visible to {department}, {hospital}.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-[auto,1fr]">
                  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 p-4 ring-1 ring-brand-100 shadow-sm">
                    <ReferralQR token={created.token} size={160} />
                    <TokenChip token={created.token} />
                    <p className="text-center text-[11px] font-medium text-ink-muted">Scan QR at District Hospital</p>
                  </div>
                  
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-brand-100/80 shadow-sm space-y-3">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">Referral Details</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-brand-50/70 p-3 ring-1 ring-brand-100/50">
                          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Patient Name</p>
                          <p className="font-bold text-ink text-base mt-0.5">{patient.name}</p>
                        </div>

                        <div className="rounded-xl bg-brand-50/70 p-3 ring-1 ring-brand-100/50">
                          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Village Name</p>
                          <p className="font-bold text-ink text-base mt-0.5">{patient.village}</p>
                        </div>

                        <div className="rounded-xl bg-brand-50/70 p-3 ring-1 ring-brand-100/50">
                          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Doctor Name</p>
                          <p className="font-bold text-ink text-base mt-0.5">{created.createdBy || user?.name || 'Dr. Medical Officer'}</p>
                        </div>

                        <div className="rounded-xl bg-brand-50/70 p-3 ring-1 ring-brand-100/50">
                          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Referral Hospital</p>
                          <p className="font-bold text-ink text-base mt-0.5">{created.hospital}</p>
                          {created.department ? <p className="text-xs font-medium text-brand-600 mt-0.5">{created.department}</p> : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link to={`/report/${created.token}?lang=${language}`}>
                        <Button>
                          <FileTextIcon className="h-4 w-4" /> Open PDF report
                        </Button>
                      </Link>
                      <Link to={`/phc/vault/${patient.id}`}>
                        <Button variant="outline">Open health vault</Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCreated(null);
                          setSummary(null);
                          setVitals(EMPTY_VITALS);
                          setSymptoms('');
                          setDiagnosis('');
                          setPatient(undefined);
                          setStep(0);
                          navigate('/phc/referral/new');
                        }}>
                        New referral
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="space-y-4">
                <AISummaryPanel summary={created.summary} language={language} onLanguageChange={setLanguage} risk={created.risk} />
              </div>
            </div> :
          null}
        </motion.div>
      </AnimatePresence>

      {patient ? (
        <UploadMedicalReportModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          patientId={patient.id}
          patientName={patient.name}
        />
      ) : null}
    </div>);
}