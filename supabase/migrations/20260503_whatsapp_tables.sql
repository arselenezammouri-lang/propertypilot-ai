-- PropertyPilot AI — WhatsApp Agent Tables
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/mbykkvyqhfqkcxplzhnz/sql

-- WhatsApp conversations
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  contact_phone text NOT NULL,
  contact_name text,
  last_message text,
  last_message_at timestamptz DEFAULT now(),
  ai_handled boolean DEFAULT true,
  status text DEFAULT 'active', -- active, paused, closed
  unread_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_conv_user ON whatsapp_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_wa_conv_phone ON whatsapp_conversations(contact_phone);
CREATE INDEX IF NOT EXISTS idx_wa_conv_status ON whatsapp_conversations(status);

ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own conversations" ON whatsapp_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own conversations" ON whatsapp_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own conversations" ON whatsapp_conversations FOR UPDATE USING (auth.uid() = user_id);

-- WhatsApp messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
  direction text NOT NULL DEFAULT 'inbound', -- inbound, outbound
  message_type text DEFAULT 'text', -- text, template, carousel, image
  content text,
  meta_message_id text, -- WhatsApp message ID from Meta
  status text DEFAULT 'sent', -- sent, delivered, read, failed
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_msg_conv ON whatsapp_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_wa_msg_created ON whatsapp_messages(created_at);

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
-- Messages accessed through conversation ownership
CREATE POLICY "Users see own messages" ON whatsapp_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM whatsapp_conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid()));
CREATE POLICY "Users insert own messages" ON whatsapp_messages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM whatsapp_conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid()));

-- Add whatsapp_conversations_used to usage_credits if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usage_credits' AND column_name = 'whatsapp_conversations_used') THEN
    ALTER TABLE usage_credits ADD COLUMN whatsapp_conversations_used integer DEFAULT 0;
  END IF;
END $$;
