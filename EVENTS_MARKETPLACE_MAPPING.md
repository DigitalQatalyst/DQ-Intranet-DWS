# Events Marketplace Database Mapping

## Database Schema Overview

### Primary Source: `upcoming_events` View
The `upcoming_events` view combines events from:
1. **`events_v2` table** - Main events table with rich schema
2. **`posts` table** - Community posts with `post_type = 'event'`

### events_v2 Table Structure
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    category TEXT NOT NULL,  -- Enum: 'Internal', 'Client', 'Training', 'Launches', etc.
    location TEXT NOT NULL,
    image_url TEXT,
    meeting_link TEXT,
    is_virtual BOOLEAN DEFAULT false,
    is_all_day BOOLEAN DEFAULT false,
    max_attendees INTEGER,
    registration_required BOOLEAN DEFAULT false,
    registration_deadline TIMESTAMPTZ,
    organizer_id UUID,
    organizer_name TEXT NOT NULL,
    organizer_email TEXT,
    status TEXT DEFAULT 'published',  -- Enum: 'published', 'draft', 'cancelled'
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Upcoming Events View Structure
The view provides a unified interface with these columns:
- `id`, `title`, `description`
- `start_time`, `end_time` (TIMESTAMPTZ)
- `category` (from events table or derived from community_id)
- `location` (from events table or posts.event_location)
- `image_url`, `meeting_link`
- `is_virtual`, `is_all_day`
- `max_attendees`, `registration_required`, `registration_deadline`
- `organizer_id`, `organizer_name`, `organizer_email`
- `status`, `is_featured`
- `tags` (TEXT[])
- `created_at`, `updated_at`

## Mapping to Marketplace Format

### Database → Marketplace Event Mapping

| Database Field | Marketplace Field | Transformation |
|---------------|-------------------|----------------|
| `id` | `id` | Direct mapping |
| `title` | `title` | Direct mapping |
| `description` | `description` | Direct mapping, fallback to empty string |
| `category` | `category` | Direct mapping, default "General" |
| `category` | `eventType` | Same as category |
| - | `businessStage` | Always "All Stages" (default) |
| `organizer_name` | `provider.name` | Use organizer_name if available, else "DQ Events" |
| - | `provider.logoUrl` | Always "/DWS-Logo.png" |
| `organizer_name` | `provider.description` | "{organizer_name} Events" or "Digital Qatalyst Events" |
| `start_time` | `date` | Formatted as "Month Day, Year" (e.g., "November 14, 2025") |
| `start_time`, `end_time` | `time` | Formatted as "HH:MM AM/PM - HH:MM AM/PM" |
| `location` | `location` | Direct mapping, append "Virtual - " if is_virtual and has meeting_link |
| - | `price` | Always "Free" (default) |
| `max_attendees` | `capacity` | Formatted as "{max_attendees} attendees" if available |
| `tags` | `tags` | Direct mapping, default empty array |
| `image_url` | `imageUrl` | Direct mapping if available |

### Query Implementation

The code uses a fallback strategy to ensure events are always fetched:

```typescript
// Strategy 1: Primary - Query events_v2 table directly
const eventsQuery = await supabaseClient
  .from("events_v2")
  .select("*")
  .eq("status", "published")  // Only published events
  .gte("start_time", now)      // Only future events
  .order("start_time", { ascending: true });

// Strategy 2: Fallback - Query upcoming_events view
const viewQuery = await supabaseClient
  .from("upcoming_events")
  .select("*")
  .eq("status", "published")
  .gte("start_time", now)
  .order("start_time", { ascending: true });

// Strategy 3: Last resort - Query posts table
const postsQuery = await supabaseClient
  .from("posts")
  .select("id, title, content, event_date, event_location, post_type, community_id, created_by, created_at, tags, status")
  .eq("post_type", "event")
  .eq("status", "active")
  .not("event_date", "is", null)
  .gte("event_date", now)
  .order("event_date", { ascending: true });
```

### Transformation Function

The `transformEventToMarketplace` function:
1. **Detects event source**: Checks for `start_time`/`end_time` (view/events table) vs `post_type` (posts table)
2. **Extracts data**: Pulls all relevant fields from the event object
3. **Formats dates**: Converts ISO timestamps to human-readable format
4. **Formats time range**: Shows start and end time if both available
5. **Sets defaults**: Provides fallback values for missing fields
6. **Maps provider**: Uses organizer_name from database or defaults to "DQ Events"

### Current Database Status

- **events_v2 table**: 12 events
- **Posts table (event type)**: 2 events  
- **upcoming_events view**: 12 events (combines both sources)

### Sample Event Data

```json
{
  "id": "b8efd41f-d9fc-44db-98de-d48d820d4937",
  "title": "Digital Qatalyst Town Hall",
  "description": "Quarterly company-wide meeting...",
  "start_time": "2025-11-14T10:00:00.000Z",
  "end_time": "2025-11-14T11:30:00.000Z",
  "category": "Internal",
  "location": "Main Conference Room + Zoom",
  "image_url": "https://images.unsplash.com/...",
  "meeting_link": "https://zoom.us/j/123456789",
  "is_virtual": false,
  "max_attendees": 200,
  "registration_required": true,
  "organizer_name": "DQ Events Team",
  "status": "published",
  "is_featured": true,
  "tags": ["Town Hall", "Quarterly", "All Hands"]
}
```

### Marketplace Display Format

After transformation, the event appears as:
- **Title**: "Digital Qatalyst Town Hall"
- **Date**: "November 14, 2025"
- **Time**: "10:00 AM - 11:30 AM"
- **Location**: "Main Conference Room + Zoom"
- **Provider**: "DQ Events Team"
- **Capacity**: "200 attendees"
- **Category**: "Internal"
- **Tags**: ["Town Hall", "Quarterly", "All Hands"]
- **Image**: Uses image_url from database

## Filtering & Search

The marketplace supports:
- **Search**: Searches across title, description, category, eventType, location, and tags
- **Filters**: Based on `filterConfig` from marketplace config
  - Event Type (maps to category)
  - Delivery Mode (maps to location/virtual status)
  - Cost Type (currently all "Free")
  - Business Stage (default "All Stages")

## Notes

1. **Query Strategy**: The code now queries the `events_v2` table first (primary source), then falls back to `upcoming_events` view, and finally to `posts` table if needed.

2. **Column Names**: The `events_v2` table uses `start_time` and `end_time` (TIMESTAMPTZ), NOT `event_date` and `event_time`. This was a critical fix.

3. **Error Handling**: The code now handles:
   - 401 errors (authentication/RLS issues)
   - 400 errors (bad requests - usually wrong column names)
   - Empty result sets
   - Permission denied errors (42501, PGRST301)

4. **Transformation**: The transformation function handles all three sources:
   - `events` table and `upcoming_events` view (same structure)
   - `posts` table (legacy format with different field names)

5. **RLS Policies**: If you encounter 401 errors, ensure RLS policies allow:
   - Anonymous users to SELECT from `events` table where `status = 'published'`
   - Or authenticate users properly before querying

6. **Future enhancements could include**:
   - Pricing information (currently all "Free")
   - Business stage mapping based on event category
   - Registration link integration
   - RSVP status for logged-in users
   - Better RLS policy configuration for public access

