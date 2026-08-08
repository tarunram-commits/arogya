import React from 'react';
import { motion } from 'framer-motion';
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
      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className={twMerge(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-lg ring-2 transition-all hover:scale-105',
          tone === 'dark' ? 'ring-emerald-400/50 shadow-emerald-500/20' : 'ring-emerald-500/30 shadow-emerald-500/10',
          isLarge ? 'h-14 w-14 sm:h-16 sm:w-16' : 'h-11 w-11'
        )}>
        <img src="/arogya_logo.png" alt="Arogya-Vahini Emblem" className="h-full w-full object-contain rounded-xl drop-shadow-sm" />
      </motion.span>
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
            tone === 'dark' ? (isLarge ? 'text-emerald-400' : 'text-white') : 'text-emerald-950'
          )}>
          Arogya-Vahini
        </span>
        <span
          className={twMerge(
            'block font-bold uppercase tracking-[0.14em]',
            isLarge ? 'text-xs text-emerald-300' : 'text-[10px] text-emerald-600',
            tone === 'dark' ? 'text-emerald-200' : 'text-emerald-700'
          )}>
          Rural Referral Network
        </span>
      </span>
    </span>
  );
}