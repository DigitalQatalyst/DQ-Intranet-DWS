-- ============================================================================
-- Seed Data: Podcasts (podcast episodes for both series)
-- Populates public.news with items for the "Podcasts" tab.
-- Items come from NewsItem where format = 'Podcast' (or tagged as podcasts).
-- ============================================================================

INSERT INTO public.news (
  id, title, type, date, author, byline, views, excerpt, image,
  department, location, domain, tags, reading_time, news_type, news_source,
  focus_area, content, format, source, audio_url
) VALUES
-- Example Action-Solver episode: Why Execution Beats Intelligence
(
  'why-execution-beats-intelligence',
  'Why Execution Beats Intelligence: The Real Driver of Growth in DQ',
  'Thought Leadership',
  '2024-12-01',
  'DQ Leadership',
  'DQ Leadership',
  0,
  'Explore how execution and consistent action drive real growth at DQ, and why intelligence alone isn''t enough to achieve organizational success.',
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
  'DQ Leadership',
  NULL,
  'Business',
  ARRAY['podcast','execution','growth','leadership','strategy'],
  '20+',
  'Company News',
  'DQ Leadership',
  'Culture & People',
  '# Why Execution Beats Intelligence: The Real Driver of Growth in DQ — see src/data/media/news.ts for full markdown content.',
  'Podcast',
  'DigitalQatalyst',
  '/Podcasts/Execution_Beats_Intelligence__Why_Action_Wins.m4a'
),
-- Example Execution Mindset episode: Ownership Mindset (Series 2)
(
  'ownership-mindset-single-driver',
  'Ownership Mindset: Why Every Task Needs a Single Driver',
  'Thought Leadership',
  '2025-01-10',
  'DQ Leadership',
  'DQ Leadership',
  0,
  'Explore why every task needs a single, clearly named owner and how ownership mindset accelerates execution across teams.',
  NULL,
  'DQ Leadership',
  NULL,
  'People',
  ARRAY['podcast','execution mindset','ownership','series-2'],
  '20+',
  'Company News',
  'DQ Leadership',
  'Culture & People',
  '# Ownership Mindset: Why Every Task Needs a Single Driver — see src/data/media/news.ts for full markdown content.',
  'Podcast',
  'DigitalQatalyst',
  '/02. Series 02 - The Execution Mindset/Ep 1_Ownership Mindset - Why Every Task Needs a Single Driver.m4a'
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

-- TODO: Add additional INSERT statements here for all podcast episodes (Action-Solver
-- and The Execution Mindset series) from src/data/media/news.ts.
