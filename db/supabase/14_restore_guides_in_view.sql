-- =====================================================
-- Restore Guides in View
-- =====================================================
-- This updates the view to include both news AND guides
-- Run this AFTER checking that guides table exists
-- =====================================================

-- Drop and recreate the view to include guides
DROP VIEW IF EXISTS public.v_media_all CASCADE;

CREATE OR REPLACE VIEW public.v_media_all AS
-- News items from news table
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

-- Existing guides from guides table
SELECT 
  id::TEXT as id,
  slug,
  title,
  COALESCE(excerpt, body, '') as description,
  excerpt,
  COALESCE(body, '') as content,
  COALESCE(guide_type, type, 'Guideline') as type,
  NULL::TEXT as category,
  COALESCE(status, 'Approved') as status,
  COALESCE(created_at::DATE, updated_at::DATE, CURRENT_DATE) as date,
  COALESCE(image_url, image) as image_url,
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
GRANT SELECT ON public.v_media_all TO anon, authenticated;

SELECT 'View updated to include both news and guides!' as message;
