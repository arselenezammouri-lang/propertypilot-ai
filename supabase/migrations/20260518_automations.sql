-- Speed-to-Lead Automations: automation configs, runs, and lead scoring v2

-- Automation configurations per user
CREATE TABLE IF NOT EXISTS automation_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  thresholds JSONB NOT NULL DEFAULT '{"auto_call": 90, "whatsapp": 80, "email": 60}',
  business_hours JSONB NOT NULL DEFAULT '{"start": 9, "end": 19, "timezone": "Europe/Rome", "days": [1,2,3,4,5]}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Automation run history
CREATE TABLE IF NOT EXISTS automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID,
  action TEXT NOT NULL CHECK (action IN ('auto_call', 'whatsapp', 'email', 'none')),
  score INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'triggered' CHECK (status IN ('triggered', 'executed', 'skipped', 'failed')),
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lead scoring v2 history (for ML training)
CREATE TABLE IF NOT EXISTS lead_scores_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID,
  score INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hot', 'warm', 'cold')),
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5,
  breakdown JSONB NOT NULL DEFAULT '{}',
  feature_vector REAL[] NOT NULL DEFAULT '{}',
  speed_to_lead_action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_automation_configs_user ON automation_configs(user_id);
CREATE INDEX idx_automation_runs_user ON automation_runs(user_id);
CREATE INDEX idx_automation_runs_created ON automation_runs(user_id, created_at DESC);
CREATE INDEX idx_lead_scores_v2_user ON lead_scores_v2(user_id);
CREATE INDEX idx_lead_scores_v2_lead ON lead_scores_v2(lead_id) WHERE lead_id IS NOT NULL;

-- RLS
ALTER TABLE automation_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own automation config"
  ON automation_configs FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users view own automation runs"
  ON automation_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own automation runs"
  ON automation_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own lead scores"
  ON lead_scores_v2 FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own lead scores"
  ON lead_scores_v2 FOR INSERT
  WITH CHECK (auth.uid() = user_id);
