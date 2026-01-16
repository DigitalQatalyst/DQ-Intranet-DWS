-- ============================================================================
-- Seed Data for News Table (Partial - Complete file is too large)
-- Matches NEWS array from src/data/media/news.ts
-- 
-- NOTE: This is a partial seed file. To generate the complete seed file,
-- use the Node.js script: scripts/generate-news-seed.js
-- Or manually extract all items from src/data/media/news.ts
-- ============================================================================

-- Sample entries (first 3 items as examples)
-- Replace this with all NEWS items from src/data/media/news.ts

INSERT INTO public.news (
  id, title, type, date, author, byline, views, excerpt, image,
  department, location, domain, tags, reading_time, news_type, news_source,
  focus_area, content, format, source, audio_url
) VALUES
(
  'dxb-eoy-event-postponement',
  'DXB EoY Event Postponement',
  'Announcement',
  '2025-12-19',
  'Fadil A',
  'DQ Operations',
  0,
  'Due to unfavourable weather conditions, the DQ Studios Y/E Annual Gathering scheduled for 19.12.2025 has been rescheduled for everyone''s safety.',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'DQ Operations',
  'Dubai',
  'Operations',
  ARRAY['event', 'postponement', 'annual gathering', 'weather'],
  '<5',
  'Company News',
  'DQ Operations',
  'Culture & People',
  '# DXB EoY Event Postponement

Due to unfavourable weather conditions, the DQ Studios Y/E Annual Gathering scheduled for 19.12.2025 has been rescheduled for everyone''s safety.

We sincerely apologise for the inconvenience and appreciate your understanding.

To ensure the date chosen is convenient for DXB Associates. I will be sharing a poll shortly to confirm a date. Once confirmed, details regarding the rescheduled date will be shared after.',
  NULL,
  NULL,
  NULL
),
(
  'dq-dxb-ksa-christmas-new-year-schedule',
  'DQ DXB & KSA | CHRISTMAS & NEW YEAR SCHEDULE AND WFH ARRANGEMENT',
  'Announcement',
  '2025-12-15',
  'Irene M',
  'DQ Operations',
  0,
  'In observance of the Christmas and New Year season, please note the work arrangements and holiday schedule for DXB and KSA associates, including official holidays and mandatory WFH days.',
  'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=1200&q=80',
  'DQ Operations',
  'Dubai',
  'Operations',
  ARRAY['holiday', 'christmas', 'new year', 'WFH', 'schedule'],
  '5–10',
  'Company News',
  'DQ Operations',
  'Culture & People',
  '# Christmas & New Year Schedule

In observance of the Christmas and New Year season, please note the work arrangements and holiday schedule for DXB and KSA associates, including official holidays and mandatory WFH days.

## | Official Holidays

The following days are designated as official holidays:

- Thursday, 25th December 2025 – Christmas Day
- Thursday, 1st January 2026 – New Year''s Day

## | Mandatory Work-From-Home (WFH) Days

All DXB and KSA associates are required to work from home on the following days:

- Friday, 26th December 2025
- Wednesday, 31st December 2025
- Friday, 2nd January 2026

## | WFH Daily Requirements

To ensure productivity and visibility, please adhere to these daily requirements:

- Log in to DQ Live.
- Join your designated working rooms.
- Share your morning activity.
- Submit a clear end-of-day report.

**Failure to comply will result in the day being treated as unpaid work day.**

## | Office Work Resumption

All other weekdays outside the dates listed above will follow the standard office work policy.

We wish everyone a safe, joyful, and restful festive season.',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  type = EXCLUDED.type,
  date = EXCLUDED.date,
  author = EXCLUDED.author,
  byline = EXCLUDED.byline,
  views = EXCLUDED.views,
  excerpt = EXCLUDED.excerpt,
  image = EXCLUDED.image,
  department = EXCLUDED.department,
  location = EXCLUDED.location,
  domain = EXCLUDED.domain,
  tags = EXCLUDED.tags,
  reading_time = EXCLUDED.reading_time,
  news_type = EXCLUDED.news_type,
  news_source = EXCLUDED.news_source,
  focus_area = EXCLUDED.focus_area,
  content = EXCLUDED.content,
  format = EXCLUDED.format,
  source = EXCLUDED.source,
  audio_url = EXCLUDED.audio_url,
  updated_at = NOW();

-- TODO: Add all remaining news items from src/data/media/news.ts
-- There are approximately 25+ news items that need to be added
-- Each item should follow the same INSERT format as above

