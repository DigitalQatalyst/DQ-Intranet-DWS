-- ============================================================================
-- DQ Work Directory - Supabase Schema Setup
-- ============================================================================
-- This file contains all SQL needed to set up the Work Directory tables
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- A) TABLE CREATION
-- ============================================================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.work_associates CASCADE;
DROP TABLE IF EXISTS public.work_positions CASCADE;
DROP TABLE IF EXISTS public.work_units CASCADE;

-- Create work_units table
CREATE TABLE public.work_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector TEXT NOT NULL,
    unit_name TEXT NOT NULL,
    unit_type TEXT NOT NULL,
    mandate TEXT NOT NULL,
    location TEXT NOT NULL,
    focus_tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create work_positions table
CREATE TABLE public.work_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position_name TEXT NOT NULL,
    role_family TEXT NOT NULL,
    department TEXT NOT NULL,
    unit TEXT NOT NULL,
    location TEXT NOT NULL,
    sfia_rating TEXT NOT NULL,
    contract_type TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create work_associates table
CREATE TABLE public.work_associates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    current_role TEXT NOT NULL,
    department TEXT NOT NULL,
    unit TEXT NOT NULL,
    location TEXT NOT NULL,
    sfia_rating TEXT NOT NULL,
    status TEXT NOT NULL,
    email TEXT NOT NULL,
    teams_link TEXT NOT NULL,
    key_skills JSONB DEFAULT '[]'::jsonb,
    bio TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_work_units_unit_name ON public.work_units(unit_name);
CREATE INDEX idx_work_units_sector ON public.work_units(sector);
CREATE INDEX idx_work_units_location ON public.work_units(location);

CREATE INDEX idx_work_positions_position_name ON public.work_positions(position_name);
CREATE INDEX idx_work_positions_unit ON public.work_positions(unit);
CREATE INDEX idx_work_positions_location ON public.work_positions(location);

CREATE INDEX idx_work_associates_name ON public.work_associates(name);
CREATE INDEX idx_work_associates_unit ON public.work_associates(unit);
CREATE INDEX idx_work_associates_location ON public.work_associates(location);

-- ============================================================================
-- B) ROW LEVEL SECURITY (RLS) + POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.work_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_associates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to all users" ON public.work_units;
DROP POLICY IF EXISTS "Allow read access to all users" ON public.work_positions;
DROP POLICY IF EXISTS "Allow read access to all users" ON public.work_associates;

-- Create read-only policies for all users (anonymous access)
CREATE POLICY "Allow read access to all users"
    ON public.work_units
    FOR SELECT
    USING (true);

CREATE POLICY "Allow read access to all users"
    ON public.work_positions
    FOR SELECT
    USING (true);

CREATE POLICY "Allow read access to all users"
    ON public.work_associates
    FOR SELECT
    USING (true);

-- ============================================================================
-- C) SAMPLE DATA INSERTS
-- ============================================================================

-- Sample work_units
INSERT INTO public.work_units (sector, unit_name, unit_type, mandate, location, focus_tags) VALUES
(
    'DCO Operations',
    'DQ Sector – DCO Operations',
    'Sector',
    'Runs Studio operations and core delivery support for DQ.',
    'Dubai',
    '["Studio Ops", "Delivery", "Governance"]'::jsonb
),
(
    'DBP Platform',
    'DQ Sector – DBP Platform',
    'Sector',
    'Owns platform tools, integrations, and automation for DQ products.',
    'Nairobi',
    '["Platform", "Automation", "Tools"]'::jsonb
),
(
    'DCO Operations',
    'Factory – HRA (People)',
    'Factory',
    'Runs HRA operations, records, and people processes for DQ.',
    'Nairobi',
    '["People", "HR Ops", "Records"]'::jsonb
);

-- Sample work_positions
INSERT INTO public.work_positions (
    position_name, role_family, department, unit, location, 
    sfia_rating, contract_type, status, description, responsibilities
) VALUES
(
    'Senior Software Engineer',
    'Engineering',
    'DBP Platform',
    'DQ Sector – DBP Platform',
    'Nairobi',
    'L4',
    'Full-time',
    'Open',
    'Lead development of platform tools and automation systems.',
    '["Design system architecture", "Code review", "Mentor junior engineers", "Technical documentation"]'::jsonb
),
(
    'Product Manager',
    'Product',
    'DCO Operations',
    'DQ Sector – DCO Operations',
    'Dubai',
    'L5',
    'Full-time',
    'Open',
    'Drive product strategy and roadmap for DQ operations.',
    '["Define product vision", "Prioritize features", "Stakeholder management", "Market research"]'::jsonb
);

-- Sample work_associates
INSERT INTO public.work_associates (
    name, current_role, department, unit, location,
    sfia_rating, status, email, teams_link, key_skills, bio
) VALUES
(
    'Jane Smith',
    'Senior Software Engineer',
    'DBP Platform',
    'DQ Sector – DBP Platform',
    'Nairobi',
    'L4',
    'Active',
    'jane.smith@digitalqatalyst.com',
    'https://teams.microsoft.com/l/chat/0/0?users=jane.smith@digitalqatalyst.com',
    '["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"]'::jsonb,
    'Experienced full-stack engineer with 8+ years building scalable platforms. Passionate about clean code and mentoring.'
),
(
    'Ahmed Hassan',
    'Product Manager',
    'DCO Operations',
    'DQ Sector – DCO Operations',
    'Dubai',
    'L5',
    'Active',
    'ahmed.hassan@digitalqatalyst.com',
    'https://teams.microsoft.com/l/chat/0/0?users=ahmed.hassan@digitalqatalyst.com',
    '["Product Strategy", "Agile", "Stakeholder Management", "Data Analysis"]'::jsonb,
    'Strategic product leader with 10+ years transforming ideas into successful products. Expert in cross-functional collaboration.'
);



