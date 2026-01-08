-- Migration: Add post views tracking and enhance reactions for Viva Engage-style emojis
-- Description: Creates post_views table, adds parent_id to comments for threading, 
--              and adds emoji column to reactions for proper emoji persistence
-- Date: 2025-01-12

-- ============================================
-- STEP 1: Create post_views table
-- ============================================

CREATE TABLE IF NOT EXISTS post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts_v2(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT post_views_unique_user_post UNIQUE (user_id, post_id)
);

-- Indexes for post_views
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_user_id ON post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_post_views_created_at ON post_views(created_at DESC);

-- ============================================
-- STEP 2: Add parent_id to comments for threading
-- ============================================

-- Add parent_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_post_comments_new' 
    AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE community_post_comments_new 
    ADD COLUMN parent_id UUID REFERENCES community_post_comments_new(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_community_post_comments_new_parent_id 
    ON community_post_comments_new(parent_id);
  END IF;
END $$;

-- ============================================
-- STEP 3: Add emoji column to reactions for proper emoji storage
-- ============================================

-- Add emoji column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_post_reactions_new' 
    AND column_name = 'emoji'
  ) THEN
    ALTER TABLE community_post_reactions_new 
    ADD COLUMN emoji TEXT;
    
    -- Update existing reactions with default emoji based on type
    UPDATE community_post_reactions_new 
    SET emoji = CASE 
      WHEN reaction_type = 'like' THEN '👍'
      WHEN reaction_type = 'helpful' THEN '🎉'
      WHEN reaction_type = 'insightful' THEN '💡'
      ELSE '👍'
    END
    WHERE emoji IS NULL;
  END IF;
END $$;

-- ============================================
-- STEP 4: Update reactions unique constraint to allow one reaction per user per post
-- ============================================

-- Drop old constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'reactions_unique_user_post_type'
  ) THEN
    ALTER TABLE community_post_reactions_new 
    DROP CONSTRAINT reactions_unique_user_post_type;
  END IF;
END $$;

-- Add new constraint: one reaction per user per post (regardless of type)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'reactions_unique_user_post'
  ) THEN
    ALTER TABLE community_post_reactions_new 
    ADD CONSTRAINT reactions_unique_user_post UNIQUE (user_id, post_id);
  END IF;
END $$;

-- ============================================
-- STEP 5: Add RLS policies for post_views
-- ============================================

ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all post views (for "Seen by X" display)
CREATE POLICY "Users can view all post views"
  ON post_views FOR SELECT
  USING (true);

-- Policy: Users can insert their own view
CREATE POLICY "Users can insert their own view"
  ON post_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own view (for re-tracking)
CREATE POLICY "Users can delete their own view"
  ON post_views FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 6: Create function to track post view
-- ============================================

CREATE OR REPLACE FUNCTION track_post_view(post_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO post_views (post_id, user_id)
  VALUES (post_uuid, auth.uid())
  ON CONFLICT (user_id, post_id) DO NOTHING;
END;
$$;

-- ============================================
-- STEP 7: Add comments
-- ============================================

COMMENT ON TABLE post_views IS 'Tracks unique views per user per post for "Seen by X" feature';
COMMENT ON COLUMN community_post_comments_new.parent_id IS 'Parent comment ID for threaded replies';
COMMENT ON COLUMN community_post_reactions_new.emoji IS 'Stored emoji character (👍, ❤️, 😄, etc.) for display';

