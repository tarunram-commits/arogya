import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterIcon, PlusIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../../contexts/AppContext';
import { ReferralCard } from '../../components/ReferralCard';
import { Button, EmptyState, GlassCard } from '../../components/ui/Primitives';
import type { Priority } from '../../types';

const FILTERS: (Priority | 'All')[] = ['All', 'Emergency', 'Urgent', 'Routine'];

export function ReferralLog() {
  const { referrals, getPatient } = useApp();
  const [filter, setFilter] = useState<Priority | 'All'>('All');

  const list = useMemo(
    () =>
    [...referrals].
    filter((r) => filter === 'All' || r.priority === filter).
    sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [referrals, filter]
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Referral log</h1>
          <p className="mt-1 text-sm text-ink-muted">Every handoff raised from this primary health centre.</p>
        </div>
        <Link to="/phc/referral/new">
          <Button>
            <PlusIcon className="h-4 w-4" /> New referral
          </Button>
        </Link>
      </header>

      <GlassCard className="flex flex-wrap items-center gap-2 p-3">
        <span className="ml-1 mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <FilterIcon className="h-3.5 w-3.5" /> Priority
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
      <EmptyState
        icon={<FilterIcon className="h-5 w-5" />}
        title="No referrals in this filter"
        description="Try a different priority, or raise a new referral for a patient." /> :


      <div className="grid gap-3 md:grid-cols-2">
          {list.map((referral, index) =>
        <ReferralCard
          key={referral.id}
          referral={referral}
          patient={getPatient(referral.patientId)}
          to={`/phc/vault/${referral.patientId}`}
          index={index} />

        )}
        </div>
      }
    </div>);

}