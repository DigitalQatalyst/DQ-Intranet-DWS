-- Add saved_for_later column to lms_course_progress
-- Allows users to bookmark courses for later viewing

ALTER TABLE lms_course_progress
  ADD COLUMN IF NOT EXISTS saved_for_later BOOLEAN NOT NULL DEFAULT false;

-- Partial index for efficient "fetch all saved courses for a user" queries
CREATE INDEX IF NOT EXISTS idx_course_progress_saved
  ON lms_course_progress(user_id, saved_for_later)
  WHERE saved_for_later = true;
