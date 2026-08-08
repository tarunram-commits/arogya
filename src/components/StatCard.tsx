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








}: {label: string;value: string | number;icon: React.ReactNode;delta?: string;trend?: 'up' | 'down';accent?: 'brand' | 'emerald' | 'rose' | 'violet';index?: number;}) {
  const accents: Record<string, string> = {
    brand: 'bg-brand-500/10 text-brand-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    rose: 'bg-rose-500/10 text-rose-600',
    violet: 'bg-violet-500/10 text-violet-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-5 shadow-glass">
      
      <div className="flex items-start justify-between">
        <span className={twMerge('flex h-10 w-10 items-center justify-center rounded-xl', accents[accent])}>
          {icon}
        </span>
        {delta ?
        <span
          className={twMerge(
            'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold',
            trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          )}>
          
            {trend === 'up' ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
            {delta}
          </span> :
        null}
      </div>
      <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink-muted">{label}</p>
    </motion.div>);

}