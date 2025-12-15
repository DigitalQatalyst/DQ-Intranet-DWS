-- Verify Glossary Terms Data Matches Filter Constants
-- Run this to check if data values match expected filter IDs

-- Check category values (should be: frameworks-models, ways-of-working, governance-systems, platforms-tools, metrics-performance, roles-structures)
SELECT 
  'Category Check' as check_type,
  category,
  COUNT(*) as count
FROM glossary_terms
GROUP BY category
ORDER BY category;

-- Check used_in values (should be: dws-core, l24-working-rooms, learning-center, marketplaces, governance)
SELECT 
  'Used In Check' as check_type,
  unnest(used_in) as used_in_value,
  COUNT(*) as count
FROM glossary_terms
GROUP BY unnest(used_in)
ORDER BY used_in_value;

-- Check status values (should be: Active or Deprecated)
SELECT 
  'Status Check' as check_type,
  status,
  COUNT(*) as count
FROM glossary_terms
GROUP BY status
ORDER BY status;

-- Show all terms with their values
SELECT 
  term,
  category,
  used_in,
  status
FROM glossary_terms
ORDER BY term;

