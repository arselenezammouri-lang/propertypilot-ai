-- Embeddable chatbot conversations + GDPR tables
-- Tracks widget conversations for CRM lead capture

CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  message TEXT NOT NULL,
  reply TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'auto',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chatbot_agency ON chatbot_conversations(agency_user_id);
CREATE INDEX idx_chatbot_session ON chatbot_conversations(session_id);
CREATE INDEX idx_chatbot_email ON chatbot_conversations(visitor_email) WHERE visitor_email IS NOT NULL;

ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agency views own chatbot conversations" ON chatbot_conversations FOR SELECT USING (auth.uid() = agency_user_id);
CREATE POLICY "Public can insert chatbot messages" ON chatbot_conversations FOR INSERT WITH CHECK (true);
