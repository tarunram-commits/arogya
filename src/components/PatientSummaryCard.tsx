import React from 'react';
import { Link } from 'react-router-dom';
import { DropletIcon, MapPinIcon, PhoneIcon, ShieldIcon } from 'lucide-react';
import type { Patient } from '../types';
import { initials } from '../utils/format';
import { Button } from './ui/Primitives';

export function PatientSummaryCard({
  patient,
  actions



}: {patient: Patient;actions?: React.ReactNode;}) {
  return (
    <section className="glass rounded-2xl p-5 shadow-glass" aria-label="Patient profile">
      <div className="flex flex-wrap items-start gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 font-display text-lg font-bold text-white shadow-lift">
          {initials(patient.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">{patient.name}</h2>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 font-mono text-[11px] font-bold text-brand-700 ring-1 ring-brand-200">
              {patient.id}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {patient.age} years · {patient.gender}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <PhoneIcon className="h-4 w-4 text-brand-500" /> {patient.mobile}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 text-brand-500" /> {patient.village}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <DropletIcon className="h-4 w-4 text-rose-500" /> {patient.bloodGroup}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon className="h-4 w-4 text-emerald-500" /> Vault active
            </span>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-4 rounded-xl bg-white/60 p-3.5 ring-1 ring-brand-100">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Previous medical history</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{patient.history || 'No history recorded.'}</p>
      </div>
      <p className="mt-3 text-xs text-ink-muted">{patient.address}</p>
    </section>);

}

export function VaultLinkButton({ patientId }: {patientId: string;}) {
  return (
    <Link to={`/phc/vault/${patientId}`}>
      <Button variant="outline" size="sm">
        Open Health Vault
      </Button>
    </Link>);

}