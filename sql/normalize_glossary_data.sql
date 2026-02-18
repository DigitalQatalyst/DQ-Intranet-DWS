-- Normalize Glossary Terms Data
-- Run this to ensure all values match filter constants exactly
-- This fixes any data inconsistencies that might cause filter issues

-- Define constants for categories
\set CAT_FRAMEWORKS 'frameworks-models'
\set CAT_WAYS 'ways-of-working'
\set CAT_GOVERNANCE 'governance-systems'
\set CAT_PLATFORMS 'platforms-tools'
\set CAT_METRICS 'metrics-performance'
\set CAT_ROLES 'roles-structures'

-- Define constants for status
\set STATUS_ACTIVE 'Active'
\set STATUS_DEPRECATED 'Deprecated'

-- Define constants for used_in values
\set USED_DWS_CORE 'dws-core'
\set USED_L24 'l24-working-rooms'
\set USED_LEARNING 'learning-center'
\set USED_MARKETPLACES 'marketplaces'
\set USED_GOVERNANCE 'governance'

-- Define step messages
\set MSG_CURRENT '=== CURRENT DATA VALUES ==='
\set MSG_NORMALIZED '=== NORMALIZED DATA VALUES ==='

-- Check current data values
SELECT :'MSG_CURRENT' as step;
SELECT 
  term,
  category,
  used_in,
  status
FROM glossary_terms
ORDER BY term;

-- Normalize category values (ensure they match filter IDs exactly)
UPDATE glossary_terms
SET category = :'CAT_FRAMEWORKS'
WHERE category IN ('Frameworks & Models', 'frameworks', 'framework-models', 'Framework & Models');

UPDATE glossary_terms
SET category = :'CAT_WAYS'
WHERE category IN ('Ways of Working', 'ways-of-work', 'way-of-working');

UPDATE glossary_terms
SET category = :'CAT_GOVERNANCE'
WHERE category IN ('Governance & Systems', 'governance', 'governance-system');

UPDATE glossary_terms
SET category = :'CAT_PLATFORMS'
WHERE category IN ('Platforms & Tools', 'platforms', 'platform-tools', 'Platform & Tools');

UPDATE glossary_terms
SET category = :'CAT_METRICS'
WHERE category IN ('Metrics & Performance', 'metrics', 'performance');

UPDATE glossary_terms
SET category = :'CAT_ROLES'
WHERE category IN ('Roles & Structures', 'roles', 'structures');

-- Normalize status values (ensure exact case match)
UPDATE glossary_terms
SET status = :'STATUS_ACTIVE'
WHERE LOWER(status) = 'active' AND status != :'STATUS_ACTIVE';

UPDATE glossary_terms
SET status = :'STATUS_DEPRECATED'
WHERE LOWER(status) = 'deprecated' AND status != :'STATUS_DEPRECATED';

-- Normalize used_in array values (ensure they match filter IDs exactly)
-- Fix common variations using array operations
UPDATE glossary_terms
SET used_in = (
  SELECT array_agg(
    CASE 
      WHEN val = 'DWS Core' THEN :'USED_DWS_CORE'
      WHEN val = 'dws' THEN :'USED_DWS_CORE'
      WHEN val = 'L24 Working Rooms' THEN :'USED_L24'
      WHEN val = 'l24' THEN :'USED_L24'
      WHEN val = 'Learning Center' THEN :'USED_LEARNING'
      WHEN val = 'Marketplaces' THEN :'USED_MARKETPLACES'
      WHEN val = 'Governance' THEN :'USED_GOVERNANCE'
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
SELECT :'MSG_NORMALIZED' as step;
SELECT 
  term,
  category,
  used_in,
  status
FROM glossary_terms
ORDER BY term;

-- Expected values:
-- category: :'CAT_FRAMEWORKS', :'CAT_WAYS', :'CAT_GOVERNANCE', :'CAT_PLATFORMS', :'CAT_METRICS', :'CAT_ROLES'
-- used_in: array containing :'USED_DWS_CORE', :'USED_L24', :'USED_LEARNING', :'USED_MARKETPLACES', :'USED_GOVERNANCE'
-- status: :'STATUS_ACTIVE' or :'STATUS_DEPRECATED'

