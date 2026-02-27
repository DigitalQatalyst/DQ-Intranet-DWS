-- =====================================================
-- Create News Table (Simple Version)
-- =====================================================
-- This version only creates the news table and a simple view
-- It doesn't try to union with guides table to avoid column issues
-- =====================================================

-- Step 1: Create news table
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

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS news_type_idx ON public.news (type);
CREATE INDEX IF NOT EXISTS news_status_idx ON public.news (status);
CREATE INDEX IF NOT EXISTS news_date_idx ON public.news (date);

-- Step 3: Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policy for public read access
DROP POLICY IF EXISTS news_select_all ON public.news;
CREATE POLICY news_select_all ON public.news
  FOR SELECT
  USING (true);

-- Step 5: Drop existing view if it exists
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- Step 6: Create a simple view that only shows news
-- (We'll add guides later once we know the table structure)
CREATE OR REPLACE VIEW public.v_media_all AS
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
  updated_at
FROM public.news
WHERE status = 'Approved'
ORDER BY date DESC NULLS LAST, created_at DESC;

-- Step 7: Grant access
GRANT SELECT ON public.news TO anon, authenticated;
GRANT SELECT ON public.v_media_all TO anon, authenticated;

-- Success message
SELECT 'News table and view created successfully!' as message;
