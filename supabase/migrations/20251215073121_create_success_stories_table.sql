-- Create success_stories table
-- Purpose: Store employee success stories/testimonials for the DQ Intranet
-- Affected tables: success_stories (new table)
-- Considerations: Public read access, authenticated users can create/update their own, admins can manage all

-- Create success_stories table
create table if not exists public.success_stories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  position text not null,
  company text not null default 'Digital Qatalyst',
  company_logo text,
  avatar text,
  quote text not null,
  full_quote text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  video_thumbnail text,
  video_url text,
  metric text,
  metric_label text,
  metric_color text check (metric_color in ('green', 'blue', 'orange', 'red')) default 'green',
  display_order integer default 0,
  is_published boolean default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index if not exists idx_success_stories_is_published on public.success_stories(is_published);
create index if not exists idx_success_stories_display_order on public.success_stories(display_order);
create index if not exists idx_success_stories_created_at on public.success_stories(created_at desc);
create index if not exists idx_success_stories_created_by on public.success_stories(created_by);

-- Create function to update updated_at timestamp
create or replace function update_success_stories_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_success_stories_updated_at
  before update on public.success_stories
  for each row
  execute function update_success_stories_updated_at();

-- Enable Row Level Security
alter table public.success_stories enable row level security;

-- RLS Policies for success_stories

-- Policy: Anyone can view published success stories
create policy "Anyone can view published success stories"
  on public.success_stories
  for select
  to anon, authenticated
  using (is_published = true);

-- Policy: Authenticated users can view all success stories (including unpublished)
create policy "Authenticated users can view all success stories"
  on public.success_stories
  for select
  to authenticated
  using (true);

-- Policy: Authenticated users can create success stories
create policy "Authenticated users can create success stories"
  on public.success_stories
  for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Policy: Users can update their own success stories
create policy "Users can update own success stories"
  on public.success_stories
  for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Policy: Admins can manage all success stories
create policy "Admins can manage all success stories"
  on public.success_stories
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- Policy: Users can delete their own success stories
create policy "Users can delete own success stories"
  on public.success_stories
  for delete
  to authenticated
  using (auth.uid() = created_by);

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant select on public.success_stories to anon, authenticated;
grant insert, update, delete on public.success_stories to authenticated;

-- Add comment to table
comment on table public.success_stories is 'Employee success stories and testimonials for DQ Intranet';

