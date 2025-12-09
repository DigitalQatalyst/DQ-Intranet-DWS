-- Marketplace schema for News and Jobs
-- VERIFIED: All fields required for Media Center details page are included
-- Based on mock data structure from src/data/media/
-- 
-- Last Updated: 2024-12-09
-- Status: ✅ Ready for Supabase integration

-- ===== News Table =====
DROP TABLE IF EXISTS public.news CASCADE;

CREATE TABLE public.news (
  id text PRIMARY KEY,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('Announcement', 'Guidelines', 'Notice', 'Thought Leadership')),
  date timestamptz NOT NULL,
  author text NOT NULL,
  byline text,
  views integer NOT NULL DEFAULT 0,
  excerpt text NOT NULL,
  image text,
  department text,
  location text CHECK (location IN ('Dubai', 'Nairobi', 'Riyadh', 'Remote')),
  domain text CHECK (domain IN ('Technology', 'Business', 'People', 'Operations')),
  theme text CHECK (theme IN ('Leadership', 'Delivery', 'Culture', 'DTMF')),
  tags text[],
  "readingTime" text CHECK ("readingTime" IN ('<5', '5–10', '10–20', '20+')),
  "newsType" text CHECK ("newsType" IN ('Corporate Announcements', 'Product / Project Updates', 'Events & Campaigns', 'Digital Tech News')),
  "newsSource" text CHECK ("newsSource" IN ('DQ Leadership', 'DQ Operations', 'DQ Communications')),
  "focusArea" text CHECK ("focusArea" IN ('GHC', 'DWS', 'Culture & People')),
  content text, -- Full article content for detail page (used for 4-paragraph overview)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ===== Jobs Table =====
DROP TABLE IF EXISTS public.jobs CASCADE;

CREATE TABLE public.jobs (
  id text PRIMARY KEY,
  title text NOT NULL,
  department text,
  "roleType" text,
  location text CHECK (location IN ('Dubai', 'Nairobi', 'Riyadh', 'Remote')),
  type text, -- contract type
  seniority text,
  "sfiaLevel" text,
  summary text NOT NULL,
  description text,
  responsibilities text[],
  requirements text[],
  benefits text[],
  "postedOn" timestamptz NOT NULL,
  "applyUrl" text,
  image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ===== RLS Policies =====
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY news_select ON public.news FOR SELECT USING (true);
CREATE POLICY jobs_select ON public.jobs FOR SELECT USING (true);

-- ===== Indexes for Performance =====
CREATE INDEX idx_news_type ON public.news(type);
CREATE INDEX idx_news_date ON public.news(date DESC);
CREATE INDEX idx_news_department ON public.news(department);
CREATE INDEX idx_news_location ON public.news(location);
CREATE INDEX idx_news_newsSource ON public.news("newsSource");
CREATE INDEX idx_news_newsType ON public.news("newsType");
CREATE INDEX idx_jobs_posted_on ON public.jobs("postedOn" DESC);
CREATE INDEX idx_jobs_department ON public.jobs(department);
CREATE INDEX idx_jobs_location ON public.jobs(location);

-- ===== Field Usage Verification =====
-- 
-- Fields used in Media Center Details Page:
-- ✅ id - Article identification and routing
-- ✅ title - Main title display (with special case handling)
-- ✅ type - Category tag (blue pill)
-- ✅ date - Announcement date (formatted display)
-- ✅ author - Author name (Relevant Contact field)
-- ✅ byline - Alternative author for Thought Leadership
-- ✅ newsSource - Author organization (displayed in header)
-- ✅ department - Department info (COMPANY NEWS DETAILS section)
-- ✅ domain - Alternative department (fallback)
-- ✅ image - Hero image (if available)
-- ✅ content - Full content (used for 4-paragraph overview)
-- ✅ excerpt - Summary text (used in overview generation)
-- ✅ views - View count (available but not displayed)
-- ✅ tags - Tags (available for future use)
-- ✅ readingTime - Reading time (available for future use)
-- ✅ newsType - News type (available for future use)
-- ✅ focusArea - Focus area (available for future use)
-- ✅ location - Location (available for future use)
-- ✅ theme - Theme (available for future use)
--
-- All required fields are present in this schema ✅

