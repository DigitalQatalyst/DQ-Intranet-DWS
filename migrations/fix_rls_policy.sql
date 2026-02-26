-- Fix RLS Policy for glossary_terms
-- Run this if you're getting "Permission denied" or RLS blocking access errors

-- First, check if RLS is enabled (it should be)
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

-- Drop the existing policy if it exists (to allow re-running)
DROP POLICY IF EXISTS "Allow public read access to glossary_terms" ON glossary_terms;

-- Create the policy to allow public read access (matching existing DWS pattern)
CREATE POLICY "Allow public read access to glossary_terms"
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
WHERE tablename = 'glossary_terms';

