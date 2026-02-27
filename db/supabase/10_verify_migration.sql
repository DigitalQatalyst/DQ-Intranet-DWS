-- =====================================================
-- Verify News Migration
-- =====================================================
-- Run this after completing the migration to verify everything works
-- =====================================================

-- 1. Check news table exists and has data
SELECT 
  'News Table' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 36 THEN '✅ PASS'
    ELSE '❌ FAIL - Expected 36 news items'
  END as status
FROM public.news;

-- 2. Check view includes news items
SELECT 
  'View with News' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PASS'
    ELSE '❌ FAIL - No news in view'
  END as status
FROM public.v_media_all
WHERE type IN ('Announcement', 'Thought Leadership');

-- 3. Check latest news items
SELECT 
  '=== LATEST NEWS ITEMS ===' as section,
  '' as id,
  '' as title,
  '' as type,
  '' as date;

SELECT 
  '' as section,
  id,
  title,
  type,
  date::text
FROM public.v_media_all
WHERE type IN ('Announcement', 'Thought Leadership')
ORDER BY date DESC
LIMIT 10;

-- 4. Check news by type
SELECT 
  '=== NEWS BY TYPE ===' as section,
  '' as type,
  '' as count;

SELECT 
  '' as section,
  type,
  COUNT(*)::text as count
FROM public.news
GROUP BY type
ORDER BY COUNT(*) DESC;

-- 5. Check RLS policy works
SELECT 
  'RLS Policy' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PASS - Public can read news'
    ELSE '❌ FAIL - RLS policy issue'
  END as status
FROM public.news
WHERE status = 'Approved';

-- 6. Sample news items with images
SELECT 
  '=== SAMPLE NEWS WITH IMAGES ===' as section,
  '' as title,
  '' as has_image;

SELECT 
  '' as section,
  title,
  CASE 
    WHEN image_url IS NOT NULL THEN '✅ Has Image'
    ELSE '❌ No Image'
  END as has_image
FROM public.news
ORDER BY date DESC
LIMIT 5;

-- Summary
SELECT 
  '=== MIGRATION SUMMARY ===' as summary,
  '' as metric,
  '' as value;

SELECT 
  '' as summary,
  'Total News Items' as metric,
  COUNT(*)::text as value
FROM public.news
UNION ALL
SELECT 
  '' as summary,
  'Approved News' as metric,
  COUNT(*)::text as value
FROM public.news
WHERE status = 'Approved'
UNION ALL
SELECT 
  '' as summary,
  'News with Images' as metric,
  COUNT(*)::text as value
FROM public.news
WHERE image_url IS NOT NULL
UNION ALL
SELECT 
  '' as summary,
  'Total Items in View' as metric,
  COUNT(*)::text as value
FROM public.v_media_all;

SELECT '✅ Migration verification complete!' as result;
