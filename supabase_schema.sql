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
  headline TEXT DEFAULT 'Crafting disciplined software systems with full-stack precision, algorithmic clarity, and Japanese wabi-sabi harmony.',
  tagline TEXT DEFAULT 'Computer Science student with Systems Architecture & AI concentrations based in Philadelphia. Bringing curiosity from game mechanics and logic puzzles into scalable backend architecture, intuitive user interfaces, and the user-first empathy of hospitality.',
  email TEXT DEFAULT 'vincentyuan1020@gmail.com',
  github TEXT DEFAULT 'https://github.com/VincentYuann',
  linkedin TEXT DEFAULT 'https://linkedin.com',
  role TEXT DEFAULT 'Software Engineer · Full-Stack & Systems',
  capability_pillars JSONB DEFAULT '[
    {"label": "SYSTEMS & ARCHITECTURE", "items": "TypeScript · Python · Docker · Linux"},
    {"label": "FULL-STACK & DATA", "items": "React · Next.js · Node.js · PostgreSQL · Tailwind CSS"},
    {"label": "AI & RUNTIMES", "items": "PyTorch · Local LLMs · REST APIs · Git"}
  ]'::jsonb,
  hanko_card JSONB DEFAULT '{
    "headerLabel": "SEAL / 認印",
    "locationArchive": "PHILADELPHIA, PA",
    "stampCharacter": "原",
    "statusBadge": "OPEN TO ROLES · FULL-STACK",
    "lines": [
      {"text": "間と余白の美学", "label": "MA · 間", "tooltip": "Aesthetics of Negative Space (Ma)"},
      {"text": "静寂と簡素な調和", "label": "WA · 調和", "tooltip": "Silence and Simple Harmony (Wa)"},
      {"text": "職人の精緻な組手", "label": "CRAFT · 職人", "tooltip": "Artisan Precision and Joinery (Shokunin)"}
    ]
  }'::jsonb,
  origin_story JSONB DEFAULT '{
    "badge": "ORIGIN & TRAJECTORY · 原点と軌跡",
    "headline": "From Logic Puzzles to Full-Stack Systems",
    "leadParagraph": "My engineering path began not with grand architecture, but with genuine curiosity: discovering how logic turns static pixels into dynamic systems, mastering state through game mechanics, and bringing the human empathy of hospitality into every layer of software architecture.",
    "milestones": [
      {
        "era": "PHASE 01",
        "title": "The Spark & Logic",
        "subtitle": "High School HTML / CSS / JS",
        "tag": "WEB ROOTS",
        "description": "Discovered coding in a high school class: seeing how a few lines of JavaScript could turn static markup into an interactive canvas. The thrill of transforming logic into visual response set the foundation."
      },
      {
        "era": "PHASE 02",
        "title": "Mechanics & State",
        "subtitle": "Python OOP & Pygame",
        "tag": "SYSTEM MECHANICS",
        "description": "Majoring in CS in college, I explored game development with Python and Pygame. Writing game loops, state machines, tick rates, and collision mathematics from scratch forged my deep object-oriented foundation."
      },
      {
        "era": "PHASE 03",
        "title": "Beyond the Iceberg",
        "subtitle": "Co-op & Full-Stack Systems",
        "tag": "DATA FLOW & APIS",
        "description": "Real-world software and co-ops revealed that frontend styling is only the tip of the iceberg. I became fascinated by what lives beneath: API contracts, relational schemas, caching, and resilient system data flow."
      },
      {
        "era": "PHASE 04",
        "title": "Hospitality Empathy",
        "subtitle": "Service Industry to Code",
        "tag": "USER-FIRST CRAFT",
        "description": "Years as a barista and server in Philadelphia taught me active listening, anticipating user friction before it happens, and remaining calm during peak rushes, translating directly into human-centered software engineering."
      }
    ]
  }'::jsonb,
  hobbies JSONB DEFAULT '[
    {
      "id": "woodworking",
      "title": "Sashimono Woodworking",
      "kanji": "木工技芸",
      "category": "Woodcraft",
      "subtitle": "Hand-planed Hinoki & Precision Joinery",
      "images": [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBIQr3bTk3yvKCBXiAYi_kPdrzrSDIS4QJkYLWaCRKFOh_Iyvqgn2IkCe1PeeRqs_ScybEjUyNSBVPfSoqCDoXz-iTNgSOXxxNxKheHSrcnFQZE-bhBwH5mmkRJxXWbCWlus4MxGuYXevVL7oTqwrTcvbKPWwGtZj2VEYvaUrcisA4rRI0jgNhTBKtJgVQFJ86vzJ-h43U6tuThqzyw2TBz0s1ypULVS2GnMSJ5B4Q19cWnTVqag0yRHw",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB2WFweXy4kKW8bvOnv5eAl8K4fYGibTjsSW1jfbVi5-hMizxKNNHdZDnUso1GFuRJ7BcWM7zIJ0rUCiPL21mDERl2-xN_g3ULKSovWx6e9uuwNQgjuBZlBhjfA4kY4CBZ5pHaB2v8bTCFUcAkfiztO4Ws8lm2gGTsd94zG_4jEv8cRxBgj4YP9yQMEF3Sswnp_mvYVSJ2NfnozxzDT5WEo5G5Jk6GiswdagPeJbs0i47rZkjIKSEhILdjJUbtSIKioOB4",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBNUbl-6saHrZBnNOQEft_44ErmBzcNf2_3GgN4Xh2hxYnrVyHmx0Kz7DBGAQU30hv1C56hMzEkMbUvzMsgiiQJO5-JOSAYbf_MTlCsxqsG6oYp2JOG6zBceu8-bSXRVljpncu6N9vfbZ1ELq___5JJUl5KKRHtAYdMHHOco-rVkrLgjawbqtRYqfqTWnnGG7IsPoXWB1Y7Rep0IHev5pbIs2-M31bmqSw0CJhNHoyX_8cvun5BWnCorQ"
      ],
      "whyDescription": "Writing software is ephemeral; once code compiles, it lives unseen in silicon. Working with Hinoki cedar forces me to respect physical grains and sub-millimeter tolerances without nails or glue. It keeps me patient and grounded when engineering intricate software systems.",
      "metadata": [
        {"label": "Material", "value": "Kiso Hinoki"},
        {"label": "Favorite Tool", "value": "Tsunesaburo Kanna"}
      ],
      "displayOrder": 1
    },
    {
      "id": "chado-kintsugi",
      "title": "Chadō & Ceramic Kintsugi",
      "kanji": "侘び寂びと茶の湯",
      "category": "Ceremony",
      "subtitle": "Tea Preparation & Gold Urushi Repair",
      "images": [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA2pdPd8CnVOnZYPBQsr47gzJPGBsD3Umny072KbSji2j8ByvSS5A2-4M5CKznNCanIim2LRBVzRaf_28DBhgqM1X1_fbkE3X7dghJAIkJb9tX9tr00QGf-THZVPfzovWMXnTtc0KxqMwgS1VytvsKGr5i21bjMvHx3rCqyCMRxI6qYe6EoxHRSKV8H68eVRi3jxO07zcRfBfovYmvVzqiFCBWzOxspiFqqJeStUOjb7KmxZ8gfXabqaA",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCzvcQXHPLoNu2wASnQkgBA268ObsK-qfA_q-fDh8WoyC2x2WPhmkCKGffOuYuVbRXrwaX1Kf2M8UB4kHDKXBgoWtQJUtGCWKGI4NpvvTuf5KJE9DKtFKw1q8B7eKoBsB98bxYIIPJpAov0Wb4PdIpFeqcEejzor5q3vHPeADeW93jb_w1XiQ2fqxljWq-DKtzR97TXQZ2ZhbR4m0j7u7RYTBy6ZIVk47LkEGOllSKL0NnUc0e7oxYHogUKk-ggfWptaeE",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBIQr3bTk3yvKCBXiAYi_kPdrzrSDIS4QJkYLWaCRKFOh_Iyvqgn2IkCe1PeeRqs_ScybEjUyNSBVPfSoqCDoXz-iTNgSOXxxNxKheHSrcnFQZE-bhBwH5mmkRJxXWbCWlus4MxGuYXevVL7oTqwrTcvbKPWwGtZj2VEYvaUrcisA4rRI0jgNhTBKtJgVQFJ86vzJ-h43U6tuThqzyw2TBz0s1ypULVS2GnMSJ5B4Q19cWnTVqag0yRHw"
      ],
      "whyDescription": "Whisking matcha every morning creates a deliberate pause before screens turn on. Repairing broken ceramics with gold lacquer (Kintsugi) is a quiet reminder that flaws, production incidents, and scars make a system more resilient and honest rather than something to hide.",
      "metadata": [
        {"label": "Routine", "value": "15-min Morning Whisk"},
        {"label": "Tea Cultivar", "value": "Uji Samidori"}
      ],
      "displayOrder": 2
    },
    {
      "id": "sumie-shodo",
      "title": "Sumi-e & Shodō Ink Wash",
      "kanji": "墨絵と筆致",
      "category": "Focus",
      "subtitle": "Raw Kozo Mulberry Paper & Inkstone",
      "images": [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBNUbl-6saHrZBnNOQEft_44ErmBzcNf2_3GgN4Xh2hxYnrVyHmx0Kz7DBGAQU30hv1C56hMzEkMbUvzMsgiiQJO5-JOSAYbf_MTlCsxqsG6oYp2JOG6zBceu8-bSXRVljpncu6N9vfbZ1ELq___5JJUl5KKRHtAYdMHHOco-rVkrLgjawbqtRYqfqTWnnGG7IsPoXWB1Y7Rep0IHev5pbIs2-M31bmqSw0CJhNHoyX_8cvun5BWnCorQ",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuClO-_M4JLPlq9fuXOkR0VqL0Ftj7qkrzxjiIqN3p0rE8bjSD_ovkLpK88j5fmt6KSbi-oEZE4MuMIxhGTNunXZvVpDP0TZfc3HP0wZJBif4x-2Aff_Gn6unjrvb_fnKY465KpwA6zY6clzkiFRnBFAlIfKv2M6QBDPmTtDxoTUK-RFkAl8gZb0kWSMnlZ50MJr6WCPRIwwaUQ9ZCWQasnNmeXdJ4c6A3m5cs7Oy2EruIIJ0K6kY8LMHV-P-s1skPD6LGE",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA2pdPd8CnVOnZYPBQsr47gzJPGBsD3Umny072KbSji2j8ByvSS5A2-4M5CKznNCanIim2LRBVzRaf_28DBhgqM1X1_fbkE3X7dghJAIkJb9tX9tr00QGf-THZVPfzovWMXnTtc0KxqMwgS1VytvsKGr5i21bjMvHx3rCqyCMRxI6qYe6EoxHRSKV8H68eVRi3jxO07zcRfBfovYmvVzqiFCBWzOxspiFqqJeStUOjb7KmxZ8gfXabqaA"
      ],
      "whyDescription": "In Shodō, there is no undo or backspace. Once ink touches the washi fiber, the choice is permanent. Grinding the inkstone for 20 minutes clears mental clutter and teaches decisive, unwavering action before execution.",
      "metadata": [
        {"label": "Paper", "value": "Echizen Raw Kozo"},
        {"label": "Ink", "value": "Nara Pine-Soot"}
      ],
      "displayOrder": 3
    },
    {
      "id": "custom-keyboards",
      "title": "Custom Keyboards & Soldering",
      "kanji": "自作鍵盤工芸",
      "category": "Hardware",
      "subtitle": "Hand-lubed Switches & Brass Plate Builds",
      "images": [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA1W78vnIMUOZKe7hIAoZsWy9lJceC1GpqMkqCmJ0zjjhiQRCMfeO5ejXeEFDH10cv9VQ-v34kBBbp7myZGbKDV_4cTYbwZkD7my_EJIz0AaigAKuxHxLaqbPY3rz0uyQRh3VXovKJ0q8mi47qszpp4XFdiWdzRtPHfxCANH_mlPFejUqNlRNslttdcVZcNUKICTpcQjiwuDY__vaTUy4XZJu7pWzO6fZFAOcVs98n4WD37JYOW7sBiRA",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-wZeKdlcgCrJC9erSQCxG7UvapQqbvhrt6rKGTVp7-eZT8s7AeO6dMKSPvrleqxjpYga7NSq0euWrBCozfTAv5vckRlEL_2P1HrawliMAIhTgvS9tgflMmTvNVKa8XvFTeb-cWOUTUzO1TiSVwgJwDrxMCivMlme4gOAbjrPE9ae2jR37V4v19KzIpP4Y4Sxt9cZKg7wkd-TpIoL5wKoV2fOBnnMgOOw44llnc8BfNRz0xLmforWM_fP63iZA9ibRq8",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBIQr3bTk3yvKCBXiAYi_kPdrzrSDIS4QJkYLWaCRKFOh_Iyvqgn2IkCe1PeeRqs_ScybEjUyNSBVPfSoqCDoXz-iTNgSOXxxNxKheHSrcnFQZE-bhBwH5mmkRJxXWbCWlus4MxGuYXevVL7oTqwrTcvbKPWwGtZj2VEYvaUrcisA4rRI0jgNhTBKtJgVQFJ86vzJ-h43U6tuThqzyw2TBz0s1ypULVS2GnMSJ5B4Q19cWnTVqag0yRHw"
      ],
      "whyDescription": "As programmers, our keyboard is our primary physical connection to thought and work. Hand-soldering diodes, lubing switch stems, and adjusting plate resonance turns an everyday plastic tool into a tailored instrument that brings joy to every keystroke.",
      "metadata": [
        {"label": "Switches", "value": "Lubed Holy Panda X"},
        {"label": "Mounting", "value": "Gasket Leaf-Spring"}
      ],
      "displayOrder": 4
    }
  ]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure hanko_card, origin_story, and hobbies columns exist on existing profile tables
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS hanko_card JSONB;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS origin_story JSONB;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS hobbies JSONB;

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
