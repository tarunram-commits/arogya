import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronRightIcon,
  GlobeIcon,
  HeartIcon,
  HospitalIcon,
  LockKeyholeIcon,
  MailIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StethoscopeIcon,
  UserCheckIcon,
  UserIcon,
  ZapIcon
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../contexts/AppContext';
import { Logo } from '../components/Brand';
import type { Role } from '../types';
import { toast } from 'sonner';

type ExtendedRole = 'phc' | 'specialist' | 'patient' | 'admin';

interface RoleOption {
  role: ExtendedRole;
  title: string;
  badge: string;
  icon: React.ReactNode;
  accent: string;
  description: string;
  defaultEmail: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'phc',
    title: 'PHC Doctor',
    badge: 'Primary Care',
    icon: <StethoscopeIcon className="h-5 w-5 text-brand-400" />,
    accent: 'border-brand-500 bg-brand-500/10 text-brand-400',
    description: 'Register patients, create digital referrals, generate AI summaries, and manage healthcare records.',
    defaultEmail: 'phc.doctor@arogyavahini.org'
  },
  {
    role: 'specialist',
    title: 'Specialist Doctor',
    badge: 'District Hub',
    icon: <HospitalIcon className="h-5 w-5 text-emerald-400" />,
    accent: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    description: 'Review referral cases, access patient history, and provide specialist consultation.',
    defaultEmail: 'specialist.doctor@arogyavahini.org'
  },
  {
    role: 'patient',
    title: 'Patient Member',
    badge: 'ABDM Health Vault',
    icon: <UserIcon className="h-5 w-5 text-saffron-400" />,
    accent: 'border-amber-500 bg-amber-500/10 text-amber-400',
    description: 'View health records, track referrals, receive AI health guidance, and manage appointments.',
    defaultEmail: 'patient.member@arogyavahini.org'
  },
  {
    role: 'admin',
    title: 'Hospital Admin',
    badge: 'Network Monitor',
    icon: <ShieldCheckIcon className="h-5 w-5 text-indigo-400" />,
    accent: 'border-indigo-500 bg-indigo-500/10 text-indigo-400',
    description: 'Monitor healthcare workflows and manage connected healthcare networks.',
    defaultEmail: 'admin@arogyavahini.org'
  }
];

export function LandingPage() {
  const { login, loginWithSupabase, signUpWithSupabase } = useApp();
  const navigate = useNavigate();

  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<ExtendedRole>('phc');
  const [email, setEmail] = useState('phc.doctor@arogyavahini.org');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (opt: RoleOption) => {
    setSelectedRole(opt.role);
    if (!email || email.includes('@arogyavahini.org')) {
      setEmail(opt.defaultEmail);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);

    if (selectedRole === 'patient') {
      toast.success('Welcome Patient Member! Opening ABDM Health Vault Demo.');
      login('phc');
      navigate('/phc/search');
      setLoading(false);
      return;
    }

    if (selectedRole === 'admin') {
      toast.success('Welcome Hospital Admin! Opening Network Workflow Dashboard.');
      login('specialist');
      navigate('/specialist');
      setLoading(false);
      return;
    }

    const actualRole: Role = selectedRole === 'specialist' ? 'specialist' : 'phc';

    if (authTab === 'signin') {
      const res = await loginWithSupabase(email.trim(), password);
      setLoading(false);
      if (res.error) {
        toast.error('Sign In Failed', { description: res.error });
      } else if (res.user) {
        toast.success(`Welcome back, ${res.user.name}`);
        navigate(res.user.role === 'specialist' ? '/specialist' : '/phc');
      }
    } else {
      if (!name.trim()) {
        toast.error('Please enter your full doctor name');
        setLoading(false);
        return;
      }
      const defaultFacility = actualRole === 'specialist' ? 'District Specialty Hospital' : 'Primary Health Centre (PHC)';
      const defaultReg = `MC-REG-${Math.floor(100000 + Math.random() * 900000)}`;

      const res = await signUpWithSupabase(
        email.trim(),
        password,
        name.trim(),
        actualRole,
        defaultFacility,
        defaultReg
      );
      setLoading(false);
      if (res.error) {
        toast.error('Registration Failed', { description: res.error });
      } else if (res.user) {
        toast.success(`Account created successfully! Welcome, ${res.user.name}`);
        navigate(actualRole === 'specialist' ? '/specialist' : '/phc');
      }
    }
  };

  const scrollToLogin = () => {
    const el = document.getElementById('login-portal');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] font-sans antialiased text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Background Ambient Glowing Grids & Radial Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="grid-lines absolute inset-0 opacity-25" />
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-brand-600/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[700px] w-[700px] rounded-full bg-indigo-600/15 blur-[160px]" />
        <div className="absolute -bottom-40 left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-600/15 blur-[140px]" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Logo tone="dark" size="lg" />

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#hero-section" className="transition-colors hover:text-white">Home</a>
            <a href="#features-section" className="transition-colors hover:text-white">Features</a>
            <a href="#workflow-section" className="transition-colors hover:text-white">How It Works</a>
            <a href="#impact-section" className="transition-colors hover:text-white">Healthcare Network</a>
          </nav>

          {/* Login Action */}
          <button
            type="button"
            onClick={scrollToLogin}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 font-display text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:from-brand-500 hover:to-indigo-500 active:scale-95">
            <UserCheckIcon className="h-4 w-4" />
            Login
          </button>
        </div>
      </header>

      {/* SECTION 1: HERO / INTRODUCTION */}
      <section id="hero-section" className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-bold text-emerald-400 backdrop-blur-md shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              🇮🇳 Rural Healthcare Network & Digital Health Vault
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Seamless Healthcare Bridge From{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-brand-400">
                Rural Care
              </span>{' '}
              to Specialist Excellence.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl">
              Arogya-Vahini connects Primary Health Centres, specialist doctors, hospitals, and patients through AI-powered referrals, secure digital health records, and intelligent healthcare coordination.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={scrollToLogin}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 px-7 py-4 font-display text-base font-extrabold text-white shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-95">
                Get Started
                <ArrowRightIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-7 py-4 font-display text-base font-bold text-slate-200 shadow-lg backdrop-blur-md transition-all hover:bg-slate-800 hover:text-white active:scale-95">
                Explore Features
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Professional Healthcare Graphic Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:col-span-5 flex justify-center">
            
            <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-2xl shadow-slate-950 backdrop-blur-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-950/60 px-3 py-1 text-[11px] font-bold text-brand-300">
                  <SparklesIcon className="h-3.5 w-3.5 text-brand-400" />
                  AI Triage Active
                </span>
              </div>

              {/* India Map & Healthcare Network Hub Cutout */}
              <div className="relative flex flex-col items-center justify-center pt-4 pb-2">
                <div className="relative h-44 w-44 rounded-full border-2 border-emerald-500/30 bg-emerald-950/20 p-2 flex items-center justify-center shadow-inner">
                  <img src="/arogya_logo.png" alt="Bharat Healthcare Network" className="h-full w-full object-contain rounded-full" />
                </div>

                <div className="mt-6 text-center">
                  <h3 className="font-indic text-sm font-extrabold text-amber-400">
                    आरोग्य-वाहिनी • ಆರೋಗ್ಯ-ವಾಹಿನಿ
                  </h3>
                  <p className="font-display text-lg font-black text-white mt-0.5">
                    Bharat Rural Healthcare Network
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Connecting 500+ PHCs to District Specialty Hubs
                  </p>
                </div>
              </div>

              {/* Live Status Indicators */}
              <div className="mt-6 grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">Instant QR Handoffs</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-indigo-400" />
                  <span className="text-slate-300">ABDM Encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: KEY FEATURES */}
      <section id="features-section" className="relative z-10 py-20 border-t border-slate-800/80 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">Enterprise Capabilities</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Advanced Digital Infrastructure for Rural Healthcare
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Designed specifically for Bharat’s healthcare system to accelerate emergency transfers and maintain continuous patient records.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <SparklesIcon className="h-6 w-6 text-brand-400" />,
                title: 'AI Risk Triage',
                description: 'AI-powered analysis helps identify patient risks and supports faster medical decisions.',
                border: 'hover:border-brand-500/50'
              },
              {
                icon: <QrCodeIcon className="h-6 w-6 text-emerald-400" />,
                title: 'Instant QR Referral',
                description: 'Secure QR-based referral transfer between PHCs and specialist hospitals.',
                border: 'hover:border-emerald-500/50'
              },
              {
                icon: <ShieldCheckIcon className="h-6 w-6 text-indigo-400" />,
                title: 'ABDM Health Vault',
                description: 'Encrypted digital health records accessible anytime.',
                border: 'hover:border-indigo-500/50'
              },
              {
                icon: <HospitalIcon className="h-6 w-6 text-amber-400" />,
                title: 'Specialist Network',
                description: 'Connecting rural communities with expert healthcare professionals.',
                border: 'hover:border-amber-500/50'
              }
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={twMerge(
                  'group rounded-3xl border border-slate-800 bg-slate-900/60 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-xl',
                  card.border
                )}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="mt-6 font-display text-xl font-extrabold text-white tracking-tight">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="workflow-section" className="relative z-10 py-20 border-t border-slate-800/80 bg-[#040916]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Seamless Referral Continuum</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How Arogya-Vahini Coordinates Care
            </h2>
          </div>

          {/* Workflow Steps */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 relative">
            {[
              { step: '01', title: 'Patient', icon: <UserIcon className="h-5 w-5 text-brand-400" />, desc: 'Rural resident visits local health hub' },
              { step: '02', title: 'Primary Health Centre', icon: <StethoscopeIcon className="h-5 w-5 text-emerald-400" />, desc: 'PHC doctor evaluates & logs vitals' },
              { step: '03', title: 'AI Health Analysis', icon: <SparklesIcon className="h-5 w-5 text-amber-400" />, desc: 'AI triage generates risk summary' },
              { step: '04', title: 'Digital Referral', icon: <QrCodeIcon className="h-5 w-5 text-indigo-400" />, desc: 'Scannable QR token issued' },
              { step: '05', title: 'Specialist Doctor', icon: <HospitalIcon className="h-5 w-5 text-teal-400" />, desc: 'Specialist scans QR & reviews vault' },
              { step: '06', title: 'Treatment & Follow-up', icon: <CheckCircle2Icon className="h-5 w-5 text-emerald-400" />, desc: 'Care executed & logged to ABDM' }
            ].map((st) => (
              <div key={st.step} className="relative flex flex-col items-center text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md">
                <span className="text-[10px] font-extrabold text-brand-400 bg-brand-950/80 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                  STEP {st.step}
                </span>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
                  {st.icon}
                </div>
                <h4 className="mt-3 font-display text-sm font-extrabold text-white">{st.title}</h4>
                <p className="mt-1 text-[11px] leading-snug text-slate-400">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY AROGYA-VAHINI */}
      <section id="impact-section" className="relative z-10 py-20 border-t border-slate-800/80 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Transforming Rural Healthcare</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Building a Healthier Bharat Through Technology
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 text-center">
              <p className="font-display text-4xl font-black text-brand-400">&lt; 1 Min</p>
              <h4 className="mt-2 font-display text-base font-bold text-white">Faster Referrals</h4>
              <p className="mt-1 text-xs text-slate-400">Instant digital QR transfer eliminates paper delays</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 text-center">
              <p className="font-display text-4xl font-black text-emerald-400">100%</p>
              <h4 className="mt-2 font-display text-base font-bold text-white">Secure Medical Records</h4>
              <p className="mt-1 text-xs text-slate-400">ABDM-compliant encrypted digital health vaults</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 text-center">
              <p className="font-display text-4xl font-black text-amber-400">4 Languages</p>
              <h4 className="mt-2 font-display text-base font-bold text-white">AI Assisted Healthcare</h4>
              <p className="mt-1 text-xs text-slate-400">Multilingual handoff summaries in EN, HI, KN, MR</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 text-center">
              <p className="font-display text-4xl font-black text-indigo-400">500+ PHCs</p>
              <h4 className="mt-2 font-display text-base font-bold text-white">Rural Specialist Access</h4>
              <p className="mt-1 text-xs text-slate-400">Direct linkage to district specialty hospital hubs</p>
            </div>
          </div>

          {/* Trust Elements Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-400" /> Secure (ABDM Aligned)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2">
              <ZapIcon className="h-4 w-4 text-amber-400" /> Reliable (Realtime WebSocket Sync)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2">
              <GlobeIcon className="h-4 w-4 text-brand-400" /> Accessible (Offline & Mobile QR)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2">
              <HeartIcon className="h-4 w-4 text-rose-400" /> Patient-Centric (Zero Paper Loss)
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 5: LOGIN PORTAL */}
      <section id="login-portal" className="relative z-10 py-20 border-t border-slate-800/80 bg-[#020612]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Enterprise Authentication</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Access Your Healthcare Portal
            </h2>
            <p className="text-sm text-slate-400">
              Select your role and continue to your personalized healthcare dashboard.
            </p>
          </div>

          {/* Role Selection Cards Grid (4 Cards) */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLE_OPTIONS.map((opt) => {
              const isSelected = selectedRole === opt.role;
              return (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => handleRoleSelect(opt)}
                  className={twMerge(
                    'relative flex flex-col justify-between rounded-3xl p-5 text-left transition-all duration-200 border',
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/40 shadow-xl shadow-brand-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                  )}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700">
                        {opt.icon}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {opt.badge}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-base font-extrabold text-white">
                      {opt.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {opt.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] font-bold">
                    <span className={isSelected ? 'text-brand-400' : 'text-slate-500'}>
                      {isSelected ? 'Selected Role' : 'Select Role'}
                    </span>
                    <span className={twMerge('flex h-4 w-4 items-center justify-center rounded-full border', isSelected ? 'border-brand-400 bg-brand-500 text-white' : 'border-slate-700')}>
                      {isSelected && <CheckIcon className="h-3 w-3 stroke-[3]" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Login / Registration Card Container */}
          <div className="mt-8 mx-auto max-w-xl rounded-3xl border border-slate-800 bg-slate-950/90 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl">
            {/* Segmented Auth Tab (Sign In vs New Sign Up) */}
            <div className="flex rounded-2xl bg-slate-900 p-1.5 ring-1 ring-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthTab('signin')}
                className={twMerge(
                  'flex-1 rounded-xl py-2.5 transition-all text-center font-bold',
                  authTab === 'signin' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                )}>
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className={twMerge(
                  'flex-1 rounded-xl py-2.5 transition-all text-center font-bold',
                  authTab === 'signup' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                )}>
                New Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
              {authTab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Name & Medical Honorific *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Vijay Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@arogyavahini.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <LockKeyholeIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 px-6 py-3.5 font-display text-sm font-extrabold text-white shadow-xl shadow-brand-500/25 transition-all hover:opacity-95 active:scale-98 disabled:opacity-50">
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>
                      {authTab === 'signin'
                        ? `Sign In as ${ROLE_OPTIONS.find((r) => r.role === selectedRole)?.title}`
                        : `Register as ${ROLE_OPTIONS.find((r) => r.role === selectedRole)?.title}`}
                    </span>
                    <ArrowRightIcon className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-[#02040a] py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo tone="dark" />
          <p>© 2026 Arogya-Vahini Rural Referral Network — Digital Healthcare Infrastructure for a New Bharat 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}
