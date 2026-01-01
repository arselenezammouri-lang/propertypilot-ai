-- =====================================================
-- CRM 4.0 - Communication Hub Migration
-- Propilot AI - Communication Center for Leads
-- =====================================================

-- Communication Logs Table
-- Stores all sent/received communications with leads
CREATE TABLE IF NOT EXISTS communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
    direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('outbound', 'inbound')),
    subject TEXT,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication Templates Table
-- User-defined templates for quick messaging
CREATE TABLE IF NOT EXISTS communication_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
    name TEXT NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'emotional', 'luxury', 'casual', 'urgent')),
    variables TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_communication_logs_lead_id ON communication_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_user_id ON communication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_channel ON communication_logs(channel);
CREATE INDEX IF NOT EXISTS idx_communication_logs_created_at ON communication_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_communication_logs_lead_channel ON communication_logs(lead_id, channel);

CREATE INDEX IF NOT EXISTS idx_communication_templates_user_id ON communication_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_communication_templates_channel ON communication_templates(channel);
CREATE INDEX IF NOT EXISTS idx_communication_templates_user_channel ON communication_templates(user_id, channel);

-- =====================================================
-- RLS Policies for communication_logs
-- =====================================================

ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own communication logs"
    ON communication_logs FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own communication logs"
    ON communication_logs FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own communication logs"
    ON communication_logs FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own communication logs"
    ON communication_logs FOR DELETE
    USING (auth.uid()::text = user_id);

-- =====================================================
-- RLS Policies for communication_templates
-- =====================================================

ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates"
    ON communication_templates FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own templates"
    ON communication_templates FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own templates"
    ON communication_templates FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own templates"
    ON communication_templates FOR DELETE
    USING (auth.uid()::text = user_id);

-- =====================================================
-- Trigger for updated_at on templates
-- =====================================================

CREATE OR REPLACE FUNCTION update_communication_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_communication_templates_updated_at
    BEFORE UPDATE ON communication_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_communication_templates_updated_at();

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE communication_logs IS 'Stores all communications sent to/from leads via email, WhatsApp, SMS';
COMMENT ON TABLE communication_templates IS 'User-defined message templates for quick communication';

COMMENT ON COLUMN communication_logs.channel IS 'Communication channel: email, whatsapp, sms';
COMMENT ON COLUMN communication_logs.direction IS 'Message direction: outbound (sent) or inbound (received)';
COMMENT ON COLUMN communication_logs.metadata IS 'Additional data like email headers, delivery status, etc.';
COMMENT ON COLUMN communication_logs.status IS 'Delivery status: sent, delivered, failed, pending';

COMMENT ON COLUMN communication_templates.tone IS 'Template tone: professional, emotional, luxury, casual, urgent';
COMMENT ON COLUMN communication_templates.variables IS 'Template variables like {nome}, {immobile}, {prezzo}';
