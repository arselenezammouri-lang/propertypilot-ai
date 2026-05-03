-- PropertyPilot AI — Voice Agent v2 Tables
-- Run in Supabase SQL editor: https://supabase.com/dashboard/project/mbykkvyqhfqkcxplzhnz/sql

-- Phone numbers owned by users (via Twilio)
CREATE TABLE IF NOT EXISTS phone_numbers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  twilio_sid text NOT NULL,
  number text NOT NULL,
  country text NOT NULL DEFAULT 'IT',
  monthly_cost numeric(6,2) DEFAULT 1.00,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own numbers" ON phone_numbers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own numbers" ON phone_numbers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own numbers" ON phone_numbers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own numbers" ON phone_numbers FOR DELETE USING (auth.uid() = user_id);

-- Voice clones (ElevenLabs, Agency tier)
CREATE TABLE IF NOT EXISTS voice_clones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  elevenlabs_voice_id text NOT NULL,
  name text NOT NULL,
  language text DEFAULT 'it',
  sample_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_clones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own clones" ON voice_clones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own clones" ON voice_clones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own clones" ON voice_clones FOR DELETE USING (auth.uid() = user_id);

-- Calendar integrations (Cal.com, Google Calendar)
CREATE TABLE IF NOT EXISTS calendar_integrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'cal_com', -- cal_com | google
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  event_type_id integer, -- Cal.com event type for viewings
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own integrations" ON calendar_integrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own integrations" ON calendar_integrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own integrations" ON calendar_integrations FOR UPDATE USING (auth.uid() = user_id);

-- Add missing columns to calls table if they don't exist
DO $$
BEGIN
  -- These columns may already exist, so we use IF NOT EXISTS pattern
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calls' AND column_name = 'pathway') THEN
    ALTER TABLE calls ADD COLUMN pathway text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calls' AND column_name = 'language') THEN
    ALTER TABLE calls ADD COLUMN language text DEFAULT 'it';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calls' AND column_name = 'phone_number') THEN
    ALTER TABLE calls ADD COLUMN phone_number text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calls' AND column_name = 'direction') THEN
    ALTER TABLE calls ADD COLUMN direction text DEFAULT 'outbound';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calls' AND column_name = 'duration_seconds') THEN
    ALTER TABLE calls ADD COLUMN duration_seconds integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calls' AND column_name = 'recording_url') THEN
    ALTER TABLE calls ADD COLUMN recording_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calls' AND column_name = 'notes') THEN
    ALTER TABLE calls ADD COLUMN notes text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calls' AND column_name = 'updated_at') THEN
    ALTER TABLE calls ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Usage credits: add voice_minutes_used if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usage_credits' AND column_name = 'voice_minutes_used') THEN
    -- Create usage_credits table if it doesn't exist
    CREATE TABLE IF NOT EXISTS usage_credits (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
      period_start timestamptz DEFAULT date_trunc('month', now()),
      ai_descriptions_used integer DEFAULT 0,
      voice_minutes_used integer DEFAULT 0,
      emails_sent integer DEFAULT 0,
      created_at timestamptz DEFAULT now()
    );
    ALTER TABLE usage_credits ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users see own usage" ON usage_credits FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Helper function to increment voice minutes
CREATE OR REPLACE FUNCTION increment_voice_minutes(p_user_id uuid, p_minutes integer)
RETURNS void AS $$
BEGIN
  INSERT INTO usage_credits (user_id, voice_minutes_used)
  VALUES (p_user_id, p_minutes)
  ON CONFLICT (user_id) DO UPDATE
  SET voice_minutes_used = usage_credits.voice_minutes_used + p_minutes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
