-- DQ Glossary Terms Table
-- Creates the glossary_terms table for the DQ Glossary Marketplace

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create glossary_terms table
CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_definition TEXT NOT NULL,
  full_definition TEXT NOT NULL,
  category TEXT NOT NULL,
  used_in TEXT[] NOT NULL DEFAULT '{}',
  related_terms TEXT[] DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('Active', 'Deprecated')),
  owner TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_glossary_terms_slug ON glossary_terms(slug);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_glossary_terms_status ON glossary_terms(status);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_glossary_terms_category ON glossary_terms(category);

-- Enable Row Level Security
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (matching existing DWS pattern)
-- Drop policy if it exists to allow re-running the script
DROP POLICY IF EXISTS "Allow public read access to glossary_terms" ON glossary_terms;

CREATE POLICY "Allow public read access to glossary_terms"
  ON glossary_terms
  FOR SELECT
  USING (true);

-- Add comment to table
COMMENT ON TABLE glossary_terms IS 'DQ Glossary Terms - Authoritative operational definitions for DWS, L24, and Governance';

