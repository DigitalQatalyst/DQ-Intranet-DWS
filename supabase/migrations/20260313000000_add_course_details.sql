-- Add course_details column to lms_courses for extended body text
ALTER TABLE lms_courses
  ADD COLUMN IF NOT EXISTS course_details TEXT;
