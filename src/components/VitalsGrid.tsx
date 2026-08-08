import React from 'react';
import { ActivityIcon, DropletIcon, HeartPulseIcon, ScaleIcon, ThermometerIcon, WindIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { Vitals } from '../types';
import { analyzeVitals } from '../utils/ai';

const ICONS: Record<string, React.ReactNode> = {
  bp: <ActivityIcon className="h-4 w-4" />,
  hr: <HeartPulseIcon className="h-4 w-4" />,
  temp: <ThermometerIcon className="h-4 w-4" />,
  spo2: <WindIcon className="h-4 w-4" />,
  sugar: <DropletIcon className="h-4 w-4" />,
  weight: <ScaleIcon className="h-4 w-4" />
};

const STATUS: Record<string, string> = {
  normal: 'bg-white/70 ring-brand-100 text-ink',
  watch: 'bg-amber-50/80 ring-amber-200 text-amber-900',
  critical: 'bg-rose-50/80 ring-rose-200 text-rose-900'
};

export function VitalsGrid({ vitals, compact = false }: {vitals: Vitals;compact?: boolean;}) {
  const flags = analyzeVitals(vitals);
  return (
    <div className={twMerge('grid gap-3', compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3')}>
      {flags.map((flag) =>
      <div key={flag.key} className={twMerge('rounded-xl px-3.5 py-3 ring-1', STATUS[flag.status])}>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide opacity-70">
            {ICONS[flag.key]}
            {flag.label}
          </div>
          <p className="mt-1.5 font-display text-lg font-bold tracking-tight">{flag.value}</p>
          {flag.status !== 'normal' ?
        <p className="mt-0.5 text-[11px] font-semibold capitalize">
              {flag.status === 'critical' ? 'Critical' : 'Needs watch'}
            </p> :

        <p className="mt-0.5 text-[11px] font-medium text-ink-muted">Within range</p>
        }
        </div>
      )}
    </div>);

}