-- Update communities_with_counts view to include activitylevel field
-- This allows filtering by activity level from the backend
-- 
-- IMPORTANT: This script drops and recreates the view to avoid column order conflicts

-- Drop the existing view first
DROP VIEW IF EXISTS communities_with_counts CASCADE;

-- Create view with safer NULL handling
-- Note: Using GROUP BY c.id only (PostgreSQL allows this if id is PRIMARY KEY)
-- This avoids issues with NULL values in other columns
CREATE VIEW communities_with_counts AS
SELECT 
    c.id,
    c.name,
    c.description,
    c.imageurl,
    c.category,
    c.created_at,
    COALESCE(c.isprivate, false) as isprivate,
    COALESCE(c.activemembers, 0) as activemembers,
    c.activitylevel,
    COUNT(DISTINCT m.user_id) AS member_count
FROM communities c
LEFT JOIN memberships m ON c.id = m.community_id
GROUP BY c.id;

COMMENT ON VIEW communities_with_counts IS 'View used by /communities page with activitylevel field for filtering';

-- Grant permissions (if needed)
GRANT SELECT ON communities_with_counts TO anon;
GRANT SELECT ON communities_with_counts TO authenticated;

