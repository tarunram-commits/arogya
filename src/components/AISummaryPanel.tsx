import React from 'react';
import { motion } from 'framer-motion';
import { LanguagesIcon, SparklesIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { Language, RiskAssessment } from '../types';
import { LANGUAGES } from '../utils/ai';
import { RiskBadge } from './ui/Primitives';

export function LanguageSelector({
  value,
  onChange,
  className




}: {value: Language;onChange: (lang: Language) => void;className?: string;}) {
  return (
    <div className={twMerge('flex flex-wrap items-center gap-1.5', className)} role="group" aria-label="Summary language">
      <span className="mr-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        <LanguagesIcon className="h-3.5 w-3.5" /> Language
      </span>
      {LANGUAGES.map((lang) =>
      <button
        key={lang.code}
        type="button"
        onClick={() => onChange(lang.code)}
        aria-pressed={value === lang.code}
        className={twMerge(
          'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
          value === lang.code ?
          'bg-brand-600 text-white shadow-sm' :
          'bg-white/70 text-ink-soft ring-1 ring-brand-100 hover:bg-white'
        )}>
        
          {lang.native}
        </button>
      )}
    </div>);

}

export function AISummaryPanel({
  summary,
  language,
  onLanguageChange,
  risk,
  className






}: {summary: Record<Language, string>;language: Language;onLanguageChange?: (lang: Language) => void;risk: RiskAssessment;className?: string;}) {
  return (
    <section className={twMerge('glass overflow-hidden rounded-2xl shadow-glass', className)} aria-label="AI medical summary">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100/70 bg-brand-600/[0.06] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <SparklesIcon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-ink">AI Medical Summary</h3>
            <p className="text-xs text-ink-muted">Generated from vitals, symptoms, diagnosis & history</p>
          </div>
        </div>
        <RiskBadge level={risk.level} score={risk.score} />
      </header>

      <div className="px-5 py-4">
        {onLanguageChange ? <LanguageSelector value={language} onChange={onLanguageChange} className="mb-3" /> : null}
        <motion.p
          key={language}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={twMerge(
            'text-sm leading-relaxed text-ink-soft',
            language === 'en' ? '' : 'font-indic'
          )}>
          
          {summary[language]}
        </motion.p>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50/80 px-3.5 py-2.5 text-[11px] font-medium leading-relaxed text-amber-800 ring-1 ring-amber-200">
          <span aria-hidden="true">⚠</span>
          AI-generated recommendation for clinical support only. It does not replace the treating doctor's judgement.
        </div>
      </div>
    </section>);

}