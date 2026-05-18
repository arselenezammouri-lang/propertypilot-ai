-- Market Reports: weekly auto-generated market intelligence

-- Report configurations per user
CREATE TABLE IF NOT EXISTS market_report_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  countries TEXT[] NOT NULL DEFAULT '{"IT"}',
  cities TEXT[] NOT NULL DEFAULT '{}',
  send_day INTEGER NOT NULL DEFAULT 0 CHECK (send_day >= 0 AND send_day <= 6),
  send_hour INTEGER NOT NULL DEFAULT 6 CHECK (send_hour >= 0 AND send_hour <= 23),
  include_pdf BOOLEAN NOT NULL DEFAULT true,
  white_label BOOLEAN NOT NULL DEFAULT false,
  recipients TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Generated market reports
CREATE TABLE IF NOT EXISTS market_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_date DATE NOT NULL,
  country TEXT NOT NULL,
  cities TEXT[] NOT NULL DEFAULT '{}',
  indices JSONB NOT NULL DEFAULT '[]',
  summary TEXT NOT NULL DEFAULT '',
  highlights TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  pdf_url TEXT,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_market_report_configs_user ON market_report_configs(user_id);
CREATE INDEX idx_market_reports_user ON market_reports(user_id);
CREATE INDEX idx_market_reports_date ON market_reports(user_id, report_date DESC);
CREATE INDEX idx_market_reports_country ON market_reports(country, report_date DESC);

-- RLS
ALTER TABLE market_report_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own report config"
  ON market_report_configs FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users view own reports"
  ON market_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System creates reports"
  ON market_reports FOR INSERT
  WITH CHECK (true);
