-- Migration: User Workspace Settings
-- Tabella per salvare le preferenze dei moduli attivi/disattivi

CREATE TABLE IF NOT EXISTS public.user_workspace_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enabled_modules TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_user_workspace_settings_user_id ON public.user_workspace_settings(user_id);

-- RLS
ALTER TABLE public.user_workspace_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workspace settings"
  ON public.user_workspace_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workspace settings"
  ON public.user_workspace_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspace settings"
  ON public.user_workspace_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_user_workspace_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_workspace_settings_updated_at
  BEFORE UPDATE ON public.user_workspace_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_workspace_settings_updated_at();

