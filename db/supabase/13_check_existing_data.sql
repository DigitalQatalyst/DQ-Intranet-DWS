-- =====================================================
-- Check Existing Data in Knowledge Hub
-- =====================================================
-- Run this to see what data already exists
-- =====================================================

-- Check what tables exist
SELECT 
  'Tables in database:' as info,
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check what views exist
SELECT 
  'Views in database:' as info,
  table_name as view_name
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- If guides table exists, check its structure
SELECT 
  'Guides table columns:' as info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'guides'
ORDER BY ordinal_position;

-- If guides table exists, check sample data
SELECT 
  'Sample guides data:' as info,
  id,
  slug,
  title,
  type
FROM public.guides
LIMIT 10;

-- Check news table
SELECT 
  'News table count:' as info,
  COUNT(*) as total
FROM public.news;

-- Check if there are any other media-related tables
SELECT 
  'All tables with media/news/blog in name:' as info,
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (
    table_name LIKE '%media%' 
    OR table_name LIKE '%news%' 
    OR table_name LIKE '%blog%'
    OR table_name LIKE '%guide%'
  );
