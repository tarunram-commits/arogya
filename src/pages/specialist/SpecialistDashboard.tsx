import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InboxIcon,
  QrCodeIcon,
  StethoscopeIcon
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { StatCard } from '../../components/StatCard';
import { ReferralCard } from '../../components/ReferralCard';
import { Button, GlassCard, SectionTitle } from '../../components/ui/Primitives';
import { formatDoctorName } from '../../utils/format';
import { t } from '../../utils/i18n';

export function SpecialistDashboard() {
  const { user, referrals, getPatient, language } = useApp();

  const stats = useMemo(() => {
    const incoming = referrals.filter((r) => r.status === 'Active').length;
    const emergency = referrals.filter((r) => r.priority === 'Emergency' && r.status !== 'Completed').length;
    const inTreatment = referrals.filter((r) => r.status === 'In Treatment').length;
    const completed = referrals.filter((r) => r.status === 'Completed').length;
    return { incoming, emergency, inTreatment, completed };
  }, [referrals]);

  const queue = useMemo(
    () =>
      [...referrals]
        .filter((r) => r.status !== 'Completed')
        .sort((a, b) => b.risk.score - a.risk.score)
        .slice(0, 4),
    [referrals]
  );

  return (
    <div className="space-y-6">
      {/* PhysicsWallah-Style Bharat's Health Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-50 via-brand-50/50 to-indigo-50/70 p-6 sm:p-10 border border-brand-100/80 shadow-lg">
        {/* Background ambient decorative light grids */}
        <div className="grid-lines absolute inset-0 opacity-20 pointer-events-none" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Headline & Action Buttons (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {user?.facility ? user.facility.toUpperCase() : 'DISTRICT SPECIALTY HOSPITAL, TUMAKURU'}
            </div>

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-[1.15]">
              {t('banner.slogan_prefix', language)}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600">
                {t('banner.slogan_highlight', language)}
              </span>
            </h1>

            <p className="font-display text-base font-bold text-slate-700">
              {t('banner.welcome', language)}, {formatDoctorName(user?.name)}
            </p>

            <p className="text-sm leading-relaxed text-ink-muted max-w-xl">
              {t('banner.specialist_desc', language)}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/specialist/scan">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-3.5 font-display text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:from-brand-700 hover:to-indigo-700 active:scale-95">
                  <QrCodeIcon className="h-4.5 w-4.5" />
                  {t('banner.scan_qr_btn', language)}
                </button>
              </Link>
              <Link to="/specialist/queue">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 font-display text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 active:scale-95">
                  <StethoscopeIcon className="h-4.5 w-4.5" />
                  {t('banner.queue_btn', language)}
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Doctor & Patient Avatar Cutouts with Speech Bubbles (5 cols) */}
          <div className="relative lg:col-span-5 flex items-center justify-center min-h-[220px]">
            {/* Doctor Circle & Speech Bubble */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 opacity-30 blur-md group-hover:opacity-60 transition-opacity" />
              <div className="relative flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center rounded-full border-4 border-white bg-indigo-100 shadow-xl overflow-hidden">
                <img src="/hero_doctor.png" alt="Doctor" className="h-full w-full object-cover object-top" />
              </div>

              {/* Doctor Speech Bubble */}
              <div className="absolute -top-3 -right-6 sm:-right-10 z-20 max-w-[170px] rounded-2xl border border-indigo-100 bg-white/95 p-2.5 text-[11px] font-bold text-indigo-900 shadow-xl backdrop-blur-md">
                <span>{t('bubble.specialist_doctor', language)}</span>
              </div>
            </div>

            {/* Patient Circle & Speech Bubble */}
            <div className="relative group -ml-8 mt-10">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-30 blur-md group-hover:opacity-60 transition-opacity" />
              <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border-4 border-white bg-emerald-100 shadow-xl overflow-hidden">
                <img src="/hero_patient.png" alt="Patient" className="h-full w-full object-cover object-top" />
              </div>

              {/* Patient Speech Bubble */}
              <div className="absolute -bottom-4 -left-6 sm:-left-10 z-20 max-w-[160px] rounded-2xl border border-emerald-100 bg-white/95 p-2.5 text-[11px] font-bold text-emerald-900 shadow-xl backdrop-blur-md">
                <span>{t('bubble.specialist_patient', language)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label={t('stat.incoming_referrals', language)} value={stats.incoming} icon={<InboxIcon className="h-5 w-5" />} delta="+4" />
        <StatCard index={1} label={t('stat.emergency_waiting', language)} value={stats.emergency} icon={<AlertTriangleIcon className="h-5 w-5" />} accent="rose" delta="+1" />
        <StatCard index={2} label={t('stat.under_treatment', language)} value={stats.inTreatment} icon={<StethoscopeIcon className="h-5 w-5" />} accent="violet" />
        <StatCard index={3} label={t('stat.completed_handoffs', language)} value={stats.completed} icon={<CheckCircle2Icon className="h-5 w-5" />} accent="emerald" delta="+9%" />
      </div>

      <GlassCard className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <QrCodeIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-ink">Patient at the desk?</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Scan the QR on their referral slip to pull the entire health vault instantly.
            </p>
          </div>
        </div>
        <Link to="/specialist/scan">
          <Button variant="emerald">Open scanner</Button>
        </Link>
      </GlassCard>

      {/* Priority Queue Positioned Below Dashboard */}
      <div className="space-y-4 pt-2">
        <SectionTitle
          title="Priority Queue"
          subtitle="Sorted by AI risk score — highest first"
          action={
            <Link to="/specialist/queue" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View queue →
            </Link>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {queue.map((referral, index) => (
            <ReferralCard
              key={referral.id}
              referral={referral}
              patient={getPatient(referral.patientId)}
              to={`/specialist/referral/${referral.token}`}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}