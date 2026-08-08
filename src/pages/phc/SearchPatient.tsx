import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, PhoneIcon, SearchIcon, UserPlusIcon, UserSearchIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../../contexts/AppContext';
import { Button, EmptyState, GlassCard, inputClass } from '../../components/ui/Primitives';
import { initials } from '../../utils/format';

export function SearchPatient() {
  const { patients, searchPatients, referralsForPatient } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => searchPatients(query), [query, searchPatients]);
  const recent = useMemo(() => patients.slice(0, 4), [patients]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Search patient</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Look up an existing health vault by Patient ID, mobile number, name or village.
        </p>
      </header>

      <GlassCard className="p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex flex-wrap gap-3">
          
          <div className="relative min-w-[240px] flex-1">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              className={twMerge(inputClass, 'pl-10 py-3')}
              placeholder="e.g. AV-P1001 or 9845012233"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSubmitted(true);
              }}
              aria-label="Search patients" />
            
          </div>
          <Button type="submit" size="lg">
            <UserSearchIcon className="h-4 w-4" /> Search vault
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/phc/register')}>
            <UserPlusIcon className="h-4 w-4" /> New patient
          </Button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {['AV-P1001', '9731122045', 'Beeranahalli'].map((sample) =>
          <button
            key={sample}
            type="button"
            onClick={() => {
              setQuery(sample);
              setSubmitted(true);
            }}
            className="rounded-lg bg-brand-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100">
            
              try {sample}
            </button>
          )}
        </div>
      </GlassCard>

      {submitted && query.trim() && results.length === 0 ?
      <EmptyState
        icon={<UserSearchIcon className="h-5 w-5" />}
        title="No patient found"
        description={`No vault matches “${query}”. Register this patient to create a new health vault and referral.`}
        action={
        <Link to="/phc/register">
              <Button variant="emerald">
                <UserPlusIcon className="h-4 w-4" /> Register new patient
              </Button>
            </Link>
        } /> :

      null}

      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold text-ink">
          {query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Recently seen patients'}
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(query.trim() ? results : recent).map((patient, index) => {
            const count = referralsForPatient(patient.id).length;
            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}>
                
                <Link
                  to={`/phc/vault/${patient.id}`}
                  className="glass group flex items-center gap-4 rounded-2xl p-4 shadow-glass transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 font-display text-sm font-bold text-white">
                    {initials(patient.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-sm font-bold text-ink">{patient.name}</p>
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 font-mono text-[10px] font-bold text-brand-700">
                        {patient.id}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {patient.age}y · {patient.gender} · {patient.village} · {patient.bloodGroup}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                      <PhoneIcon className="h-3.5 w-3.5 text-brand-500" /> {patient.mobile}
                      <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {count} referral{count === 1 ? '' : 's'}
                      </span>
                    </p>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-brand-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>);

          })}
        </div>
      </section>
    </div>);

}