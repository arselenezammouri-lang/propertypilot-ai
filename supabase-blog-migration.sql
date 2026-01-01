-- =====================================================
-- PROPERTYCOPY PRO - BLOG SYSTEM
-- Blog Migration SQL for Supabase
-- =====================================================

-- Create blog_posts table
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  author_id uuid references public.profiles(id),
  status text not null default 'draft', -- 'draft', 'scheduled', 'published'
  published_at timestamptz,
  scheduled_for timestamptz,
  meta_title text,
  meta_description text,
  keywords text[],
  reading_time_minutes integer,
  views_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for faster lookups
create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_published_at on public.blog_posts(published_at desc);
create index if not exists idx_blog_posts_author on public.blog_posts(author_id);

-- Enable RLS
alter table public.blog_posts enable row level security;

-- Public can read published posts
create policy "Anyone can view published blog posts"
  on public.blog_posts for select
  using (status = 'published' and published_at <= now());

-- Authors can manage their own posts
create policy "Authors can view their own posts"
  on public.blog_posts for select
  using (auth.uid() = author_id);

create policy "Authors can create posts"
  on public.blog_posts for insert
  with check (auth.uid() = author_id);

create policy "Authors can update their own posts"
  on public.blog_posts for update
  using (auth.uid() = author_id);

create policy "Authors can delete their own posts"
  on public.blog_posts for delete
  using (auth.uid() = author_id);

-- Function to auto-publish scheduled posts
create or replace function public.publish_scheduled_posts()
returns void as $$
begin
  update public.blog_posts
  set 
    status = 'published',
    published_at = now(),
    updated_at = now()
  where status = 'scheduled'
    and scheduled_for <= now()
    and scheduled_for is not null;
end;
$$ language plpgsql security definer;

-- Function to increment view count
create or replace function public.increment_blog_views(post_slug text)
returns void as $$
begin
  update public.blog_posts
  set views_count = views_count + 1
  where slug = post_slug;
end;
$$ language plpgsql security definer;

-- =====================================================
-- NOTES:
-- 
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Set up a cron job to run publish_scheduled_posts() every hour
-- 3. Generate blog posts via AI using the /api/blog/generate endpoint
-- =====================================================
