-- Supplementary migration: Create tables that the code references
-- but were not included in schema.sql or previous migrations.
-- Run AFTER all 15 previous migrations.

-- Activities (activity log / audit trail)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID,
  type TEXT NOT NULL DEFAULT 'note',
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own activities" ON activities FOR ALL USING (auth.uid() = user_id);

-- Brand Voice Profiles (AI writing style per agency)
CREATE TABLE IF NOT EXISTS brand_voice_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Default',
  tone TEXT NOT NULL DEFAULT 'professional',
  style TEXT NOT NULL DEFAULT 'standard',
  example_text TEXT,
  keywords TEXT[] DEFAULT '{}',
  avoid_words TEXT[] DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'it',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_brand_voice_user ON brand_voice_profiles(user_id);
ALTER TABLE brand_voice_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own brand voices" ON brand_voice_profiles FOR ALL USING (auth.uid() = user_id);

-- Calls (voice call records — base table for voice agent)
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID,
  bland_call_id TEXT,
  phone_number TEXT,
  direction TEXT DEFAULT 'outbound',
  status TEXT DEFAULT 'pending',
  pathway TEXT,
  language TEXT DEFAULT 'it',
  duration_seconds INTEGER DEFAULT 0,
  recording_url TEXT,
  transcript TEXT,
  summary TEXT,
  outcome TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_calls_user ON calls(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_lead ON calls(lead_id) WHERE lead_id IS NOT NULL;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own calls" ON calls FOR ALL USING (auth.uid() = user_id);

-- Email Logs (transactional + campaign email tracking)
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resend_id TEXT,
  to_email TEXT NOT NULL,
  subject TEXT,
  template TEXT,
  status TEXT DEFAULT 'sent',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_logs_user ON email_logs(user_id);
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own emails" ON email_logs FOR ALL USING (auth.uid() = user_id);

-- Portal Connections (portal integration configs per agency)
CREATE TABLE IF NOT EXISTS portal_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portal_id TEXT NOT NULL,
  portal_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  credentials_encrypted TEXT,
  config JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  leads_imported INTEGER DEFAULT 0,
  listings_published INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_portal_conn_user ON portal_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_conn_status ON portal_connections(status) WHERE status = 'active';
ALTER TABLE portal_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own portals" ON portal_connections FOR ALL USING (auth.uid() = user_id);
