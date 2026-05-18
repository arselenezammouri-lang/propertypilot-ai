-- GDPR Compliance: consent tracking, DSAR requests
-- EU-native: per-country consent management, 30-day DSAR deadline tracking

CREATE TABLE IF NOT EXISTS gdpr_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('marketing_email', 'marketing_sms', 'marketing_whatsapp', 'data_processing', 'analytics', 'third_party_sharing')),
  granted BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, consent_type)
);

CREATE TABLE IF NOT EXISTS gdpr_dsar_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_email TEXT NOT NULL,
  requester_name TEXT,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'deletion', 'rectification', 'portability', 'restriction')),
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'verified', 'processing', 'completed', 'rejected')),
  notes TEXT,
  response_data JSONB,
  completed_at TIMESTAMPTZ,
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gdpr_consents_user ON gdpr_consents(user_id);
CREATE INDEX idx_gdpr_dsar_user ON gdpr_dsar_requests(user_id);
CREATE INDEX idx_gdpr_dsar_status ON gdpr_dsar_requests(status) WHERE status != 'completed';

ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_dsar_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own consents" ON gdpr_consents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own DSARs" ON gdpr_dsar_requests FOR ALL USING (auth.uid() = user_id);
