-- =============================================
-- CRM 3.0 - Automation Center Migration
-- =============================================
-- Run this migration in Supabase SQL Editor
-- AFTER running supabase-crm-migration.sql and supabase-crm-apikeys-migration.sql

-- 1. Create automations_rules table
CREATE TABLE IF NOT EXISTS automations_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('new_lead', 'score_updated', 'status_changed', 'priority_changed', 'market_changed')),
  condition JSONB NOT NULL DEFAULT '{}',
  action JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  execution_count INTEGER NOT NULL DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create automations_assignments table (for lead routing)
CREATE TABLE IF NOT EXISTS automations_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  assigned_to TEXT NOT NULL,
  assigned_by TEXT,
  rule_id UUID REFERENCES automations_rules(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create automations_logs table (execution history)
CREATE TABLE IF NOT EXISTS automations_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  rule_id UUID NOT NULL REFERENCES automations_rules(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  trigger_type TEXT NOT NULL,
  condition_matched JSONB,
  action_applied JSONB,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_automations_rules_user_id ON automations_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_rules_trigger_type ON automations_rules(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automations_rules_is_active ON automations_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_automations_assignments_user_id ON automations_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_assignments_lead_id ON automations_assignments(lead_id);
CREATE INDEX IF NOT EXISTS idx_automations_logs_user_id ON automations_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_logs_rule_id ON automations_logs(rule_id);
CREATE INDEX IF NOT EXISTS idx_automations_logs_lead_id ON automations_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_automations_logs_created_at ON automations_logs(created_at DESC);

-- 5. Create updated_at trigger for automations_rules
CREATE OR REPLACE FUNCTION update_automations_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_automations_rules_updated_at ON automations_rules;
CREATE TRIGGER trigger_automations_rules_updated_at
  BEFORE UPDATE ON automations_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_automations_rules_updated_at();

-- 6. Enable RLS
ALTER TABLE automations_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations_logs ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for automations_rules
DROP POLICY IF EXISTS "Users can view own automation rules" ON automations_rules;
CREATE POLICY "Users can view own automation rules" ON automations_rules
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own automation rules" ON automations_rules;
CREATE POLICY "Users can insert own automation rules" ON automations_rules
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own automation rules" ON automations_rules;
CREATE POLICY "Users can update own automation rules" ON automations_rules
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own automation rules" ON automations_rules;
CREATE POLICY "Users can delete own automation rules" ON automations_rules
  FOR DELETE USING (auth.uid()::text = user_id);

-- 8. RLS Policies for automations_assignments
DROP POLICY IF EXISTS "Users can view own assignments" ON automations_assignments;
CREATE POLICY "Users can view own assignments" ON automations_assignments
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own assignments" ON automations_assignments;
CREATE POLICY "Users can insert own assignments" ON automations_assignments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own assignments" ON automations_assignments;
CREATE POLICY "Users can update own assignments" ON automations_assignments
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own assignments" ON automations_assignments;
CREATE POLICY "Users can delete own assignments" ON automations_assignments
  FOR DELETE USING (auth.uid()::text = user_id);

-- 9. RLS Policies for automations_logs
DROP POLICY IF EXISTS "Users can view own automation logs" ON automations_logs;
CREATE POLICY "Users can view own automation logs" ON automations_logs
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own automation logs" ON automations_logs;
CREATE POLICY "Users can insert own automation logs" ON automations_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Service role policies for server-side operations
DROP POLICY IF EXISTS "Service role full access to automations_rules" ON automations_rules;
CREATE POLICY "Service role full access to automations_rules" ON automations_rules
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access to automations_assignments" ON automations_assignments;
CREATE POLICY "Service role full access to automations_assignments" ON automations_assignments
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access to automations_logs" ON automations_logs;
CREATE POLICY "Service role full access to automations_logs" ON automations_logs
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- CONDITION JSONB EXAMPLES:
-- =============================================
-- Score condition: { "field": "lead_score", "operator": "gt", "value": 70 }
-- Status condition: { "field": "status", "operator": "eq", "value": "new" }
-- Priority condition: { "field": "priorita", "operator": "eq", "value": "high" }
-- Market condition: { "field": "market", "operator": "eq", "value": "italy" }
-- Multiple conditions (AND): { "all": [{ "field": "lead_score", "operator": "gt", "value": 70 }, { "field": "status", "operator": "eq", "value": "new" }] }
-- Multiple conditions (OR): { "any": [{ "field": "lead_score", "operator": "gt", "value": 80 }, { "field": "priorita", "operator": "eq", "value": "high" }] }

-- =============================================
-- ACTION JSONB EXAMPLES:
-- =============================================
-- Change status: { "type": "update_status", "value": "followup" }
-- Change priority: { "type": "update_priority", "value": "high" }
-- Assign to agent: { "type": "assign_to", "value": "agent@email.com" }
-- Send email: { "type": "send_email", "template": "followup_1day" }
-- Add note: { "type": "add_note", "value": "Automazione applicata: Lead prioritario" }
-- Multiple actions: { "actions": [{ "type": "update_status", "value": "followup" }, { "type": "add_note", "value": "Automazione eseguita" }] }
