-- Complete Fix for glossary_terms RLS and Permissions
-- Run this entire script in Supabase SQL Editor

-- Define constants
\set TABLE_NAME 'glossary_terms'
\set SCHEMA_NAME 'public'
\set POLICY_NAME 'Allow public read access to glossary_terms'
\set VERIFICATION_MSG '=== VERIFICATION ==='

-- Step 1: Ensure schema permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 2: Drop existing policy
DROP POLICY IF EXISTS :'POLICY_NAME' ON public.glossary_terms;

-- Step 3: Ensure RLS is enabled
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

-- Step 4: Create the RLS policy (matching DWS pattern)
CREATE POLICY :'POLICY_NAME'
  ON public.glossary_terms
  FOR SELECT
  USING (true);

-- Step 5: Grant table permissions (THIS IS CRITICAL!)
GRANT SELECT ON public.glossary_terms TO anon;
GRANT SELECT ON public.glossary_terms TO authenticated;

-- Step 6: Verify everything
SELECT :'VERIFICATION_MSG' as step;

-- Check RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = :'TABLE_NAME';

-- Check policy exists
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies
WHERE tablename = :'TABLE_NAME';

-- Test query (should return count)
SELECT COUNT(*) as term_count FROM public.glossary_terms;

