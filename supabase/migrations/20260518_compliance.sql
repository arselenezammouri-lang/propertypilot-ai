-- Compliance Shield: EU real estate listing compliance reports
-- Stores compliance check results per listing per country

CREATE TABLE IF NOT EXISTS compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID,
  country TEXT NOT NULL CHECK (country IN ('IT', 'FR', 'ES', 'DE', 'UK', 'PT')),
  status TEXT NOT NULL DEFAULT 'needs_review' CHECK (status IN ('compliant', 'needs_review', 'non_compliant')),
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  checks JSONB NOT NULL DEFAULT '[]',
  ai_verification JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_compliance_reports_user ON compliance_reports(user_id);
CREATE INDEX idx_compliance_reports_listing ON compliance_reports(listing_id) WHERE listing_id IS NOT NULL;
CREATE INDEX idx_compliance_reports_country ON compliance_reports(user_id, country);

-- RLS
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own compliance reports"
  ON compliance_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create compliance reports"
  ON compliance_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own compliance reports"
  ON compliance_reports FOR DELETE
  USING (auth.uid() = user_id);
