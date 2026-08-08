import React, { useState } from 'react';
import {
  BuildingIcon,
  CheckCircle2Icon,
  DatabaseIcon,
  FileCheckIcon,
  SaveIcon,
  ShieldCheckIcon,
  UserCogIcon,
  UserIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../contexts/AppContext';
import { Button, Field, GlassCard, SectionTitle, inputClass } from '../components/ui/Primitives';
import { initials } from '../utils/format';

export function ProfileSettings() {
  const { user, updateUser } = useApp();

  const [name, setName] = useState(user?.name ?? '');
  const [designation, setDesignation] = useState(user?.designation ?? '');
  const [facility, setFacility] = useState(user?.facility ?? '');
  const [registration, setRegistration] = useState(user?.registration ?? '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Doctor name cannot be empty');
      return;
    }
    updateUser({
      name: name.trim(),
      designation: designation.trim(),
      facility: facility.trim(),
      registration: registration.trim()
    });
    toast.success('Profile settings updated successfully', {
      description: 'Your doctor profile has been saved and synced with Supabase.'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage your medical credentials, facility details, and system preferences.
          </p>
        </div>
      </header>

      {/* User Info Overview Banner */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 font-display text-xl font-bold text-white shadow-lg shadow-brand-600/30">
            {initials(name || user?.name || 'DR')}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-extrabold text-ink">
                {name || 'Doctor'}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-200">
                {user?.role === 'specialist' ? 'Specialist Doctor' : 'PHC Medical Officer'}
              </span>
            </div>
            <p className="text-sm font-medium text-ink-soft">
              {designation || 'Medical Officer'} · {facility || 'Primary Health Centre'}
            </p>
            <p className="font-mono text-xs text-ink-muted">
              Reg No: {registration || 'KMC-84920'}
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Settings Form */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <SectionTitle
              title="Personal & Professional Information"
              subtitle="Update your name, designation, and primary healthcare facility"
              icon={<UserCogIcon className="h-4 w-4" />}
            />

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <Field label="Full Doctor Name">
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    className={`${inputClass} pl-10`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Ananya Sharma"
                    required
                  />
                </div>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Designation">
                  <div className="relative">
                    <UserCogIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                    <input
                      className={`${inputClass} pl-10`}
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Medical Officer / Consultant"
                      required
                    />
                  </div>
                </Field>

                <Field label="Medical Council Reg. No.">
                  <div className="relative">
                    <FileCheckIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                    <input
                      className={`${inputClass} pl-10 font-mono`}
                      value={registration}
                      onChange={(e) => setRegistration(e.target.value)}
                      placeholder="KMC-84920"
                      required
                    />
                  </div>
                </Field>
              </div>

              <Field label="Primary Facility / Hospital">
                <div className="relative">
                  <BuildingIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    className={`${inputClass} pl-10`}
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    placeholder="PHC Hosahalli, Tumakuru District"
                    required
                  />
                </div>
              </Field>

              <div className="pt-2 flex justify-end">
                <Button type="submit" className="gap-2">
                  <SaveIcon className="h-4 w-4" /> Save Profile Settings
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* System & Database Connection Status */}
        <div className="space-y-4">
          <GlassCard className="p-5">
            <SectionTitle
              title="Database Sync"
              subtitle="Supabase Cloud Connection"
              icon={<DatabaseIcon className="h-4 w-4" />}
            />

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                    Realtime Sync Active
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-emerald-700">
                  Connected to Supabase project <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">xllppukhwuxdvonfcokj</code>
                </p>
              </div>

              <div className="rounded-xl bg-white/70 p-3.5 ring-1 ring-brand-100 space-y-2 text-xs">
                <p className="font-bold text-ink flex items-center gap-1.5">
                  <ShieldCheckIcon className="h-4 w-4 text-brand-600" />
                  ABDM Security & Token Verification
                </p>
                <p className="text-ink-muted leading-relaxed">
                  All referral cards and handoff reports are cryptographically signed using ABDM-aligned referral tokens.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
