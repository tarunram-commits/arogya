import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, BuildingIcon, ClockIcon } from 'lucide-react';
import type { Patient, Referral } from '../types';
import { PriorityBadge, RiskBadge, StatusBadge } from './ui/Primitives';
import { initials, timeAgo } from '../utils/format';

export function ReferralCard({
  referral,
  patient,
  to,
  index = 0





}: {referral: Referral;patient: Patient | undefined;to: string;index?: number;}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
      
      <Link
        to={to}
        className="glass group block rounded-2xl p-4 shadow-glass transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
        
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 font-display text-sm font-bold text-white">
            {initials(patient?.name ?? '?')}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-sm font-bold text-ink">{patient?.name ?? 'Unknown patient'}</p>
              <span className="text-[11px] font-semibold text-ink-muted">
                {patient?.age}y · {patient?.gender} · {patient?.id}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-ink-soft">{referral.diagnosis}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <BuildingIcon className="h-3.5 w-3.5" /> {referral.department}
              </span>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" /> {timeAgo(referral.createdAt)}
              </span>
              <span className="font-mono font-bold text-ink-soft">{referral.token}</span>
            </div>
          </div>
          <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-brand-400 transition-transform group-hover:translate-x-0.5" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-brand-100/70 pt-3">
          <PriorityBadge priority={referral.priority} />
          <RiskBadge level={referral.risk.level} score={referral.risk.score} />
          <StatusBadge status={referral.status} />
        </div>
      </Link>
    </motion.div>);

}