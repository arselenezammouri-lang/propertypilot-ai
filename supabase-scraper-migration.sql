-- =====================================================
-- PROPERTYCOPY PRO - SCRAPER FEATURE
-- Migration SQL for saved_listings table
-- =====================================================

-- Add new columns for scraper feature
alter table public.saved_listings 
  add column if not exists source_url text,
  add column if not exists scraped_data jsonb;

-- Create index for faster lookups by source URL
create index if not exists idx_saved_listings_source_url 
  on public.saved_listings(source_url);

-- =====================================================
-- NOTES:
-- 
-- 1. Run this SQL in Supabase SQL Editor
-- 2. source_url stores the original listing URL
-- 3. scraped_data stores the raw extracted data from the listing
-- =====================================================
