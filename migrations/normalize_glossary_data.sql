-- Normalize Glossary Terms Data
-- Run this to ensure all values match filter constants exactly
-- This fixes any data inconsistencies that might cause filter issues

-- Check current data values
SELECT '=== CURRENT DATA VALUES ===' as step;
SELECT 
  term,
  category,
  used_in,
  status
FROM glossary_terms
ORDER BY term;

-- Normalize category values (ensure they match filter IDs exactly)
UPDATE glossary_terms
SET category = 'frameworks-models'
WHERE category IN ('Frameworks & Models', 'frameworks', 'framework-models', 'Framework & Models');

UPDATE glossary_terms
SET category = 'ways-of-working'
WHERE category IN ('Ways of Working', 'ways-of-work', 'way-of-working');

UPDATE glossary_terms
SET category = 'governance-systems'
WHERE category IN ('Governance & Systems', 'governance', 'governance-system');

UPDATE glossary_terms
SET category = 'platforms-tools'
WHERE category IN ('Platforms & Tools', 'platforms', 'platform-tools', 'Platform & Tools');

UPDATE glossary_terms
SET category = 'metrics-performance'
WHERE category IN ('Metrics & Performance', 'metrics', 'performance');

UPDATE glossary_terms
SET category = 'roles-structures'
WHERE category IN ('Roles & Structures', 'roles', 'structures');

-- Normalize status values (ensure exact case match)
UPDATE glossary_terms
SET status = 'Active'
WHERE LOWER(status) = 'active' AND status != 'Active';

UPDATE glossary_terms
SET status = 'Deprecated'
WHERE LOWER(status) = 'deprecated' AND status != 'Deprecated';

-- Normalize used_in array values (ensure they match filter IDs exactly)
-- Fix common variations using array operations
UPDATE glossary_terms
SET used_in = (
  SELECT array_agg(
    CASE 
      WHEN val = 'DWS Core' THEN 'dws-core'
      WHEN val = 'dws' THEN 'dws-core'
      WHEN val = 'L24 Working Rooms' THEN 'l24-working-rooms'
      WHEN val = 'l24' THEN 'l24-working-rooms'
      WHEN val = 'Learning Center' THEN 'learning-center'
      WHEN val = 'Marketplaces' THEN 'marketplaces'
      WHEN val = 'Governance' THEN 'governance'
      ELSE val
    END
  )
  FROM unnest(used_in) AS val
)
WHERE 'DWS Core' = ANY(used_in) 
   OR 'dws' = ANY(used_in)
   OR 'L24 Working Rooms' = ANY(used_in)
   OR 'l24' = ANY(used_in)
   OR 'Learning Center' = ANY(used_in)
   OR 'Marketplaces' = ANY(used_in)
   OR 'Governance' = ANY(used_in);

-- Verify normalized data
SELECT '=== NORMALIZED DATA VALUES ===' as step;
SELECT 
  term,
  category,
  used_in,
  status
FROM glossary_terms
ORDER BY term;

-- Expected values:
-- category: 'frameworks-models', 'ways-of-working', 'governance-systems', 'platforms-tools', 'metrics-performance', 'roles-structures'
-- used_in: array containing 'dws-core', 'l24-working-rooms', 'learning-center', 'marketplaces', 'governance'
-- status: 'Active' or 'Deprecated'

