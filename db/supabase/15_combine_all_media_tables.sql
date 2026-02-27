-- =====================================================
-- Combine All Media Tables into View
-- =====================================================
-- This combines news_articles, news_blogs, news_announcements, 
-- guides, and news into one view
-- =====================================================

-- Drop existing view
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- Create comprehensive view combining all media tables
CREATE OR REPLACE VIEW public.v_media_all AS

-- News articles
SELECT 
  id::TEXT as id,
  slug,
  title,
  excerpt as description,
  excerpt,
  content,
  'News Article' as type,
  category,
  status,
  published_date as date,
  image_url,
  source,
  author as author_name,
  tags,
  NULL::TEXT as news_type,
  NULL::TEXT as focus_area,
  reading_time,
  location,
  NULL::TEXT as format,
  NULL::TEXT as audio_url,
  created_at,
  updated_at
FROM public.news_articles
WHERE status = 'published'

UNION ALL

-- News blogs
SELECT 
  id::TEXT as id,
  slug,
  title,
  excerpt as description,
  excerpt,
  content,
  'Blog' as type,
  category,
  status,
  published_date as date,
  image_url,
  source,
  author as author_name,
  tags,
  NULL::TEXT as news_type,
  focus_area,
  reading_time,
  NULL::TEXT as location,
  'Blog' as format,
  NULL::TEXT as audio_url,
  created_at,
  updated_at
FROM public.news_blogs
WHERE status = 'published'

UNION ALL

-- News announcements
SELECT 
  id::TEXT as id,
  slug,
  title,
  excerpt as description,
  excerpt,
  content,
  'Announcement' as type,
  category,
  status,
  published_date as date,
  image_url,
  source,
  author as author_name,
  tags,
  news_type,
  focus_area,
  reading_time,
  location,
  NULL::TEXT as format,
  NULL::TEXT as audio_url,
  created_at,
  updated_at
FROM public.news_announcements
WHERE status = 'published'

UNION ALL

-- New news table (if it has data)
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

-- Grant access
GRANT SELECT ON public.v_media_all TO anon, authenticated;

SELECT 'View updated to include all media tables!' as message;
