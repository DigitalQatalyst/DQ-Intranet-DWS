# News Migration to Supabase - Instructions

## Problem
The `guides` table has a UUID `id` column with foreign key constraints from `guide_attachments` and `guide_steps` tables. This prevents us from inserting news items with text-based IDs like 'dxb-eoy-event-postponement'.

## Solution
Create a separate `news` table with TEXT id column, then use a view to combine both tables.

## Migration Steps

### Step 1: Create the News Table
Run this script in your Knowledge Hub Supabase SQL Editor:

```
db/supabase/08_create_news_table.sql
```

This will:
- Create a new `news` table with TEXT id column
- Create indexes for performance
- Enable Row Level Security (RLS)
- Create a policy for public read access
- Update the `v_media_all` view to UNION both `guides` and `news` tables

### Step 2: Insert News Data
Run this script in your Knowledge Hub Supabase SQL Editor:

```
db/supabase/09_insert_news_into_news_table.sql
```

This will insert all 36 news items from `src/data/media/news.ts` into the new `news` table.

### Step 3: Verify
Check that the news items are visible:

```sql
-- Check news table
SELECT COUNT(*) FROM public.news;

-- Check combined view
SELECT COUNT(*) FROM public.v_media_all WHERE type IN ('Announcement', 'Thought Leadership');

-- View latest news
SELECT id, title, type, date 
FROM public.v_media_all 
WHERE type IN ('Announcement', 'Thought Leadership')
ORDER BY date DESC 
LIMIT 10;
```

## What This Achieves

1. **Separate Storage**: News items are stored in their own table with appropriate data types
2. **Unified Access**: The `v_media_all` view combines both guides and news for easy querying
3. **No Breaking Changes**: Existing guides functionality remains unchanged
4. **Future-Proof**: Easy to add more news items or modify the news table structure

## Frontend Impact

The frontend components (`FeaturedNationalProgram.tsx`, `KnowledgeHub.tsx`) already query from `v_media_all` view, so they will automatically show the news items once the migration is complete.

No code changes needed!
