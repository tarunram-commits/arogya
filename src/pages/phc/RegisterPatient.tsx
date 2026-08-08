import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2Icon, IdCardIcon, UserPlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { useApp } from '../../contexts/AppContext';
import { Button, Field, GlassCard, SectionTitle, inputClass } from '../../components/ui/Primitives';
import { BLOOD_GROUPS, GENDERS, VILLAGES } from '../../data/reference';
import { nextPatientId } from '../../utils/format';
import type { BloodGroup, Gender } from '../../types';

interface FormState {
  name: string;
  age: string;
  gender: Gender;
  mobile: string;
  village: string;
  address: string;
  bloodGroup: BloodGroup;
  history: string;
}

const EMPTY: FormState = {
  name: '',
  age: '',
  gender: 'Male',
  mobile: '',
  village: VILLAGES[0],
  address: '',
  bloodGroup: 'O+',
  history: ''
};

export function RegisterPatient() {
  const { patients, addPatient } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const previewId = useMemo(() => nextPatientId(patients.map((p) => p.id)), [patients]);

  const set = <K extends keyof FormState,>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'Patient name is required';
    const age = Number(form.age);
    if (!form.age || !Number.isFinite(age) || age <= 0 || age > 120) next.age = 'Enter a valid age (1–120)';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) next.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.address.trim()) next.address = 'Address is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      toast.error('Please correct the highlighted fields');
      return;
    }
    const created = addPatient({
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      mobile: form.mobile,
      village: form.village,
      address: form.address.trim(),
      bloodGroup: form.bloodGroup,
      history: form.history.trim()
    });
    toast.success(`${created.name} registered · ${created.id}`, {
      description: 'Health vault created. Continue to the referral form.'
    });
    navigate(`/phc/referral/new?patientId=${created.id}`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Register patient</h1>
        <p className="mt-1 text-sm text-ink-muted">
          A permanent Patient ID and health vault are created instantly — no paperwork, no duplicates.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="space-y-5 p-5 lg:col-span-2">
          <SectionTitle title="Patient details" icon={<UserPlusIcon className="h-4 w-4" />} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required error={errors.name} className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Ramesh Gowda" />
              
            </Field>

            <Field label="Age" required error={errors.age}>
              <input
                className={inputClass}
                value={form.age}
                inputMode="numeric"
                onChange={(e) => set('age', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="Years" />
              
            </Field>

            <Field label="Gender" required>
              <select className={inputClass} value={form.gender} onChange={(e) => set('gender', e.target.value as Gender)}>
                {GENDERS.map((g) =>
                <option key={g} value={g}>
                    {g}
                  </option>
                )}
              </select>
            </Field>

            <Field label="Mobile number" required error={errors.mobile}>
              <input
                className={inputClass}
                value={form.mobile}
                inputMode="numeric"
                onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number" />
              
            </Field>

            <Field label="Blood group" required>
              <select
                className={inputClass}
                value={form.bloodGroup}
                onChange={(e) => set('bloodGroup', e.target.value as BloodGroup)}>
                
                {BLOOD_GROUPS.map((bg) =>
                <option key={bg} value={bg}>
                    {bg}
                  </option>
                )}
              </select>
            </Field>

            <Field label="Village" required>
              <select className={inputClass} value={form.village} onChange={(e) => set('village', e.target.value)}>
                {VILLAGES.map((v) =>
                <option key={v} value={v}>
                    {v}
                  </option>
                )}
              </select>
            </Field>

            <Field label="Address" required error={errors.address}>
              <input
                className={inputClass}
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="House, street, taluk" />
              
            </Field>

            <Field
              label="Previous medical history"
              hint="Chronic conditions, surgeries, allergies, current medication."
              className="sm:col-span-2">
              
              <textarea
                className={twMerge(inputClass, 'min-h-[104px] resize-y')}
                value={form.history}
                onChange={(e) => set('history', e.target.value)}
                placeholder="e.g. Type 2 diabetes since 2013, on Metformin 500mg twice daily…" />
              
            </Field>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-5">
            <SectionTitle title="Auto-generated ID" icon={<IdCardIcon className="h-4 w-4" />} />
            <div className="mt-4 rounded-2xl bg-ink p-4 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-200">Patient ID</p>
              <p className="mt-1 font-mono text-xl font-bold tracking-wide">{previewId}</p>
              <p className="mt-3 text-[11px] leading-relaxed text-white/50">
                Issued on save and printed on every referral, PDF and QR code for this patient.
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-xs text-ink-soft">
              {['Health vault created automatically', 'Reusable across every PHC & hospital', 'Linkable to ABHA number later'].map(
                (item) =>
                <li key={item} className="flex items-start gap-2">
                    <CheckCircle2Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {item}
                  </li>

              )}
            </ul>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-sm text-ink-muted">
              After saving, you'll go straight to the digital referral form for this patient.
            </p>
            <Button type="submit" size="lg" variant="emerald" className="mt-4 w-full">
              Save & continue to referral
            </Button>
            <Button type="button" variant="ghost" className="mt-2 w-full" onClick={() => setForm(EMPTY)}>
              Clear form
            </Button>
          </GlassCard>
        </div>
      </form>
    </div>);

}