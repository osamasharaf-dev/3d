-- =============================================
-- Safe Migration — adds ONLY missing columns
-- Run once in: Supabase Dashboard → SQL Editor
-- SAFE: uses IF NOT EXISTS / does NOT drop or truncate anything
-- =============================================

-- hero_info: add photo_url
ALTER TABLE public.hero_info
  ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT '';

-- skills: add order_index
ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- projects: add missing columns
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS order_index     INTEGER  DEFAULT 0;
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS source_code_link TEXT;
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS live_demo_link  TEXT;
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS features        JSONB    DEFAULT '[]';
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS images          JSONB    DEFAULT '[]';

-- =============================================
-- Storage bucket policies (safe — ON CONFLICT DO NOTHING)
-- =============================================

-- Ensure assets bucket is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read policy for assets bucket (safe, skips if exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'Public read assets'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Public read assets"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'assets')
    $policy$;
  END IF;
END $$;

-- Authenticated upload to assets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'Auth upload assets'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Auth upload assets"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'assets')
    $policy$;
  END IF;
END $$;

-- Authenticated update assets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'Auth update assets'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Auth update assets"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'assets')
    $policy$;
  END IF;
END $$;

-- Authenticated delete assets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'Auth delete assets'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Auth delete assets"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'assets')
    $policy$;
  END IF;
END $$;
