import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'dd MMM yyyy');
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'dd MMM yyyy, hh:mm a');
}

export function timeAgo(iso: string): string {
  return `${formatDistanceToNow(parseISO(iso))} ago`;
}

export function initials(name: string): string {
  return name
    .replace(/(Mr|Mrs|Ms|Dr)\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatDoctorName(name?: string): string {
  if (!name) return 'Doctor';
  const clean = name.trim();
  const titleFormatted = clean.replace(/^(dr\.?\s*)+/i, '');
  const capitalized = titleFormatted
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return `Dr. ${capitalized}`;
}

let counter = 100;

export function nextPatientId(existing: string[]): string {
  const numbers = existing
    .map((id) => Number.parseInt(id.replace(/\D/g, ''), 10))
    .filter((n) => Number.isFinite(n));
  const next = (numbers.length ? Math.max(...numbers) : 1000) + 1;
  return `AV-P${next}`;
}

export function nextReferralToken(): string {
  counter += 1;
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `AV-${new Date().getFullYear()}-${counter}${rand}`;
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}