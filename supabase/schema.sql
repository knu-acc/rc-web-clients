-- =============================================================================
-- Personal CRM: projects table, RLS, Storage bucket for contracts
-- Run this in Supabase SQL Editor after creating your project
-- =============================================================================

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  client_name TEXT NOT NULL,
  phone TEXT,
  telegram TEXT,
  website_url TEXT,
  price NUMERIC(12,2) DEFAULT 0,
  contract_url TEXT,
  work_status TEXT NOT NULL DEFAULT 'planned'
    CHECK (work_status IN ('planned','in_progress','review','done')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid','prepaid','paid')),
  site_created_at DATE,
  paid_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security: only the owner can access their rows
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Optional: index for faster listing by user
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);

-- =============================================================================
-- Storage: bucket "contracts" + policies (per-user files)
-- Path convention: contracts/{user_id}/{project_id}/{filename}
--
-- IMPORTANT: Create the bucket in Supabase Dashboard first, then run the
-- policies below. Dashboard → Storage → New bucket:
--   Name: contracts
--   Public: OFF (private)
--   File size limit: 10 MB
--   Allowed MIME types: application/pdf, image/jpeg, image/png, image/webp, image/gif
-- =============================================================================

-- Policy: users can upload only to their own folder
CREATE POLICY "Users can upload own contracts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: users can read only their own files
CREATE POLICY "Users can view own contracts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: users can update their own files (e.g. replace)
CREATE POLICY "Users can update own contracts"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: users can delete their own files
CREATE POLICY "Users can delete own contracts"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
