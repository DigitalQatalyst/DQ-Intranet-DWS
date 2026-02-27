-- =====================================================
-- Create News Table (Fresh Start)
-- =====================================================
-- This drops everything and starts fresh
-- =====================================================

-- Step 1: Drop existing view if it exists
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- Step 2: Drop existing news table if it exists
DROP TABLE IF EXISTS public.news CASCADE;

-- Step 3: Create news table
CREATE TABLE public.news (
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

-- Step 4: Create indexes
CREATE INDEX news_type_idx ON public.news (type);
CREATE INDEX news_status_idx ON public.news (status);
CREATE INDEX news_date_idx ON public.news (date);

-- Step 5: Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policy for public read access
CREATE POLICY news_select_all ON public.news
  FOR SELECT
  USING (true);

-- Step 7: Create view (only news, no guides)
CREATE VIEW public.v_media_all AS
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
ORDER BY date DESC NULLS LAST, created_at DESC;

-- Step 8: Grant access
GRANT SELECT ON public.news TO anon, authenticated;
GRANT SELECT ON public.v_media_all TO anon, authenticated;

-- Success message
SELECT 'News table and view created successfully! Ready for data.' as message;
