import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ActivityIcon,
  BellIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  QrCodeIcon,
  SearchIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  UserCogIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon } from
'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../contexts/AppContext';
import { Logo } from './Brand';
import { formatDoctorName, initials } from '../utils/format';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

const PHC_NAV: NavItem[] = [
  { to: '/phc', label: 'Dashboard', icon: <LayoutDashboardIcon className="h-4 w-4" />, end: true },
  { to: '/phc/search', label: 'Search Patient', icon: <SearchIcon className="h-4 w-4" /> },
  { to: '/phc/register', label: 'Register Patient', icon: <UserPlusIcon className="h-4 w-4" /> },
  { to: '/phc/referral/new', label: 'New Referral', icon: <ActivityIcon className="h-4 w-4" /> },
  { to: '/phc/referrals', label: 'Referral Log', icon: <UsersIcon className="h-4 w-4" /> },
  { to: '/phc/settings', label: 'Profile Settings', icon: <UserCogIcon className="h-4 w-4" /> }
];

const SPECIALIST_NAV: NavItem[] = [
  { to: '/specialist', label: 'Dashboard', icon: <LayoutDashboardIcon className="h-4 w-4" />, end: true },
  { to: '/specialist/scan', label: 'Scan QR Code', icon: <QrCodeIcon className="h-4 w-4" /> },
  { to: '/specialist/queue', label: 'Referral Queue', icon: <StethoscopeIcon className="h-4 w-4" /> },
  { to: '/specialist/settings', label: 'Profile Settings', icon: <UserCogIcon className="h-4 w-4" /> }
];


export function AppShell({ children }: {children: React.ReactNode;}) {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const nav = user?.role === 'specialist' ? SPECIALIST_NAV : PHC_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-canvas flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={twMerge(
          'fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col border-r border-white/10 bg-ink/95 p-5 text-white transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}>
        
        <div className="grid-lines absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="flex items-center justify-between">
          <Link to={user?.role === 'specialist' ? '/specialist' : '/phc'} className="rounded-xl">
            <Logo tone="dark" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Close navigation">
            
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-200">
            {user?.role === 'specialist' ? 'Specialist Console' : 'PHC Console'}
          </p>
          <p className="mt-1 font-display text-sm font-bold">{user?.facility}</p>
        </div>

        <nav className="mt-6 flex-1 space-y-1" aria-label="Main navigation">
          {nav.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
            twMerge(
              'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
              isActive ? 'bg-white/12 text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'
            )
            }>
            
              {({ isActive }) =>
            <>
                  {isActive ?
              <motion.span
                layoutId="nav-active"
                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }} /> :

              null}
                  {item.icon}
                  {item.label}
                </>
            }
            </NavLink>
          )}
        </nav>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
            ABDM-aligned health vault
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
            Records are encrypted and shared only via signed referral tokens.
          </p>
        </div>
      </aside>

      {open ?
      <button
        type="button"
        aria-label="Close navigation overlay"
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden" /> :

      null}

      {/* Main */}
      <div className="flex min-h-screen w-full flex-col lg:pl-[268px]">
        <header className="glass sticky top-0 z-20 flex items-center gap-3 border-b border-white/60 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl p-2 text-ink-soft hover:bg-brand-500/10 lg:hidden"
            aria-label="Open navigation">
            
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex flex-col items-center justify-center text-center rounded-2xl bg-white/95 border border-red-200/90 px-6 py-2 shadow-sm backdrop-blur-md">
              <h2 className="font-indic text-xs sm:text-sm font-extrabold text-[#c2410c] tracking-tight leading-tight">
                आरोग्य-वाहिनी • ಆರೋಗ್ಯ-ವಾಹಿನಿ (ಗ್ರಾಮೀಣ ರಫರಲ್)
              </h2>
              <h1 className="font-display text-xs sm:text-sm font-extrabold text-[#991b1b] tracking-tight leading-tight mt-0.5">
                Arogya-Vahini · Rural Referral Network
              </h1>
            </div>
          </div>

          <p className="truncate font-display text-sm font-bold text-ink sm:hidden">Arogya-Vahini</p>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative rounded-xl p-2 text-ink-soft transition-colors hover:bg-brand-500/10"
              aria-label="Notifications">
              
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <Link
              to={user?.role === 'specialist' ? '/specialist/settings' : '/phc/settings'}
              className="flex items-center gap-2.5 rounded-xl bg-white/70 px-2.5 py-1.5 ring-1 ring-brand-100 transition-colors hover:bg-brand-50 hover:ring-brand-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white shadow-sm">
                {initials(user?.name ?? 'AV')}
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-xs font-bold text-ink">{formatDoctorName(user?.name)}</span>
                <span className="block text-[11px] text-ink-muted">{user?.designation}</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl p-2 text-ink-soft transition-colors hover:bg-rose-50 hover:text-rose-600"
              aria-label="Log out">
              
              <LogOutIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
          
          {children}
        </motion.main>
      </div>
    </div>);

}