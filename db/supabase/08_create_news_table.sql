-- =====================================================
-- Create Separate News Table
-- =====================================================
-- Simpler approach: Create a new table for news items
-- =====================================================

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  excerpt TEXT,
  content TEXT,
  type TEXT,
  category TEXT,
  status TEXT DEFAULT 'Approved',
  date DATE,
  image_url TEXT,
  source TEXT,
  author_name TEXT,
  tags TEXT[],
  news_type TEXT,
  focus_area TEXT,
  reading_time TEXT,
  location TEXT,
  format TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS news_type_idx ON public.news (type);
CREATE INDEX IF NOT EXISTS news_status_idx ON public.news (status);
CREATE INDEX IF NOT EXISTS news_date_idx ON public.news (date);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (allow all for now)
DROP POLICY IF EXISTS news_select_all ON public.news;
CREATE POLICY news_select_all ON public.news
  FOR SELECT
  USING (true);

-- Update the view to include both guides and news
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- First, let's create a simple view that works with basic guides structure
CREATE OR REPLACE VIEW public.v_media_all AS
-- News items
SELECT 
  id,
  slug,
  title,
  description,
  excerpt,
  content,
  type,
  category,
  status,
  date,
  image_url,
  source,
  author_name,
  tags,
  news_type,
  focus_area,
  reading_time,
  location,
  format,
  audio_url,
  created_at,
  updated_at,
  -- Guides-specific columns (NULL for news)
  NULL::TEXT as body,
  NULL::TEXT as domain,
  NULL::TEXT as guide_type,
  NULL::TEXT as function_area,
  NULL::TEXT as complexity_level,
  NULL::TEXT as image,
  NULL::TEXT as document_url,
  NULL::TIMESTAMPTZ as last_updated_at
FROM public.news

UNION ALL

-- Existing guides
SELECT 
  id::TEXT as id,
  slug,
  title,
  COALESCE(excerpt, '') as description,
  excerpt,
  COALESCE(body, '') as content,
  COALESCE(guide_type, 'Guideline') as type,
  NULL::TEXT as category,
  COALESCE(status, 'Approved') as status,
  COALESCE(created_at::DATE, CURRENT_DATE) as date,
  image as image_url,
  NULL::TEXT as source,
  NULL::TEXT as author_name,
  tags,
  NULL::TEXT as news_type,
  function_area as focus_area,
  NULL::TEXT as reading_time,
  NULL::TEXT as location,
  NULL::TEXT as format,
  NULL::TEXT as audio_url,
  created_at,
  updated_at,
  -- Guides-specific columns
  body,
  domain,
  guide_type,
  function_area,
  complexity_level,
  image,
  document_url,
  last_updated_at
FROM public.guides

ORDER BY date DESC NULLS LAST, created_at DESC;

-- Grant access
GRANT SELECT ON public.news TO anon, authenticated;
GRANT SELECT ON public.v_media_all TO anon, authenticated;

SELECT 'News table created successfully!' as message;
