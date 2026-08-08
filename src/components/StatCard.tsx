import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function StatCard({
  label,
  value,
  icon,
  delta,
  trend = 'up',
  accent = 'brand',
  index = 0
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  delta?: string;
  trend?: 'up' | 'down';
  accent?: 'brand' | 'emerald' | 'rose' | 'violet';
  index?: number;
}) {
  const accents: Record<string, { bg: string; iconBg: string; text: string; border: string }> = {
    brand: {
      bg: 'from-blue-50/60 to-white',
      iconBg: 'bg-brand-600 text-white shadow-brand-500/30',
      text: 'text-brand-600',
      border: 'border-brand-100 hover:border-brand-300'
    },
    emerald: {
      bg: 'from-emerald-50/60 to-white',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/30',
      text: 'text-emerald-600',
      border: 'border-emerald-100 hover:border-emerald-300'
    },
    rose: {
      bg: 'from-rose-50/60 to-white',
      iconBg: 'bg-rose-600 text-white shadow-rose-500/30',
      text: 'text-rose-600',
      border: 'border-rose-100 hover:border-rose-300'
    },
    violet: {
      bg: 'from-violet-50/60 to-white',
      iconBg: 'bg-violet-600 text-white shadow-violet-500/30',
      text: 'text-violet-600',
      border: 'border-violet-100 hover:border-violet-300'
    }
  };

  const style = accents[accent] || accents.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={twMerge(
        'group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-xl',
        style.bg,
        style.border
      )}>
      <div className="flex items-center justify-between">
        <span className={twMerge('flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform', style.iconBg)}>
          {icon}
        </span>
        {delta ? (
          <span
            className={twMerge(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold shadow-sm border',
              trend === 'up'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            )}>
            {trend === 'up' ? <TrendingUpIcon className="h-3.5 w-3.5 stroke-[2.5]" /> : <TrendingDownIcon className="h-3.5 w-3.5 stroke-[2.5]" />}
            {delta}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          {value}
        </p>
        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
    </motion.div>
  );
}