-- Migration: Complete Viva Engage-style Discussion Feed Schema
-- Description: Adds view_count to posts, ensures proper reaction/comment/views tables
--              with all required indexes, constraints, and RLS policies
-- Date: 2025-01-12

-- ============================================
-- STEP 1: Add view_count column to posts_v2
-- ============================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts_v2' 
    AND column_name = 'view_count'
  ) THEN
    ALTER TABLE posts_v2 
    ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
    
    -- Create index for view_count queries
    CREATE INDEX IF NOT EXISTS idx_posts_v2_view_count ON posts_v2(view_count DESC);
  END IF;
END $$;

-- ============================================
-- STEP 2: Ensure post_views table exists (from previous migration)
-- ============================================

CREATE TABLE IF NOT EXISTS post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts_v2(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT post_views_unique_user_post UNIQUE (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_user_id ON post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_post_views_created_at ON post_views(created_at DESC);

-- ============================================
-- STEP 3: Ensure reactions table has emoji column
-- ============================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_post_reactions_new' 
    AND column_name = 'emoji'
  ) THEN
    ALTER TABLE community_post_reactions_new 
    ADD COLUMN emoji TEXT;
  END IF;
END $$;

-- Ensure unique constraint: one reaction per user per post
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'reactions_unique_user_post'
  ) THEN
    -- Drop old constraint if exists
    ALTER TABLE community_post_reactions_new 
    DROP CONSTRAINT IF EXISTS reactions_unique_user_post_type;
    
    -- Add new constraint
    ALTER TABLE community_post_reactions_new 
    ADD CONSTRAINT reactions_unique_user_post UNIQUE (user_id, post_id);
  END IF;
END $$;

-- ============================================
-- STEP 4: Create function to update view_count on posts_v2
-- ============================================

CREATE OR REPLACE FUNCTION update_post_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts_v2
  SET view_count = (
    SELECT COUNT(DISTINCT user_id)
    FROM post_views
    WHERE post_id = NEW.post_id
  )
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_update_post_view_count ON post_views;
CREATE TRIGGER trigger_update_post_view_count
  AFTER INSERT OR DELETE ON post_views
  FOR EACH ROW
  EXECUTE FUNCTION update_post_view_count();

-- ============================================
-- STEP 5: Create view for posts with aggregated analytics
-- ============================================

CREATE OR REPLACE VIEW posts_with_analytics AS
SELECT 
  p.id,
  p.community_id,
  p.user_id as author_id,
  p.title,
  p.content,
  p.view_count,
  p.created_at,
  p.updated_at,
  -- Reaction counts by emoji
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.emoji = '👍'), 0) as like_count,
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.emoji = '❤️'), 0) as love_count,
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.emoji = '😄'), 0) as laugh_count,
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.emoji = '😮'), 0) as wow_count,
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.emoji = '🎉'), 0) as celebrate_count,
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.emoji = '👏'), 0) as clap_count,
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.emoji = '😢'), 0) as sad_count,
  COALESCE(COUNT(DISTINCT r.id), 0) as total_reactions,
  -- Comment count
  COALESCE(COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active'), 0) as comment_count,
  -- Unique view count (from post_views table)
  COALESCE(COUNT(DISTINCT pv.user_id), 0) as unique_view_count
FROM posts_v2 p
LEFT JOIN community_post_reactions_new r ON r.post_id = p.id
LEFT JOIN community_post_comments_new c ON c.post_id = p.id
LEFT JOIN post_views pv ON pv.post_id = p.id
GROUP BY p.id, p.community_id, p.user_id, p.title, p.content, p.view_count, p.created_at, p.updated_at;

-- ============================================
-- STEP 6: Create function to get post analytics
-- ============================================

CREATE OR REPLACE FUNCTION get_post_analytics(post_uuid UUID)
RETURNS TABLE (
  post_id UUID,
  view_count BIGINT,
  reaction_count BIGINT,
  comment_count BIGINT,
  reaction_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as post_id,
    COALESCE(COUNT(DISTINCT pv.user_id), 0)::BIGINT as view_count,
    COALESCE(COUNT(DISTINCT r.id), 0)::BIGINT as reaction_count,
    COALESCE(COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active'), 0)::BIGINT as comment_count,
    jsonb_object_agg(
      COALESCE(r.emoji, '👍'),
      COUNT(DISTINCT r.id)
    ) FILTER (WHERE r.emoji IS NOT NULL) as reaction_breakdown
  FROM posts_v2 p
  LEFT JOIN post_views pv ON pv.post_id = p.id
  LEFT JOIN community_post_reactions_new r ON r.post_id = p.id
  LEFT JOIN community_post_comments_new c ON c.post_id = p.id AND c.status = 'active'
  WHERE p.id = post_uuid
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 7: Create function for dashboard analytics
-- ============================================

CREATE OR REPLACE FUNCTION get_community_analytics(community_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  total_posts BIGINT,
  total_views BIGINT,
  total_reactions BIGINT,
  total_comments BIGINT,
  posts_by_type JSONB,
  engagement_funnel JSONB
) AS $$
DECLARE
  start_date TIMESTAMPTZ;
BEGIN
  start_date := NOW() - (days_back || ' days')::INTERVAL;
  
  RETURN QUERY
  SELECT 
    -- Total posts
    COUNT(DISTINCT p.id)::BIGINT as total_posts,
    -- Total views
    COALESCE(SUM(p.view_count), 0)::BIGINT as total_views,
    -- Total reactions
    COALESCE(COUNT(DISTINCT r.id), 0)::BIGINT as total_reactions,
    -- Total comments
    COALESCE(COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active'), 0)::BIGINT as total_comments,
    -- Posts by type
    jsonb_object_agg(
      COALESCE(p.metadata->>'type', 'discussion'),
      COUNT(DISTINCT p.id)
    ) FILTER (WHERE p.id IS NOT NULL) as posts_by_type,
    -- Engagement funnel
    jsonb_build_object(
      'viewed', COALESCE(COUNT(DISTINCT pv.user_id), 0),
      'reacted', COALESCE(COUNT(DISTINCT r.user_id), 0),
      'commented', COALESCE(COUNT(DISTINCT c.user_id), 0),
      'posted', COALESCE(COUNT(DISTINCT p.user_id), 0)
    ) as engagement_funnel
  FROM posts_v2 p
  LEFT JOIN post_views pv ON pv.post_id = p.id
  LEFT JOIN community_post_reactions_new r ON r.post_id = p.id
  LEFT JOIN community_post_comments_new c ON c.post_id = p.id AND c.status = 'active'
  WHERE p.community_id = community_uuid
    AND p.created_at >= start_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 8: RLS Policies (if not already set)
-- ============================================

-- Post views policies
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all post views" ON post_views;
CREATE POLICY "Users can view all post views"
  ON post_views FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own view" ON post_views;
CREATE POLICY "Users can insert their own view"
  ON post_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own view" ON post_views;
CREATE POLICY "Users can delete their own view"
  ON post_views FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 9: Grant permissions
-- ============================================

GRANT SELECT ON posts_with_analytics TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_post_analytics(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_community_analytics(UUID, INTEGER) TO authenticated, anon;

-- ============================================
-- STEP 10: Comments
-- ============================================

COMMENT ON COLUMN posts_v2.view_count IS 'Cached count of unique views (updated via trigger)';
COMMENT ON VIEW posts_with_analytics IS 'Posts with aggregated reaction, comment, and view counts';
COMMENT ON FUNCTION get_post_analytics(UUID) IS 'Returns analytics for a single post';
COMMENT ON FUNCTION get_community_analytics(UUID, INTEGER) IS 'Returns community analytics for dashboard';

