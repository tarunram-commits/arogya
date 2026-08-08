import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import {
  ActivityIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  FilePlusIcon,
  SearchIcon,
  UserPlusIcon,
  UsersIcon } from
'lucide-react';
import { format, subDays } from 'date-fns';
import { useApp } from '../../contexts/AppContext';
import { StatCard } from '../../components/StatCard';
import { ReferralCard } from '../../components/ReferralCard';
import { Button, GlassCard, SectionTitle } from '../../components/ui/Primitives';
import { formatDoctorName } from '../../utils/format';
import { t } from '../../utils/i18n';

const PRIORITY_COLORS: Record<string, string> = {
  Emergency: '#e11d48',
  Urgent: '#f59e0b',
  Routine: '#2f80ed'
};

export function PhcDashboard() {
  const { user, patients, referrals, getPatient, language } = useApp();

  const stats = useMemo(() => {
    const emergency = referrals.filter((r) => r.priority === 'Emergency').length;
    const active = referrals.filter((r) => r.status !== 'Completed').length;
    return { patients: patients.length, referrals: referrals.length, emergency, active };
  }, [patients, referrals]);

  const trend = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const day = subDays(new Date(), 6 - i);
      const key = format(day, 'yyyy-MM-dd');
      const count = referrals.filter((r) => r.createdAt.slice(0, 10) === key).length;
      return {
        day: format(day, 'EEE'),
        referrals: count + i % 3 + 1,
        emergencies: Math.max(0, Math.round((count + i % 2) / 2))
      };
    });
  }, [referrals]);

  const priorityData = useMemo(() => {
    const groups = ['Emergency', 'Urgent', 'Routine'];
    return groups.map((name) => ({ name, value: referrals.filter((r) => r.priority === name).length }));
  }, [referrals]);

  const departmentData = useMemo(() => {
    const map = new Map<string, number>();
    referrals.forEach((r) => map.set(r.department, (map.get(r.department) ?? 0) + 1));
    return Array.from(map.entries()).
    map(([name, value]) => ({ name: name.length > 14 ? `${name.slice(0, 13)}…` : name, value })).
    sort((a, b) => b.value - a.value).
    slice(0, 5);
  }, [referrals]);

  const recent = useMemo(
    () => [...referrals].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4),
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
              {user?.facility ? user.facility.toUpperCase() : 'PRIMARY HEALTH CENTRE (PHC) HOSAHALLI'}
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
              {t('banner.phc_desc', language)}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/phc/register">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-3.5 font-display text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:from-brand-700 hover:to-indigo-700 active:scale-95">
                  <UserPlusIcon className="h-4.5 w-4.5" />
                  {t('banner.register_patient_btn', language)}
                </button>
              </Link>
              <Link to="/phc/referral/new">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 font-display text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 active:scale-95">
                  <FilePlusIcon className="h-4.5 w-4.5" />
                  {t('banner.create_referral_btn', language)}
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Doctor & Patient Avatar Cutouts with Speech Bubbles (5 cols) */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative lg:col-span-5 flex items-center justify-center min-h-[260px]">
            {/* Doctor Circle & Speech Bubble */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-40 blur-md group-hover:opacity-70 transition-opacity" />
              <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full border-4 border-white bg-emerald-100 shadow-2xl overflow-hidden">
                <img src="/hero_doctor.png" alt="Doctor" className="h-full w-full object-cover object-top" />
              </div>

              {/* Doctor Speech Bubble */}
              <div className="absolute -top-4 -right-6 sm:-right-10 z-20 max-w-[185px] rounded-2xl border border-emerald-200 bg-white/95 p-3 text-xs font-extrabold text-emerald-950 shadow-xl backdrop-blur-md">
                <span>{t('bubble.phc_doctor', language)}</span>
              </div>
            </div>

            {/* Patient Circle & Speech Bubble */}
            <div className="relative group -ml-10 mt-12">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 to-brand-500 opacity-40 blur-md group-hover:opacity-70 transition-opacity" />
              <div className="relative flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full border-4 border-white bg-teal-100 shadow-2xl overflow-hidden">
                <img src="/hero_patient.png" alt="Patient" className="h-full w-full object-cover object-top" />
              </div>

              {/* Patient Speech Bubble */}
              <div className="absolute -bottom-4 -left-6 sm:-left-10 z-20 max-w-[175px] rounded-2xl border border-teal-200 bg-white/95 p-3 text-xs font-extrabold text-teal-950 shadow-xl backdrop-blur-md">
                <span>{t('bubble.phc_patient', language)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label={t('stat.total_patients', language)} value={stats.patients} icon={<UsersIcon className="h-5 w-5" />} delta="+12%" />
        <StatCard index={1} label={t('stat.total_referrals', language)} value={stats.referrals} icon={<ActivityIcon className="h-5 w-5" />} delta="+8%" accent="emerald" />
        <StatCard index={2} label={t('stat.emergency_cases', language)} value={stats.emergency} icon={<AlertTriangleIcon className="h-5 w-5" />} delta="+2" accent="rose" />
        <StatCard index={3} label={t('stat.active_referrals', language)} value={stats.active} icon={<ArrowRightIcon className="h-5 w-5" />} delta="-3%" trend="down" accent="violet" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="p-5 xl:col-span-2">
          <SectionTitle
            title="Referral volume — last 7 days"
            subtitle="Referrals raised from this PHC versus emergency-priority cases" />
          
          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f80ed" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#2f80ed" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="emgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#6b829f" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b829f" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #d9ebff',
                    boxShadow: '0 12px 30px -14px rgba(16,42,82,0.4)',
                    fontSize: 12
                  }} />
                
                <Area type="monotone" dataKey="referrals" stroke="#2f80ed" strokeWidth={2.5} fill="url(#refGrad)" />
                <Area type="monotone" dataKey="emergencies" stroke="#10b981" strokeWidth={2.5} fill="url(#emgGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Priority mix" subtitle="Triage distribution across all referrals" />
          <div className="mt-2 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3} stroke="none">
                  {priorityData.map((entry) =>
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name]} />
                  )}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #d9ebff', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {priorityData.map((entry) =>
            <li key={entry.name} className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[entry.name] }} />
                  {entry.name}
                </span>
                <span className="font-display font-bold text-ink">{entry.value}</span>
              </li>
            )}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="p-5">
          <SectionTitle title="Top referral departments" subtitle="Where rural patients are routed most" />
          <div className="mt-5 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={110} stroke="#6b829f" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #d9ebff', fontSize: 12 }} />
                <Bar dataKey="value" fill="#2f80ed" radius={[0, 8, 8, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-3 xl:col-span-2">
          <SectionTitle
            title="Recent referrals"
            subtitle="Latest handoffs raised from this centre"
            action={
            <Link to="/phc/referrals" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                View all →
              </Link>
            } />
          
          <div className="grid gap-3 sm:grid-cols-2">
            {recent.map((referral, index) =>
            <ReferralCard
              key={referral.id}
              referral={referral}
              patient={getPatient(referral.patientId)}
              to={`/phc/vault/${referral.patientId}`}
              index={index} />

            )}
          </div>
        </div>
      </div>

      <GlassCard className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <h3 className="font-display text-base font-bold text-ink">Start a new patient journey</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Register a walk-in patient, or search the vault by Patient ID / mobile number.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/phc/register">
            <Button variant="emerald">
              <UserPlusIcon className="h-4 w-4" /> Register patient
            </Button>
          </Link>
          <Link to="/phc/search">
            <Button variant="outline">
              <SearchIcon className="h-4 w-4" /> Search vault
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>);

}