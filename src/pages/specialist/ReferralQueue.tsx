import React, { useMemo, useState } from 'react';
import { FilterIcon, QrCodeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../../contexts/AppContext';
import { ReferralCard } from '../../components/ReferralCard';
import { Button, EmptyState, GlassCard } from '../../components/ui/Primitives';
import type { ReferralStatus } from '../../types';

const FILTERS: (ReferralStatus | 'All')[] = ['All', 'Active', 'In Treatment', 'Completed'];

export function ReferralQueue() {
  const { referrals, getPatient } = useApp();
  const [filter, setFilter] = useState<ReferralStatus | 'All'>('All');

  const list = useMemo(
    () =>
    [...referrals].
    filter((r) => filter === 'All' || r.status === filter).
    sort((a, b) => b.risk.score - a.risk.score),
    [referrals, filter]
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Referral queue</h1>
          <p className="mt-1 text-sm text-ink-muted">Incoming rural referrals, ordered by AI risk score.</p>
        </div>
        <Link to="/specialist/scan">
          <Button>
            <QrCodeIcon className="h-4 w-4" /> Scan QR
          </Button>
        </Link>
      </header>

      <GlassCard className="flex flex-wrap items-center gap-2 p-3">
        <span className="ml-1 mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <FilterIcon className="h-3.5 w-3.5" /> Status
        </span>
        {FILTERS.map((option) =>
        <button
          key={option}
          type="button"
          onClick={() => setFilter(option)}
          aria-pressed={filter === option}
          className={twMerge(
            'rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors',
            filter === option ? 'bg-brand-600 text-white' : 'bg-white/70 text-ink-soft ring-1 ring-brand-100 hover:bg-white'
          )}>
          
            {option}
          </button>
        )}
      </GlassCard>

      {list.length === 0 ?
      <EmptyState icon={<FilterIcon className="h-5 w-5" />} title="Nothing in this queue" description="Try another status filter." /> :

      <div className="grid gap-3 md:grid-cols-2">
          {list.map((referral, index) =>
        <ReferralCard
          key={referral.id}
          referral={referral}
          patient={getPatient(referral.patientId)}
          to={`/specialist/referral/${referral.token}`}
          index={index} />

        )}
        </div>
      }
    </div>);

}