-- Diagnostic script to check why communities_with_counts view returns no rows
-- Run this in Supabase SQL Editor to troubleshoot

-- Step 1: Check if communities table has data
SELECT 
    'Step 1: Communities table count' as step,
    COUNT(*) as count
FROM communities;

-- Step 2: Check sample communities data
SELECT 
    'Step 2: Sample communities' as step,
    id,
    name,
    activemembers,
    activitylevel,
    isprivate,
    created_at
FROM communities
LIMIT 5;

-- Step 3: Check if memberships exist
SELECT 
    'Step 3: Memberships count' as step,
    COUNT(*) as count
FROM memberships;

-- Step 4: Test the view query manually (without GROUP BY first)
SELECT 
    'Step 4: Test query without GROUP BY' as step,
    c.id,
    c.name,
    c.activemembers,
    c.activitylevel,
    COUNT(DISTINCT m.user_id) as member_count
FROM communities c
LEFT JOIN memberships m ON c.id = m.community_id
GROUP BY c.id, c.name, c.activemembers, c.activitylevel
LIMIT 5;

-- Step 5: Check if view exists and is accessible
SELECT 
    'Step 5: View exists check' as step,
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public' 
AND table_name = 'communities_with_counts';

-- Step 6: Test direct view query
SELECT 
    'Step 6: Direct view query' as step,
    COUNT(*) as row_count
FROM communities_with_counts;

-- Step 7: Check for NULL values that might break GROUP BY
SELECT 
    'Step 7: NULL value check' as step,
    COUNT(*) as total_communities,
    COUNT(activemembers) as has_activemembers,
    COUNT(activitylevel) as has_activitylevel,
    COUNT(imageurl) as has_imageurl,
    COUNT(category) as has_category
FROM communities;
