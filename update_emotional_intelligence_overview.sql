-- Update Emotional Intelligence competency to remove Overview heading and show Introduction first

UPDATE guides
SET body = REPLACE(
  body,
  '## Overview

### Introduction',
  '## Introduction'
)
WHERE slug = 'dq-competencies-emotional-intelligence';

-- Verify the update
SELECT slug, title, LEFT(body, 200) as body_preview
FROM guides
WHERE slug = 'dq-competencies-emotional-intelligence';
