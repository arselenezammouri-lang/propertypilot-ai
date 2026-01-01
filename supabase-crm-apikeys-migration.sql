-- =====================================================
-- PROPILOT AI - CRM 2.5 API KEYS MIGRATION
-- Migration SQL for Supabase
-- Version: 2.5 (Smart Lead Capture + API Keys)
-- =====================================================

-- =====================================================
-- TABLE: USER_API_KEYS
-- API keys for external lead capture forms
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  api_key VARCHAR(64) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  auto_lead_score BOOLEAN DEFAULT false,
  auto_followup BOOLEAN DEFAULT false,
  default_market VARCHAR(20) DEFAULT 'italy' CHECK (default_market IN ('italy', 'usa')),
  leads_captured INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes for user_api_keys table
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id ON public.user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_api_key ON public.user_api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_is_active ON public.user_api_keys(is_active);

-- Enable RLS for user_api_keys
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_api_keys
CREATE POLICY "Users can view own api keys"
  ON public.user_api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api keys"
  ON public.user_api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own api keys"
  ON public.user_api_keys FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own api keys"
  ON public.user_api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Validate API Key (for public endpoint)
-- Returns user_id if valid, NULL if invalid/expired
-- =====================================================
CREATE OR REPLACE FUNCTION public.validate_api_key(p_api_key VARCHAR)
RETURNS TABLE (
  user_id UUID,
  auto_lead_score BOOLEAN,
  auto_followup BOOLEAN,
  default_market VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uak.user_id,
    uak.auto_lead_score,
    uak.auto_followup,
    uak.default_market
  FROM public.user_api_keys uak
  WHERE uak.api_key = p_api_key
    AND uak.is_active = true
    AND (uak.expires_at IS NULL OR uak.expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Increment leads_captured counter
-- =====================================================
CREATE OR REPLACE FUNCTION public.increment_leads_captured(p_api_key VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_api_keys
  SET 
    leads_captured = leads_captured + 1,
    last_used_at = NOW()
  WHERE api_key = p_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Add source and property_url columns to leads table
-- (for tracking where leads came from)
-- =====================================================
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS property_url TEXT;

-- =====================================================
-- NOTES FOR DEPLOYMENT:
-- 
-- 1. Run this SQL in Supabase SQL Editor
-- 2. After running, verify:
--    - user_api_keys table created
--    - validate_api_key function exists
--    - increment_leads_captured function exists
--    - source/property_url columns added to leads
-- 3. Test API key generation and validation
-- =====================================================
