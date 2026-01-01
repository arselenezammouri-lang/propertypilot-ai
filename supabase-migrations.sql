-- =====================================================
-- PROPERTYCOPY PRO - PRODUCTION UPDATES
-- Migration SQL for Supabase
-- =====================================================

-- STEP 1 & 2: Generation tracking and rate limiting
-- Create generation_logs table to track all AI generations
create table if not exists public.generation_logs (
  id serial primary key,
  user_id uuid references public.profiles(id) not null,
  ip_address text,
  created_at timestamptz default now()
);

-- Index for fast rate limit lookups
create index if not exists idx_generation_logs_user_created 
  on public.generation_logs(user_id, created_at);

create index if not exists idx_generation_logs_ip_created 
  on public.generation_logs(ip_address, created_at);

-- Enable RLS
alter table public.generation_logs enable row level security;

-- Users can view their own generation logs
create policy "Users can view own generation logs"
  on public.generation_logs for select
  using (auth.uid() = user_id);

-- STEP 2: Add generations_count to subscriptions table
alter table public.subscriptions 
  add column if not exists generations_count integer default 0;

-- Add unique constraint on user_id (required for upsert in increment function)
-- This ensures each user has only one subscription record
do $$ 
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'subscriptions_user_id_key'
  ) then
    alter table public.subscriptions 
      add constraint subscriptions_user_id_key unique (user_id);
  end if;
end $$;

-- Create atomic increment function for generation count
-- This prevents race conditions when multiple requests are processed concurrently
-- Uses upsert pattern to ensure subscription row exists
create or replace function public.increment_generation_count(p_user_id uuid)
returns void as $$
begin
  -- Upsert: increment if exists, create if not
  insert into public.subscriptions (id, user_id, status, generations_count, updated_at)
  values (gen_random_uuid()::text, p_user_id, 'free', 1, now())
  on conflict (user_id)
  do update set
    generations_count = coalesce(public.subscriptions.generations_count, 0) + 1,
    updated_at = now();
end;
$$ language plpgsql security definer;

-- Create function to clean old generation logs (older than 24 hours)
-- This keeps the table lean and improves performance
create or replace function public.cleanup_old_generation_logs()
returns void as $$
begin
  delete from public.generation_logs
  where created_at < now() - interval '24 hours';
end;
$$ language plpgsql security definer;

-- You can run this function manually or set up a cron job
-- To run manually: SELECT cleanup_old_generation_logs();

-- =====================================================
-- NOTES FOR DEPLOYMENT:
-- 
-- 1. Run this SQL in Supabase SQL Editor
-- 2. After running, verify tables created:
--    - generation_logs (tracks all generations)
--    - subscriptions has generations_count field
-- 
-- 3. Optional: Set up Supabase cron job to run cleanup daily
--    (Supabase Dashboard → Database → Cron Jobs)
-- =====================================================
