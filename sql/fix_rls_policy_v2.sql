-- Fix RLS Policy for glossary_terms (Version 2 - matches existing DWS pattern)
-- Run this if you're still getting permission errors

-- Define constants
\set TABLE_NAME 'glossary_terms'
\set POLICY_NAME 'Allow public read access to glossary_terms'

-- Ensure RLS is enabled
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on this table
DROP POLICY IF EXISTS :'POLICY_NAME' ON glossary_terms;

-- Create policy matching the pattern used in other DWS tables (no TO clause)
CREATE POLICY :'POLICY_NAME'
  ON glossary_terms
  FOR SELECT
  USING (true);

-- Verify the policy
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies
WHERE tablename = :'TABLE_NAME';

-- Test the query (should work now)
SELECT COUNT(*) FROM glossary_terms;

