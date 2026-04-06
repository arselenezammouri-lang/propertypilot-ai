-- Migration: add_agency_profile_columns
-- Adds columns needed for public agency profile pages

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agency_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agency_slug TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['Italian', 'English'];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialties TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Index for fast lookup by slug
CREATE INDEX IF NOT EXISTS idx_profiles_agency_slug ON public.profiles(agency_slug) WHERE agency_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_public ON public.profiles(is_public) WHERE is_public = true;
