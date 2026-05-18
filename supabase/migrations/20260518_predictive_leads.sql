-- Predictive Seller Leads: feature store + prediction history

CREATE TABLE IF NOT EXISTS predictive_lead_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'IT',
  owner_name TEXT,
  features JSONB NOT NULL DEFAULT '{}',
  feature_vector REAL[] NOT NULL DEFAULT '{}',
  probability NUMERIC(4,3) NOT NULL DEFAULT 0,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'unlikely' CHECK (category IN ('very_likely', 'likely', 'possible', 'unlikely')),
  key_signals TEXT[] DEFAULT '{}',
  recommended_approach TEXT,
  property_value_estimate NUMERIC,
  data_source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feature store for ML training (append-only)
CREATE TABLE IF NOT EXISTS predictive_training_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_vector REAL[] NOT NULL,
  label BOOLEAN NOT NULL, -- did they actually list?
  prediction NUMERIC(4,3),
  features_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_predictive_leads_user ON predictive_lead_features(user_id);
CREATE INDEX idx_predictive_leads_category ON predictive_lead_features(user_id, category);
CREATE INDEX idx_predictive_leads_probability ON predictive_lead_features(probability DESC);
CREATE INDEX idx_predictive_leads_city ON predictive_lead_features(city, country);

-- RLS
ALTER TABLE predictive_lead_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_training_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own predictive leads"
  ON predictive_lead_features FOR ALL
  USING (auth.uid() = user_id);

-- Training data: admin only (service role)
CREATE POLICY "Service role manages training data"
  ON predictive_training_data FOR ALL
  USING (true);
