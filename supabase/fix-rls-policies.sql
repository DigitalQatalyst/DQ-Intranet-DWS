-- Fix RLS Policies and Permissions for Media Center (News and Jobs)
-- Run this in your Supabase SQL Editor to fix 42501 "permission denied" errors

-- ===== Step 1: Grant permissions to anon role =====
-- This allows unauthenticated users to access the tables
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.news TO anon;
GRANT SELECT ON public.jobs TO anon;

-- Also grant to authenticated role (if users are logged in)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.news TO authenticated;
GRANT SELECT ON public.jobs TO authenticated;

-- ===== Step 2: Drop existing policies if they exist =====
DROP POLICY IF EXISTS news_select ON public.news;
DROP POLICY IF EXISTS jobs_select ON public.jobs;

-- ===== Step 3: Enable RLS =====
ALTER TABLE IF EXISTS public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.jobs ENABLE ROW LEVEL SECURITY;

-- ===== Step 4: Create public read access policies =====
-- These allow anyone (including unauthenticated users) to read from these tables
CREATE POLICY news_select ON public.news 
  FOR SELECT 
  USING (true);

CREATE POLICY jobs_select ON public.jobs 
  FOR SELECT 
  USING (true);

-- ===== Step 5: Verify setup =====
-- Check if permissions are granted:
-- SELECT grantee, privilege_type 
-- FROM information_schema.role_table_grants 
-- WHERE table_name IN ('news', 'jobs') AND grantee IN ('anon', 'authenticated');

-- Check if policies exist:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('news', 'jobs');

-- ===== Step 6: Test query (should work without authentication) =====
-- SELECT COUNT(*) FROM public.news;
-- SELECT COUNT(*) FROM public.jobs;

