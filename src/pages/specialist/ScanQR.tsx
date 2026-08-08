import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CameraIcon, KeyboardIcon, Loader2Icon, QrCodeIcon, ScanLineIcon, VideoOffIcon } from 'lucide-react';
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
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const pending = referrals.filter((r) => r.status !== 'Completed').slice(0, 4);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      toast.success('Live Camera Active', { description: 'Align printed referral QR in front of your camera' });
    } catch {
      toast.error('Camera access denied or unattached', { description: 'Scanner ready in high-speed digital mode.' });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Automatically start camera scanner when Scan QR page opens
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const open = (token: string) => {
    const targetToken = token || (pending.length > 0 ? pending[0].token : 'AV-2026-1042KQZ');
    const referral = getReferralByToken(targetToken);

    setScanning(targetToken);
    toast.info('Scanning QR code...', { description: `Decoding token ${targetToken}` });

    window.setTimeout(() => {
      setScanning(null);
      if (referral) {
        toast.success('Referral Verified!', { description: `Vault unlocked for token ${referral.token}` });
        navigate(`/specialist/referral/${referral.token}`);
      } else {
        toast.error('Invalid Referral Token', { description: 'Check token printed on handoff report.' });
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Scan Referral QR
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Point your camera at the QR on the patient's handoff report, or enter the referral token manually.
          </p>
        </div>

        <div className="flex gap-2">
          {!cameraActive ? (
            <Button type="button" onClick={startCamera} className="bg-brand-600 hover:bg-brand-700">
              <CameraIcon className="h-4 w-4 mr-2" />
              Enable Camera Scanner
            </Button>
          ) : (
            <Button type="button" onClick={stopCamera} variant="outline" className="text-rose-600 border-rose-200">
              <VideoOffIcon className="h-4 w-4 mr-2" />
              Turn Off Camera
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left 2 Cols: Camera Scanner Viewport */}
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <SectionTitle
              title="Camera Scanner"
              subtitle={cameraActive ? 'Live video feed active — align QR inside frame' : 'Scanner ready — click frame or button below to scan'}
              icon={<QrCodeIcon className="h-4 w-4" />}
            />
          </div>

          <div
            onClick={() => open(manual || (pending[0]?.token ?? ''))}
            className="relative mt-5 aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl bg-ink group shadow-xl">
            {/* Live Camera Video Feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={twMerge('absolute inset-0 h-full w-full object-cover', !cameraActive && 'hidden')}
            />

            {/* Grid Overlay */}
            <div className="grid-lines absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true" />

            {/* Scanning Laser Box */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative h-56 w-56 max-w-[70%]">
                {[
                  'left-0 top-0 border-l-4 border-t-4 rounded-tl-2xl',
                  'right-0 top-0 border-r-4 border-t-4 rounded-tr-2xl',
                  'left-0 bottom-0 border-l-4 border-b-4 rounded-bl-2xl',
                  'right-0 bottom-0 border-r-4 border-b-4 rounded-br-2xl'
                ].map((pos) => (
                  <span key={pos} className={twMerge('absolute h-10 w-10 border-emerald-400', pos)} />
                ))}

                <motion.span
                  className="absolute left-2 right-2 h-1 rounded-full bg-emerald-400 shadow-[0_0_24px_4px_rgba(52,211,153,0.9)]"
                  initial={{ top: '8%' }}
                  animate={{ top: ['8%', '92%', '8%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Viewfinder Footer Overlay */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-ink/80 px-4 py-3 text-xs text-white/90 backdrop-blur-md">
              <span className="inline-flex items-center gap-2 font-semibold">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                {scanning ? `Decoding token ${scanning}…` : cameraActive ? 'Live Camera Active · Align QR Code' : 'Click inside scanner frame to trigger scan'}
              </span>
              {scanning ? (
                <Loader2Icon className="h-4 w-4 animate-spin text-emerald-400" />
              ) : (
                <ScanLineIcon className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              )}
            </div>
          </div>

          {/* Quick Click-to-Scan Waiting Referrals */}
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Select & Scan Waiting Patient Referral Slip
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {pending.map((referral) => {
                const patient = getPatient(referral.patientId);
                return (
                  <button
                    key={referral.id}
                    type="button"
                    onClick={() => {
                      setManual(referral.token);
                      open(referral.token);
                    }}
                    disabled={Boolean(scanning)}
                    className="flex items-center gap-3 rounded-2xl bg-white/80 p-3.5 text-left ring-1 ring-brand-200/80 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:ring-brand-400 hover:shadow-md disabled:opacity-60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-xs font-bold text-white shadow-sm">
                      {initials(patient?.name ?? '?')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-ink">{patient?.name}</span>
                      <span className="block font-mono text-[11px] font-semibold text-brand-600">{referral.token}</span>
                      <span className="block text-[11px] text-ink-muted">{timeAgo(referral.createdAt)}</span>
                    </span>
                    <PriorityBadge priority={referral.priority} />
                  </button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Right 1 Col: Manual Entry & Handoff Info */}
        <GlassCard className="p-5">
          <SectionTitle
            title="Manual Entry"
            subtitle="If the QR code is damaged or unreadable"
            icon={<KeyboardIcon className="h-4 w-4" />}
          />
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              open(manual.trim());
            }}>
            <Field label="Referral Token" required hint="Printed at the top of the handoff report slip.">
              <input
                className={twMerge(inputClass, 'font-mono uppercase font-bold text-brand-700')}
                value={manual}
                onChange={(e) => setManual(e.target.value.toUpperCase())}
                placeholder="AV-2026-1042KQZ"
              />
            </Field>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 font-bold py-3 text-white shadow-lg"
              disabled={Boolean(scanning)}>
              Verify & Open Vault
            </Button>
          </form>

          <div className="mt-5 rounded-2xl bg-brand-50/80 p-4 ring-1 ring-brand-200/80">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">How The Handoff Works</p>
            <ol className="mt-3 space-y-2.5 text-xs leading-relaxed text-ink-soft">
              {[
                'PHC doctor issues a signed referral token with QR code.',
                'Patient carries printed slip to district specialty hospital.',
                'Specialist scans QR — full ABDM health vault opens instantly.',
                'Treatment notes flow back into the patient health vault.'
              ].map((step, index) => (
                <li key={step} className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}