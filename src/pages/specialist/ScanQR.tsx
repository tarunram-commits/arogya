import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyboardIcon, Loader2Icon, QrCodeIcon, ScanLineIcon } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../../contexts/AppContext';
import { Button, Field, GlassCard, PriorityBadge, SectionTitle, inputClass } from '../../components/ui/Primitives';
import { initials, timeAgo } from '../../utils/format';

export function ScanQR() {
  const { referrals, getPatient, getReferralByToken } = useApp();
  const navigate = useNavigate();
  const [manual, setManual] = useState('');
  const [scanning, setScanning] = useState<string | null>(null);

  const pending = referrals.filter((r) => r.status !== 'Completed').slice(0, 4);

  const open = (token: string) => {
    const referral = getReferralByToken(token);
    if (!referral) {
      toast.error('Invalid referral token', { description: 'Check the token printed on the handoff report.' });
      return;
    }
    setScanning(token);
    window.setTimeout(() => {
      setScanning(null);
      toast.success('Referral verified', { description: `Vault unlocked for token ${referral.token}` });
      navigate(`/specialist/referral/${referral.token}`);
    }, 1100);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Scan referral QR</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Point the camera at the QR on the patient's handoff report, or enter the referral token manually.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <SectionTitle title="Camera scanner" subtitle="Demo mode — simulate a scan below" icon={<QrCodeIcon className="h-4 w-4" />} />

          <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink">
            <div className="grid-lines absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-56 w-56 max-w-[70%]">
                {['left-0 top-0 border-l-4 border-t-4 rounded-tl-2xl', 'right-0 top-0 border-r-4 border-t-4 rounded-tr-2xl', 'left-0 bottom-0 border-l-4 border-b-4 rounded-bl-2xl', 'right-0 bottom-0 border-r-4 border-b-4 rounded-br-2xl'].map(
                  (pos) =>
                  <span key={pos} className={twMerge('absolute h-10 w-10 border-emerald-400', pos)} aria-hidden="true" />

                )}
                <motion.span
                  className="absolute left-2 right-2 h-0.5 rounded-full bg-emerald-400 shadow-[0_0_18px_2px_rgba(52,211,153,0.7)]"
                  initial={{ top: '8%' }}
                  animate={{ top: ['8%', '92%', '8%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true" />
                
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-ink/70 px-4 py-3 text-xs text-white/70 backdrop-blur">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                {scanning ? 'Decoding token…' : 'Scanner ready · align QR inside the frame'}
              </span>
              {scanning ? <Loader2Icon className="h-4 w-4 animate-spin text-emerald-300" /> : <ScanLineIcon className="h-4 w-4" />}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Simulate scanning a waiting referral</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {pending.map((referral) => {
                const patient = getPatient(referral.patientId);
                return (
                  <button
                    key={referral.id}
                    type="button"
                    onClick={() => open(referral.token)}
                    disabled={Boolean(scanning)}
                    className="flex items-center gap-3 rounded-2xl bg-white/70 p-3.5 text-left ring-1 ring-brand-100 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-lift disabled:opacity-60">
                    
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-xs font-bold text-white">
                      {initials(patient?.name ?? '?')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-ink">{patient?.name}</span>
                      <span className="block font-mono text-[11px] text-ink-muted">{referral.token}</span>
                      <span className="block text-[11px] text-ink-muted">{timeAgo(referral.createdAt)}</span>
                    </span>
                    <PriorityBadge priority={referral.priority} />
                  </button>);

              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Manual entry" subtitle="If the QR is damaged" icon={<KeyboardIcon className="h-4 w-4" />} />
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              open(manual.trim());
            }}>
            
            <Field label="Referral token" required hint="Printed at the top of the handoff report.">
              <input
                className={twMerge(inputClass, 'font-mono uppercase')}
                value={manual}
                onChange={(e) => setManual(e.target.value.toUpperCase())}
                placeholder="AV-2026-1042KQZ" />
              
            </Field>
            <Button type="submit" className="w-full" disabled={!manual.trim() || Boolean(scanning)}>
              Verify & open vault
            </Button>
          </form>

          <div className="mt-5 rounded-xl bg-brand-50/70 p-4 ring-1 ring-brand-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">How the handoff works</p>
            <ol className="mt-2 space-y-2 text-xs leading-relaxed text-ink-soft">
              {[
              'PHC doctor issues a signed referral token with QR.',
              'Patient carries the printed report to the district hospital.',
              'Specialist scans the QR — the full vault opens instantly.',
              'Treatment notes flow back into the same patient vault.'].
              map((step, index) =>
              <li key={step} className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                  {step}
                </li>
              )}
            </ol>
          </div>
        </GlassCard>
      </div>
    </div>);

}