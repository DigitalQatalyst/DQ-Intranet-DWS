-- Fix RLS Policy for glossary_terms
-- Run this if you're getting "Permission denied" or RLS blocking access errors

-- Define constants
\set TABLE_NAME 'glossary_terms'
\set POLICY_NAME 'Allow public read access to glossary_terms'

-- First, check if RLS is enabled (it should be)
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

-- Drop the existing policy if it exists (to allow re-running)
DROP POLICY IF EXISTS :'POLICY_NAME' ON glossary_terms;

-- Create the policy to allow public read access (matching existing DWS pattern)
CREATE POLICY :'POLICY_NAME'
  ON glossary_terms
  FOR SELECT
  USING (true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = :'TABLE_NAME';

