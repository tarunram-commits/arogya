-- =============================================================================
-- SUPABASE SCHEMA & REALTIME SETUP FOR HEALTHCARE HANDOFF PLATFORM
-- Copy and run this script in your Supabase SQL Editor:
-- https://xllppukhwuxdvonfcokj.supabase.co -> SQL Editor -> New Query -> Run
-- =============================================================================

-- 1. Create 'patients' table
CREATE TABLE IF NOT EXISTS public.patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT NOT NULL,
  mobile TEXT NOT NULL,
  village TEXT NOT NULL,
  address TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  history TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'referrals' table
CREATE TABLE IF NOT EXISTS public.referrals (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  vitals JSONB NOT NULL,
  symptoms TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  priority TEXT NOT NULL,
  hospital TEXT NOT NULL,
  department TEXT NOT NULL,
  reason TEXT NOT NULL,
  risk JSONB NOT NULL,
  summary JSONB NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL,
  from_facility TEXT NOT NULL,
  notes JSONB DEFAULT '[]'::jsonb,
  pdf_language TEXT NOT NULL
);

-- 3. Create 'reports' table (Health Vault)
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  kind TEXT NOT NULL,
  facility TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create 'doctor_users' table
CREATE TABLE IF NOT EXISTS public.doctor_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  designation TEXT NOT NULL,
  facility TEXT NOT NULL,
  registration TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ENABLE REALTIME ON TABLES
-- =============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctor_users;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS and grant read/write access to public/anon users for smooth app sync
-- =============================================================================
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read/Write Patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Referrals" ON public.referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Reports" ON public.reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Doctor Users" ON public.doctor_users FOR ALL USING (true) WITH CHECK (true);
