-- Create table for storing guideline sections and structured content
CREATE TABLE IF NOT EXISTS guideline_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL, -- e.g., 'core-components', 'byod-procedure'
  section_title TEXT NOT NULL,
  section_order INTEGER NOT NULL,
  content_type TEXT NOT NULL, -- 'text', 'table', 'list'
  content JSONB, -- Flexible JSON structure for different content types
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guide_id, section_key)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_guideline_sections_guide_id ON guideline_sections(guide_id);
CREATE INDEX IF NOT EXISTS idx_guideline_sections_section_order ON guideline_sections(guide_id, section_order);

-- Enable RLS (Row Level Security)
ALTER TABLE guideline_sections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to guideline sections"
  ON guideline_sections
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage guideline sections"
  ON guideline_sections
  FOR ALL
  USING (auth.role() = 'authenticated');

COMMENT ON TABLE guideline_sections IS 'Stores structured content sections for guidelines';
COMMENT ON COLUMN guideline_sections.section_key IS 'Unique identifier for the section within a guide';
COMMENT ON COLUMN guideline_sections.content_type IS 'Type of content: text, table, list';
COMMENT ON COLUMN guideline_sections.content IS 'JSON structure containing the actual content data';
