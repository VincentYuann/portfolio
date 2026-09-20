-- ==============================================================================
-- Portfolio Supabase Database Schema, Grants, & RLS Security Policies
-- Execute this entire script in your Supabase SQL Editor:
-- Dashboard > SQL Editor > New query > Paste & Run
-- ==============================================================================

-- 1. Helper function: verifies whether the calling JWT belongs to the admin owner
-- Supports email authentication and GitHub OAuth logins (even with private email)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'vincentyuan1020@gmail.com'
    OR LOWER(COALESCE(auth.jwt() -> 'user_metadata' ->> 'email', '')) = 'vincentyuan1020@gmail.com'
    OR LOWER(COALESCE(auth.jwt() -> 'user_metadata' ->> 'user_name', '')) = 'vincentyuann'
    OR LOWER(COALESCE(auth.jwt() ->> 'preferred_username', '')) = 'vincentyuann',
    false
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ==============================================================================
-- 2. Cleanup Legacy / Unused Tables
-- ==============================================================================
DROP TABLE IF EXISTS public.profile_info CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.project_categories CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;

-- ==============================================================================
-- 3. Tables & Schema Definitions
-- ==============================================================================

-- Profile Table (Intro / Hero / Seal Card / Contact Links)
CREATE TABLE IF NOT EXISTS public.profile (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'Vincent Yuan',
  headline TEXT DEFAULT 'Crafting thoughtful digital experiences with algorithmic clarity & Japanese wabi-sabi harmony.',
  tagline TEXT DEFAULT 'Specializing in robust distributed web architecture, local & cloud generative AI systems, and serene user interfaces governed by the timeless cadence of intentional space.',
  email TEXT DEFAULT 'vincentyuan1020@gmail.com',
  github TEXT DEFAULT 'https://github.com/VincentYuann',
  linkedin TEXT DEFAULT 'https://linkedin.com',
  role TEXT DEFAULT 'Software & Generative AI Engineer',
  capability_pillars JSONB DEFAULT '[
    {"label": "SYSTEMS", "items": "Rust · Docker · Linux"},
    {"label": "AI & RUNTIME", "items": "PyTorch · llama.cpp · Local LLMs"},
    {"label": "FULL-STACK", "items": "Next.js · TypeScript · PostgreSQL"}
  ]'::jsonb,
  hanko_card JSONB DEFAULT '{
    "headerLabel": "SEAL / 認印",
    "locationArchive": "KYOTO ARCHIVE",
    "stampCharacter": "原",
    "statusBadge": "",
    "lines": [
      {"text": "間と余白の美学", "label": "MA · 間", "tooltip": "Aesthetics of Negative Space (Ma)"},
      {"text": "静寂と簡素な調和", "label": "WA · 調和", "tooltip": "Silence and Simple Harmony (Wa)"},
      {"text": "職人の精緻な組手", "label": "CRAFT · 職人", "tooltip": "Artisan Precision and Joinery (Shokunin)"}
    ]
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure hanko_card column exists on existing profile tables
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS hanko_card JSONB;

-- Seed initial profile row
INSERT INTO public.profile (id, name, email)
VALUES (1, 'Vincent Yuan', 'vincentyuan1020@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- Philosophy Pillars Table (Up to 3 cards on homepage)
CREATE TABLE IF NOT EXISTS public.philosophy_pillars (
  position INT PRIMARY KEY,
  kanji TEXT NOT NULL DEFAULT '',
  romaji TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  tag TEXT DEFAULT '',
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial philosophy pillars
INSERT INTO public.philosophy_pillars (position, kanji, romaji, title, tag, description)
VALUES 
  (1, '間', 'Ma', 'Intentional Space', 'Uncluttered System Boundaries', 'Empty space is not an absence of features; it is an active structural element. Clean microservices, unencumbered visual layouts, and minimal latency let user attention focus without fatigue.'),
  (2, '侘寂', 'Wabi-Sabi', 'Authenticity & Patina', 'Graceful Degradation & Warmth', 'Embracing real-world imperfection with honesty. Tactile finishes, organic ink wash motifs, resilient error-recovery strategies, and software that ages gracefully with its users over time.'),
  (3, '職人', 'Shokunin', 'Obsessive Craftsmanship', 'Deep Code Integrity & Care', 'The craftsman''s obligation to perform one''s best work for the social welfare. Rigorous test coverage, deterministic API contracts, and fine joinery in every line of TypeScript and Python.')
ON CONFLICT (position) DO NOTHING;

-- Experience Table (Career Trajectory & Milestones)
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT false,
  status_label TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  logo_url TEXT DEFAULT '',
  kanji TEXT DEFAULT '木',
  kanji_subtitle TEXT DEFAULT '',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT experience_title_company_unique UNIQUE (title, company)
);

-- Projects Table (Works & Systems Architecture Archive)
CREATE TABLE IF NOT EXISTS public.projects (
  title TEXT PRIMARY KEY,
  id TEXT,
  kanji TEXT DEFAULT '案',
  badge TEXT DEFAULT 'ENGINEERING ARCHIVE',
  subtitle TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  description TEXT DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT false,
  status_label TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  image TEXT DEFAULT './images/sumi-os-workspace.jpg',
  tech_stacks TEXT[] DEFAULT ARRAY[]::TEXT[],
  sections JSONB DEFAULT '[]'::jsonb,
  metrics JSONB DEFAULT '[]'::jsonb,
  github_link TEXT DEFAULT '',
  live_link TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resume LaTeX Table
CREATE TABLE IF NOT EXISTS public.resume_latex (
  id INT PRIMARY KEY DEFAULT 1,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.resume_latex (id, content)
VALUES (1, '% Vincent Yuan Resume LaTeX Source')
ON CONFLICT (id) DO NOTHING;

-- Contact Messages Cleanup (Replaced by Resend + Supabase Edge Function 'send-contact-email')
-- Contact messages are no longer saved to the database.
DROP TABLE IF EXISTS public.contact_messages CASCADE;

-- Contact Rate Limits (Maintained securely by Edge Function via service_role to prevent email flooding)
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  ip TEXT PRIMARY KEY,
  count INT NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_request TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;
-- No public RLS policies: only service_role (Edge Function) can access this table.

-- ==============================================================================
-- 4. Schema Upgrades for Existing Databases (Idempotent ALTERS)
-- ==============================================================================

ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS start_date TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS end_date TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS status_label TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS bullets TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Drop NOT NULL constraints and redundant unique constraints that can trigger save failures
ALTER TABLE public.projects ALTER COLUMN category DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN category SET DEFAULT '';
ALTER TABLE public.projects ALTER COLUMN subtitle DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN subtitle SET DEFAULT '';
ALTER TABLE public.projects ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN description SET DEFAULT '';
ALTER TABLE public.projects ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN title SET DEFAULT 'Untitled Project';
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_title_key;

ALTER TABLE public.experience 
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS status_label TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS kanji TEXT DEFAULT '木',
  ADD COLUMN IF NOT EXISTS kanji_subtitle TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE public.experience ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.experience ALTER COLUMN title SET DEFAULT 'Untitled Role';
ALTER TABLE public.experience ALTER COLUMN company DROP NOT NULL;
ALTER TABLE public.experience ALTER COLUMN company SET DEFAULT '';
ALTER TABLE public.experience DROP CONSTRAINT IF EXISTS experience_title_company_key;
ALTER TABLE public.experience DROP CONSTRAINT IF EXISTS experience_title_company_unique;

ALTER TABLE public.philosophy_pillars ALTER COLUMN kanji DROP NOT NULL;
ALTER TABLE public.philosophy_pillars ALTER COLUMN kanji SET DEFAULT '';
ALTER TABLE public.philosophy_pillars ALTER COLUMN romaji DROP NOT NULL;
ALTER TABLE public.philosophy_pillars ALTER COLUMN romaji SET DEFAULT '';
ALTER TABLE public.philosophy_pillars ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.philosophy_pillars ALTER COLUMN title SET DEFAULT '';

-- ==============================================================================
-- 5. Grants: Expose Tables & Routines to PostgREST Data API
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- ==============================================================================
-- 6. Enable Row Level Security (RLS) on all tables
-- ==============================================================================

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.philosophy_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_latex ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 7. Policies: Public Read Access (All Visitors Can ONLY View)
-- ==============================================================================

DROP POLICY IF EXISTS "Allow public read on profile" ON public.profile;
CREATE POLICY "Allow public read on profile"
  ON public.profile FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read on philosophy_pillars" ON public.philosophy_pillars;
CREATE POLICY "Allow public read on philosophy_pillars"
  ON public.philosophy_pillars FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read on experience" ON public.experience;
CREATE POLICY "Allow public read on experience"
  ON public.experience FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read on projects" ON public.projects;
CREATE POLICY "Allow public read on projects"
  ON public.projects FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read on resume_latex" ON public.resume_latex;
CREATE POLICY "Allow public read on resume_latex"
  ON public.resume_latex FOR SELECT
  USING (true);

-- ==============================================================================
-- 8. Policies: Strict Admin Write Access (ONLY Vincent Yuan Can Edit)
-- ==============================================================================

DROP POLICY IF EXISTS "Allow authenticated admin full access on profile" ON public.profile;
DROP POLICY IF EXISTS "Allow only admin to write profile" ON public.profile;
CREATE POLICY "Allow only admin to write profile"
  ON public.profile FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated admin full access on philosophy_pillars" ON public.philosophy_pillars;
DROP POLICY IF EXISTS "Allow only admin to write philosophy_pillars" ON public.philosophy_pillars;
CREATE POLICY "Allow only admin to write philosophy_pillars"
  ON public.philosophy_pillars FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated admin full access on experience" ON public.experience;
DROP POLICY IF EXISTS "Allow only admin to write experience" ON public.experience;
CREATE POLICY "Allow only admin to write experience"
  ON public.experience FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated admin full access on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow only admin to write projects" ON public.projects;
CREATE POLICY "Allow only admin to write projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated admin full access on resume_latex" ON public.resume_latex;
DROP POLICY IF EXISTS "Allow only admin to write resume_latex" ON public.resume_latex;
CREATE POLICY "Allow only admin to write resume_latex"
  ON public.resume_latex FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 9. Storage Security Policies for 'portfolio-assets' Bucket
-- ==============================================================================

DROP POLICY IF EXISTS "Allow public read on portfolio-assets" ON storage.objects;
CREATE POLICY "Allow public read on portfolio-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Allow only admin to insert portfolio-assets" ON storage.objects;
CREATE POLICY "Allow only admin to insert portfolio-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Allow only admin to update portfolio-assets" ON storage.objects;
CREATE POLICY "Allow only admin to update portfolio-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Allow only admin to delete portfolio-assets" ON storage.objects;
CREATE POLICY "Allow only admin to delete portfolio-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin());

-- ==============================================================================
-- 10. Force PostgREST to Immediately Reload Schema Cache
-- ==============================================================================

NOTIFY pgrst, 'reload schema';
