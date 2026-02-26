-- =====================================================
-- Create Media View for Knowledge Hub
-- =====================================================
-- This view provides a unified interface for fetching
-- guides, news, and learning content
-- =====================================================

-- Create a view that combines guides with metadata for the Knowledge Hub
CREATE OR REPLACE VIEW public.v_media_all AS
SELECT 
  id,
  slug,
  title,
  excerpt as description,
  body as content,
  image as image_url,
  tags,
  guide_type as type,
  domain as category,
  status,
  created_at as date,
  updated_at,
  last_updated_at,
  -- Additional fields for compatibility
  slug as source,
  domain as focus_area,
  guide_type as news_type
FROM public.guides
WHERE status = 'Approved';

-- Grant access to anonymous users
GRANT SELECT ON public.v_media_all TO anon;
GRANT SELECT ON public.v_media_all TO authenticated;

-- Create indexes on the underlying table for better performance
CREATE INDEX IF NOT EXISTS guides_tags_idx ON public.guides USING GIN (tags);
CREATE INDEX IF NOT EXISTS guides_created_at_idx ON public.guides (created_at DESC);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Media view created successfully!';
  RAISE NOTICE 'View name: v_media_all';
  RAISE NOTICE 'This view can now be used by the KnowledgeHub component';
END $$;

-- Test the view
SELECT 
  slug,
  title,
  type,
  category,
  status,
  date
FROM public.v_media_all
LIMIT 5;
