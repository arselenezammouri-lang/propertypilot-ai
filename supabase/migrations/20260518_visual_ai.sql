-- Visual AI Suite: virtual staging, photo enhancement, floor plans
-- Run after all previous migrations

-- Visual AI Jobs table
CREATE TABLE IF NOT EXISTS visual_ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('virtual_staging', 'photo_enhancement', 'floor_plan')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  input_url TEXT NOT NULL,
  output_url TEXT,
  replicate_id TEXT,
  options JSONB NOT NULL DEFAULT '{}',
  error_message TEXT,
  credits_used INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_visual_ai_jobs_user ON visual_ai_jobs(user_id);
CREATE INDEX idx_visual_ai_jobs_status ON visual_ai_jobs(status);
CREATE INDEX idx_visual_ai_jobs_replicate ON visual_ai_jobs(replicate_id) WHERE replicate_id IS NOT NULL;
CREATE INDEX idx_visual_ai_jobs_created ON visual_ai_jobs(user_id, created_at DESC);

-- RLS
ALTER TABLE visual_ai_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own visual AI jobs"
  ON visual_ai_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own visual AI jobs"
  ON visual_ai_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visual AI jobs"
  ON visual_ai_jobs FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can update via webhook (no RLS restriction for service role)
-- The webhook uses the server client which bypasses RLS

-- Add visual_ai_jobs_used to usage_credits if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usage_credits') THEN
    ALTER TABLE usage_credits ADD COLUMN IF NOT EXISTS visual_ai_jobs_used INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;
