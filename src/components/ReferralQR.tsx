import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function tokenPayload(token: string): string {
  return `AROGYA-VAHINI://referral/${token}`;
}

export function ReferralQR({ token, size = 140 }: {token: string;size?: number;}) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
      <QRCodeSVG
        value={tokenPayload(token)}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#0b1b33"
        marginSize={0} />
      
    </div>);

}

export function TokenChip({ token, className }: {token: string;className?: string;}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token);
    } catch {

      /* clipboard unavailable in sandbox */}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={twMerge(
        'inline-flex items-center gap-2 rounded-xl bg-ink px-3 py-2 font-mono text-xs font-bold tracking-wide text-white transition-colors hover:bg-ink-soft',
        className
      )}
      aria-label={`Copy referral token ${token}`}>
      
      {token}
      {copied ? <CheckIcon className="h-3.5 w-3.5 text-emerald-400" /> : <CopyIcon className="h-3.5 w-3.5 opacity-70" />}
    </button>);

}