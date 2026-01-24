-- Migration: Add lead_score to external_listings table
-- This field stores AI-generated quality score (0-100) for each listing

ALTER TABLE public.external_listings 
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT NULL CHECK (lead_score >= 0 AND lead_score <= 100);

-- Add index for faster filtering by lead_score
CREATE INDEX IF NOT EXISTS idx_external_listings_lead_score 
ON public.external_listings(user_id, lead_score DESC) 
WHERE lead_score IS NOT NULL;

-- Add comment
COMMENT ON COLUMN public.external_listings.lead_score IS 'AI-generated quality score (0-100). Higher scores indicate better opportunities (underpriced, urgent sales, etc.)';

