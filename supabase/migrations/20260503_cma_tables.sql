-- PropertyPilot AI — CMA / Valuation Tables
-- Run in Supabase SQL editor

-- CMA Reports
CREATE TABLE IF NOT EXISTS cma_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_address text,
  property_city text,
  valuation_low numeric(12,2),
  valuation_expected numeric(12,2),
  valuation_high numeric(12,2),
  confidence_score integer DEFAULT 0,
  comparables_count integer DEFAULT 0,
  methodology text,
  report_data jsonb, -- full CMAReport JSON
  pdf_url text,
  status text DEFAULT 'completed', -- draft, completed, sent
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cma_user ON cma_reports(user_id);
ALTER TABLE cma_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own CMA" ON cma_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own CMA" ON cma_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own CMA" ON cma_reports FOR UPDATE USING (auth.uid() = user_id);

-- Listings history (for trend analysis)
CREATE TABLE IF NOT EXISTS listings_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source_listing_id text,
  source text, -- immobiliare, idealista, rightmove, etc.
  price numeric(12,2),
  sqm numeric(8,2),
  rooms integer,
  status text DEFAULT 'active', -- active, sold, removed
  country text DEFAULT 'IT',
  zone text,
  city text,
  captured_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lh_zone ON listings_history(zone, country);
CREATE INDEX IF NOT EXISTS idx_lh_date ON listings_history(captured_at);

-- CMA citations (AI Citations pattern)
CREATE TABLE IF NOT EXISTS cma_citations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id uuid NOT NULL REFERENCES cma_reports(id) ON DELETE CASCADE,
  data_type text NOT NULL, -- comparable, trend, valuation, zone_stat
  source_url text,
  source_name text,
  claim_text text,
  value text,
  captured_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_citation_report ON cma_citations(report_id);

-- Add cma_reports_generated to usage_credits
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usage_credits' AND column_name = 'cma_reports_generated') THEN
    ALTER TABLE usage_credits ADD COLUMN cma_reports_generated integer DEFAULT 0;
  END IF;
END $$;
