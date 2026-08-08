import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  HospitalIcon,
  LockIcon,
  MailIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StethoscopeIcon,
  UserIcon
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';
import { useApp } from '../contexts/AppContext';
import { Logo } from '../components/Brand';
import type { Role } from '../types';

const ROLE_CARDS: { role: Role; title: string; body: string; icon: React.ReactNode }[] = [
  {
    role: 'phc',
    title: 'PHC Doctor',
    body: 'Register patients, create digital referrals, generate AI summaries & handoff PDFs.',
    icon: <StethoscopeIcon className="h-5 w-5" />
  },
  {
    role: 'specialist',
    title: 'Specialist Doctor',
    body: 'Scan referral QR codes, review complete patient health vault & log treatment notes.',
    icon: <HospitalIcon className="h-5 w-5" />
  }
];

export function Login() {
  const { login, loginWithSupabase, signUpWithSupabase } = useApp();
  const navigate = useNavigate();

  // Auth mode: 'signin' | 'signup'
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<Role>('phc');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (authTab === 'signin') {
      // If user enters email/pass, authenticate via Supabase Auth
      if (email.trim() && password) {
        const res = await loginWithSupabase(email.trim(), password);
        setLoading(false);
        if (res.error) {
          toast.error('Sign In Failed', { description: res.error });
        } else if (res.user) {
          toast.success(`Welcome back, ${res.user.name}`);
          navigate(role === 'specialist' || res.user.role === 'specialist' ? '/specialist' : '/phc');
        }
      } else {
        // Fallback demo login for selected role
        const demoUser = login(role);
        setLoading(false);
        toast.success(`Welcome back, ${demoUser.name}`);
        navigate(role === 'specialist' ? '/specialist' : '/phc');
      }
    } else {
      // New Sign Up
      if (!name.trim()) {
        toast.error('Please enter doctor full name');
        setLoading(false);
        return;
      }

      const defaultFacility =
        role === 'specialist'
          ? 'District General Hospital, Tumakuru'
          : 'PHC Hosahalli, Tumakuru District';
      const defaultReg = 'KMC-' + Math.floor(10000 + Math.random() * 90000);

      const res = await signUpWithSupabase(
        email.trim(),
        password,
        name.trim(),
        role,
        defaultFacility,
        defaultReg
      );
      setLoading(false);
      if (res.error) {
        toast.error('Sign Up Failed', { description: res.error });
      } else if (res.user) {
        toast.success(`Account created! Welcome, ${res.user.name}`);
        navigate(role === 'specialist' ? '/specialist' : '/phc');
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 font-sans antialiased text-slate-100 grid lg:grid-cols-12">
      {/* Premium Background Ambient Glow Effects */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-brand-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />

      {/* Brand Rail (Left 5 cols) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950/80 p-12 lg:col-span-5 lg:flex border-r border-slate-800/80 backdrop-blur-xl">
        <div className="grid-lines absolute inset-0 opacity-40" aria-hidden="true" />

        <div className="relative z-10">
          <Logo tone="dark" size="lg" />
        </div>

        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Rural Health Network & Realtime Health Vault
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-white">
            Seamless Healthcare Bridge From Rural Care to Specialist Excellence.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Arogya-Vahini connects Primary Health Centres directly to District Hospitals with scannable QR tokens, AI-driven risk triage, and encrypted ABDM health vaults.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: <SparklesIcon className="h-4 w-4 text-brand-400" />, label: 'AI Risk Triage' },
              { icon: <QrCodeIcon className="h-4 w-4 text-emerald-400" />, label: 'Instant QR Handoff' },
              { icon: <ShieldCheckIcon className="h-4 w-4 text-indigo-400" />, label: 'ABDM Health Vault' }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md transition-transform hover:-translate-y-0.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80">
                  {item.icon}
                </span>
                <p className="mt-3 text-xs font-semibold text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-900">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Supabase Realtime Active
          </span>
          <span>Security Token Encrypted</span>
        </div>
      </div>

      {/* Main Authentication Form Container (Right 7 cols) */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 lg:col-span-7 bg-slate-900/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950/90 p-7 sm:p-10 shadow-2xl shadow-slate-950/80 backdrop-blur-2xl">
          
          <div className="lg:hidden mb-6">
            <Logo tone="dark" />
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {authTab === 'signin' ? 'Sign In to Medical Console' : 'New Doctor Registration'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {authTab === 'signin'
                ? 'Select your doctor role and enter your credentials.'
                : 'Create your doctor profile for instant console access.'}
            </p>
          </div>

          {/* Premium Segmented Tab Switcher */}
          <div className="mt-6 flex rounded-2xl bg-slate-900/90 p-1.5 ring-1 ring-slate-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthTab('signin')}
              className={twMerge(
                'relative flex-1 rounded-xl py-2.5 transition-all text-center font-bold',
                authTab === 'signin' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25' : 'text-slate-400 hover:text-slate-200'
              )}>
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('signup')}
              className={twMerge(
                'relative flex-1 rounded-xl py-2.5 transition-all text-center font-bold',
                authTab === 'signup' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25' : 'text-slate-400 hover:text-slate-200'
              )}>
              New Sign Up
            </button>
          </div>

          {/* Role Selection Cards — DISPLAYED IN BOTH SIGN IN & NEW SIGN UP */}
          <div className="mt-6 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Console Role
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {ROLE_CARDS.map((card) => {
                const isActive = role === card.role;
                return (
                  <button
                    key={card.role}
                    type="button"
                    onClick={() => setRole(card.role)}
                    className={twMerge(
                      'relative flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-200 border',
                      isActive
                        ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/40 shadow-lg shadow-brand-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                    )}>
                    <div className="flex items-center justify-between">
                      <span
                        className={twMerge(
                          'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                          isActive ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
                        )}>
                        {card.icon}
                      </span>
                      {isActive ? (
                        <CheckCircle2Icon className="h-5 w-5 text-emerald-400" />
                      ) : null}
                    </div>

                    <div className="mt-3">
                      <p className="font-display text-sm font-bold text-white">{card.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{card.body}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {authTab === 'signup' ? (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Doctor Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-3 text-sm font-medium text-white placeholder-slate-500 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    placeholder="Dr. Ananya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-3 text-sm font-medium text-white placeholder-slate-500 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  placeholder="doctor@arogyavahini.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={authTab === 'signup'}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-3 text-sm font-medium text-white placeholder-slate-500 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={authTab === 'signup'}
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 py-3.5 px-5 font-display text-sm font-bold text-white shadow-xl shadow-brand-600/30 transition-all hover:from-brand-500 hover:to-indigo-500 hover:shadow-brand-500/40 active:scale-[0.99] disabled:opacity-50">
              {loading
                ? authTab === 'signin' ? 'Authenticating Doctor…' : 'Registering Doctor Profile…'
                : authTab === 'signin' ? `Sign In as ${role === 'phc' ? 'PHC Doctor' : 'Specialist Doctor'}` : 'Complete New Sign Up'}
              {loading ? null : <ArrowRightIcon className="h-4 w-4" />}
            </button>
          </form>

          {/* Switch Footer Link */}
          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-900 pt-5">
            {authTab === 'signin' ? (
              <p>
                Need a new doctor account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthTab('signup')}
                  className="font-bold text-brand-400 hover:text-brand-300 hover:underline">
                  New Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have a doctor profile?{' '}
                <button
                  type="button"
                  onClick={() => setAuthTab('signin')}
                  className="font-bold text-brand-400 hover:text-brand-300 hover:underline">
                  Sign In
                </button>
              </p>
            )}
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-400" />
            Supabase Cloud Auth · Consent-Based Health Vault Access
          </p>
        </motion.div>
      </div>
    </div>
  );
}