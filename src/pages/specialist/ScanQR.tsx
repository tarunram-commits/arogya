import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsQR from 'jsqr';
import { CameraIcon, FileUpIcon, KeyboardIcon, Loader2Icon, QrCodeIcon, ScanLineIcon, VideoOffIcon } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      toast.error('Camera access denied or unattached', { description: 'Upload a QR photo slip or use manual token entry.' });
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

  // Real-time camera frame decoder loop using jsQR
  useEffect(() => {
    let animationFrameId: number;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scanFrame = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;

        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data && !scanning) {
            const tokenMatch = code.data.match(/AV-[\w-]+/i);
            const decodedToken = tokenMatch ? tokenMatch[0].toUpperCase() : code.data.trim().toUpperCase();

            if (decodedToken) {
              setScanning(decodedToken);
              toast.success('QR Code Scanned!', { description: `Decoded Referral Token: ${decodedToken}` });
              stopCamera();

              const referral = getReferralByToken(decodedToken);
              if (referral) {
                navigate(`/specialist/referral/${referral.token}`);
              } else {
                toast.error('Referral Not Found', { description: `No active record for token ${decodedToken}` });
                setScanning(null);
              }
              return;
            }
          }
        }
      }
      if (cameraActive) {
        animationFrameId = requestAnimationFrame(scanFrame);
      }
    };

    if (cameraActive) {
      animationFrameId = requestAnimationFrame(scanFrame);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [cameraActive, getReferralByToken, navigate, scanning]);

  // Decode uploaded QR image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code && code.data) {
            const tokenMatch = code.data.match(/AV-[\w-]+/i);
            const decodedToken = tokenMatch ? tokenMatch[0].toUpperCase() : code.data.trim().toUpperCase();

            toast.success('QR Photo Decoded!', { description: `Found Token: ${decodedToken}` });
            open(decodedToken);
          } else {
            toast.error('No QR code detected in image', { description: 'Try taking a clearer photo of the referral slip.' });
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const open = (token: string) => {
    const targetToken = token || (pending.length > 0 ? pending[0].token : 'AV-2026-1042KQZ');
    const referral = getReferralByToken(targetToken);

    setScanning(targetToken);
    toast.info('Verifying token...', { description: `Checking ${targetToken}` });

    window.setTimeout(() => {
      setScanning(null);
      if (referral) {
        toast.success('Referral Verified!', { description: `Vault unlocked for token ${referral.token}` });
        navigate(`/specialist/referral/${referral.token}`);
      } else {
        toast.error('Invalid Referral Token', { description: `Check token printed on handoff report.` });
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Scan Referral QR
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Point your camera at the printed referral QR code, upload a slip photo, or enter the token manually.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold">
            <FileUpIcon className="h-4 w-4 mr-2" />
            Upload QR Photo
          </Button>

          {!cameraActive ? (
            <Button type="button" onClick={startCamera} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
              <CameraIcon className="h-4 w-4 mr-2" />
              Enable Camera Scanner
            </Button>
          ) : (
            <Button type="button" onClick={stopCamera} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold">
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
              title="Real-Time Camera Scanner"
              subtitle={cameraActive ? 'Point camera at physical referral QR code to scan' : 'Scanner ready — click frame or upload image below'}
              icon={<QrCodeIcon className="h-4 w-4 text-emerald-600" />}
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
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Viewfinder Footer Overlay */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-ink/85 px-4 py-3 text-xs text-white/90 backdrop-blur-md">
              <span className="inline-flex items-center gap-2 font-semibold">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                {scanning ? `Decoding token ${scanning}…` : cameraActive ? 'Scanning camera pixels in real time…' : 'Click inside scanner frame to trigger scan'}
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
                    className="flex items-center gap-3 rounded-2xl bg-white/80 p-3.5 text-left ring-1 ring-emerald-200/80 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:ring-emerald-400 hover:shadow-md disabled:opacity-60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-sm">
                      {initials(patient?.name ?? '?')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-ink">{patient?.name}</span>
                      <span className="block font-mono text-[11px] font-semibold text-emerald-700">{referral.token}</span>
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
            icon={<KeyboardIcon className="h-4 w-4 text-emerald-600" />}
          />
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              open(manual.trim());
            }}>
            <Field label="Referral Token" required hint="Printed at the top of the handoff report slip.">
              <input
                className={twMerge(inputClass, 'font-mono uppercase font-bold text-emerald-800 border-emerald-200 focus:ring-emerald-200')}
                value={manual}
                onChange={(e) => setManual(e.target.value.toUpperCase())}
                placeholder="AV-2026-1042KQZ"
              />
            </Field>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 font-bold py-3 text-white shadow-lg"
              disabled={Boolean(scanning)}>
              Verify & Open Vault
            </Button>
          </form>

          <div className="mt-5 rounded-2xl bg-emerald-50/80 p-4 ring-1 ring-emerald-200/80">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">How The Handoff Works</p>
            <ol className="mt-3 space-y-2.5 text-xs leading-relaxed text-ink-soft">
              {[
                'PHC doctor issues a signed referral token with QR code.',
                'Patient carries printed slip to district specialty hospital.',
                'Specialist scans QR — full ABDM health vault opens instantly.',
                'Treatment notes flow back into the patient health vault.'
              ].map((step, index) => (
                <li key={step} className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm">
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