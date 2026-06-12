-- =============================================
-- Portfolio CMS — Complete Supabase Schema
-- Run this in your Supabase SQL Editor (fresh setup)
-- For existing databases, use supabase-migration.sql instead
-- =============================================

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text        NOT NULL,
  description       text,
  image             text,
  images            jsonb       DEFAULT '[]',
  tech_stack        jsonb       DEFAULT '[]',
  source_code_link  text,
  live_demo_link    text,
  features          jsonb       DEFAULT '[]',
  order_index       integer     DEFAULT 0,
  created_at        timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  icon        text,
  category    text        DEFAULT 'Frontend',
  order_index integer     DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Hero Info (single-row config)
CREATE TABLE IF NOT EXISTS public.hero_info (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text,
  greeting       text,
  typed_items    jsonb       DEFAULT '[]',
  subtitle       text,
  cta_primary    text,
  cta_secondary  text,
  photo_url      text        DEFAULT '',
  updated_at     timestamptz DEFAULT now()
);

-- About Info (single-row config)
CREATE TABLE IF NOT EXISTS public.about_info (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  bio_paragraphs  jsonb       DEFAULT '[]',
  services        jsonb       DEFAULT '[]',
  hire_email      text,
  resume_url      text        DEFAULT '',
  updated_at      timestamptz DEFAULT now()
);

-- Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  company_name  text,
  date_range    text,
  icon_url      text,
  icon_bg       text        DEFAULT '#383E56',
  points        jsonb       DEFAULT '[]',
  credentials   jsonb       DEFAULT '[]',
  order_index   integer     DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- Professional / Soft Skills
CREATE TABLE IF NOT EXISTS public.professional_skills (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category    text,
  icon        text,
  color       text        DEFAULT '#0ea5e9',
  skills      jsonb       DEFAULT '[]',
  order_index integer     DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Contact Info (single-row config)
CREATE TABLE IF NOT EXISTS public.contact_info (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text,
  phone      text,
  linkedin   text,
  github     text,
  facebook   text,
  instagram  text,
  whatsapp   text,
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- Row Level Security
-- =============================================

ALTER TABLE public.hero_info          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_info         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info       ENABLE ROW LEVEL SECURITY;

-- Public can READ everything
CREATE POLICY "Public read hero_info"           ON public.hero_info           FOR SELECT USING (true);
CREATE POLICY "Public read about_info"          ON public.about_info          FOR SELECT USING (true);
CREATE POLICY "Public read certifications"      ON public.certifications      FOR SELECT USING (true);
CREATE POLICY "Public read professional_skills" ON public.professional_skills FOR SELECT USING (true);
CREATE POLICY "Public read skills"              ON public.skills              FOR SELECT USING (true);
CREATE POLICY "Public read projects"            ON public.projects            FOR SELECT USING (true);
CREATE POLICY "Public read contact_info"        ON public.contact_info        FOR SELECT USING (true);

-- Only authenticated admin can write
CREATE POLICY "Admin write hero_info"           ON public.hero_info           FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write about_info"          ON public.about_info          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write certifications"      ON public.certifications      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write professional_skills" ON public.professional_skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write skills"              ON public.skills              FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write projects"            ON public.projects            FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write contact_info"        ON public.contact_info        FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- Storage Buckets
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('assets',       'assets',       true) ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('images',       'images',       true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('projects',     'projects',     true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars',      'avatars',      true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media',        'media',        true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for assets bucket
CREATE POLICY "Public read assets"  ON storage.objects FOR SELECT USING (bucket_id = 'assets');
CREATE POLICY "Auth upload assets"  ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'assets');
CREATE POLICY "Auth update assets"  ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'assets');
CREATE POLICY "Auth delete assets"  ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'assets');
