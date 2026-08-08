import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Logo({
  className,
  tone = 'light',
  size = 'md'
}: {
  className?: string;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}) {
  const isLarge = size === 'lg';

  return (
    <span className={twMerge('flex items-center gap-3.5', className)}>
      <span
        className={twMerge(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-md ring-2',
          tone === 'dark' ? 'ring-brand-400/40' : 'ring-brand-500/20',
          isLarge ? 'h-14 w-14 sm:h-16 sm:w-16' : 'h-11 w-11'
        )}>
        <img src="/arogya_logo.png" alt="Arogya-Vahini Emblem" className="h-full w-full object-contain rounded-xl" />
      </span>
      <span className="leading-tight">
        <span
          className={twMerge(
            'block font-indic font-extrabold tracking-tight',
            isLarge ? 'text-xs sm:text-sm' : 'text-[11px]',
            tone === 'dark' ? 'text-amber-300' : 'text-[#b91c1c]'
          )}>
          आरोग्य-वाहिनी • ಆರೋಗ್ಯ-ವಾಹಿನಿ
        </span>
        <span
          className={twMerge(
            'block font-display font-extrabold tracking-tight',
            isLarge ? 'text-2xl sm:text-3xl text-emerald-400 font-black' : 'text-lg sm:text-xl',
            tone === 'dark' ? (isLarge ? 'text-emerald-400' : 'text-white') : 'text-brand-900'
          )}>
          Arogya-Vahini
        </span>
        <span
          className={twMerge(
            'block font-bold uppercase tracking-[0.14em]',
            isLarge ? 'text-xs text-brand-300' : 'text-[10px] text-brand-600',
            tone === 'dark' ? 'text-brand-200' : 'text-brand-600'
          )}>
          Rural Referral Network
        </span>
      </span>
    </span>
  );
}