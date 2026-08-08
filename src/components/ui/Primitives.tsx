import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { Priority, ReferralStatus, RiskLevel } from '../../types';

export function GlassCard({
  className,
  children,
  as: Tag = 'div'




}: {className?: string;children: React.ReactNode;as?: keyof JSX.IntrinsicElements;}) {
  return React.createElement(
    Tag,
    { className: twMerge('glass rounded-2xl shadow-glass', className) },
    children
  );
}

export function SectionTitle({
  title,
  subtitle,
  icon,
  action





}: {title: string;subtitle?: string;icon?: React.ReactNode;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {icon ?
        <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
            {icon}
          </span> :
        null}
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>);

}

const RISK_STYLES: Record<RiskLevel, string> = {
  Low: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  High: 'bg-rose-50 text-rose-700 ring-rose-200'
};

export function RiskBadge({ level, score, className }: {level: RiskLevel;score?: number;className?: string;}) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
        RISK_STYLES[level],
        className
      )}>
      
      <span
        className={twMerge(
          'h-1.5 w-1.5 rounded-full',
          level === 'Low' ? 'bg-emerald-500' : level === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
        )} />
      
      {level} Risk{typeof score === 'number' ? ` · ${score}` : ''}
    </span>);

}

const PRIORITY_STYLES: Record<Priority, string> = {
  Routine: 'bg-brand-50 text-brand-700 ring-brand-200',
  Urgent: 'bg-amber-50 text-amber-700 ring-amber-200',
  Emergency: 'bg-rose-600 text-white ring-rose-500'
};

export function PriorityBadge({ priority }: {priority: Priority;}) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1',
        PRIORITY_STYLES[priority]
      )}>
      
      {priority}
    </span>);

}

const STATUS_STYLES: Record<ReferralStatus, string> = {
  Active: 'bg-brand-50 text-brand-700 ring-brand-200',
  'In Treatment': 'bg-violet-50 text-violet-700 ring-violet-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

export function StatusBadge({ status }: {status: ReferralStatus;}) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
        STATUS_STYLES[status]
      )}>
      
      {status}
    </span>);

}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest



}: React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'primary' | 'emerald' | 'ghost' | 'outline' | 'danger';size?: 'sm' | 'md' | 'lg';}) {
  const variants: Record<string, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lift disabled:bg-brand-300',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lift disabled:bg-emerald-300',
    outline: 'bg-white/70 text-ink ring-1 ring-brand-200 hover:bg-white',
    ghost: 'text-ink-soft hover:bg-brand-500/10 hover:text-brand-700',
    danger: 'bg-rose-600 text-white hover:bg-rose-700'
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm'
  };
  return (
    <button
      type={type}
      className={twMerge(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}>
      
      {children}
    </button>);

}

export function Field({
  label,
  hint,
  required,
  error,
  children,
  className







}: {label: string;hint?: string;required?: boolean;error?: string;children: React.ReactNode;className?: string;}) {
  return (
    <label className={twMerge('block', className)}>
      <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
        {required ? <span className="text-rose-500">*</span> : null}
      </span>
      {children}
      {error ?
      <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> :
      hint ?
      <span className="mt-1 block text-xs text-ink-muted">{hint}</span> :
      null}
    </label>);

}

export const inputClass =
'w-full rounded-xl border border-brand-100 bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 shadow-sm transition-colors focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200';

export function DataRow({ label, value }: {label: string;value: React.ReactNode;}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-brand-100/70 py-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
      <span className="max-w-[62%] text-right text-sm font-medium text-ink">{value}</span>
    </div>);

}

export function EmptyState({
  icon,
  title,
  description,
  action





}: {icon: React.ReactNode;title: string;description: string;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand-200 bg-white/50 px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
        {icon}
      </span>
      <div>
        <p className="font-display text-base font-bold text-ink">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      </div>
      {action}
    </div>);

}