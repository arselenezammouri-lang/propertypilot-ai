-- =====================================================
-- PROPERTYPILOT AI — COMPLETE SUPABASE SCHEMA
-- 
-- HOW TO RUN:
-- 1. Go to https://supabase.com/dashboard/project/mbykkvyqhfqkcxplzhnz
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New query"
-- 4. Paste this ENTIRE file
-- 5. Click "Run" (or Ctrl+Enter)
-- 6. You should see "Success. No rows returned" for each statement
--
-- If any table already exists, IF NOT EXISTS will skip it safely.
-- =====================================================

-- =====================================================
-- 1. PROFILES (foundation — everything depends on this)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(50),
  agency_name VARCHAR(255),
  subscription_plan VARCHAR(20) DEFAULT 'free',
  referral_code VARCHAR(50) UNIQUE,
  referred_by UUID,
  referral_bonus_credits INTEGER DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  locale VARCHAR(10) DEFAULT 'it',
  currency VARCHAR(10) DEFAULT 'EUR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Self-referencing FK added after table creation
DO $$ BEGIN
  ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_referred_by_fkey 
    FOREIGN KEY (referred_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts, then recreate
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Service role full access profiles" ON public.profiles;
END $$;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =====================================================
-- 2. SUBSCRIPTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) DEFAULT 'free' CHECK (status IN ('free', 'starter', 'pro', 'agency')),
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  price_id VARCHAR(255),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  generations_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT subscriptions_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_cust ON public.subscriptions(stripe_customer_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;
  DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;
END $$;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription"
  ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription"
  ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Atomic generation counter (prevents race conditions)
CREATE OR REPLACE FUNCTION public.increment_generation_count(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.subscriptions (id, user_id, status, generations_count, updated_at)
  VALUES (gen_random_uuid(), p_user_id, 'free', 1, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    generations_count = COALESCE(public.subscriptions.generations_count, 0) + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 3. PURCHASES (one-time payments like Agency Boost)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  package_id VARCHAR(100) NOT NULL,
  package_name VARCHAR(255),
  amount INTEGER DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'eur',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  deliverables JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_user ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_session ON public.purchases(stripe_session_id);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases; END $$;
CREATE POLICY "Users can view own purchases"
  ON public.purchases FOR SELECT USING (auth.uid() = user_id);


-- =====================================================
-- 4. GENERATION LOGS (rate limiting)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.generation_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_genlog_user ON public.generation_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_genlog_ip ON public.generation_logs(ip_address, created_at);

ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can view own generation logs" ON public.generation_logs; END $$;
CREATE POLICY "Users can view own generation logs"
  ON public.generation_logs FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.cleanup_old_generation_logs()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.generation_logs WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 5. AI RESPONSE CACHE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_response_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  prompt_type VARCHAR(100) NOT NULL,
  input_hash VARCHAR(64),
  response_data JSONB NOT NULL,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON public.ai_response_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_cache_exp ON public.ai_response_cache(expires_at);

ALTER TABLE public.ai_response_cache ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Auth users can read cache" ON public.ai_response_cache; END $$;
CREATE POLICY "Auth users can read cache"
  ON public.ai_response_cache FOR SELECT TO authenticated USING (true);


-- =====================================================
-- 6. SAVED LISTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.saved_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(500),
  property_type VARCHAR(100),
  location VARCHAR(255),
  price VARCHAR(100),
  size VARCHAR(50),
  rooms VARCHAR(20),
  features TEXT,
  notes TEXT,
  style VARCHAR(50) DEFAULT 'standard',
  market VARCHAR(50) DEFAULT 'italy',
  professional_copy TEXT,
  short_copy TEXT,
  english_copy TEXT,
  titles JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_user ON public.saved_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_created ON public.saved_listings(user_id, created_at DESC);

ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own listings" ON public.saved_listings;
  DROP POLICY IF EXISTS "Users can insert own listings" ON public.saved_listings;
  DROP POLICY IF EXISTS "Users can update own listings" ON public.saved_listings;
  DROP POLICY IF EXISTS "Users can delete own listings" ON public.saved_listings;
END $$;

CREATE POLICY "Users can view own listings" ON public.saved_listings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own listings" ON public.saved_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings" ON public.saved_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings" ON public.saved_listings FOR DELETE USING (auth.uid() = user_id);


-- =====================================================
-- 7. CRM: LEADS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(50),
  messaggio TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'followup', 'closed', 'lost')),
  lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  market VARCHAR(20) DEFAULT 'italy',
  property_url TEXT,
  source VARCHAR(100),
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_user ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON public.leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_user_status ON public.leads(user_id, status);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
  DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
  DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
  DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
END $$;

CREATE POLICY "Users can view own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own leads" ON public.leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leads" ON public.leads FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own leads" ON public.leads FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_leads_updated_at ON public.leads;
CREATE TRIGGER trigger_leads_updated_at
  BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_leads_updated_at();


-- =====================================================
-- 8. CRM: LEAD NOTES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON public.lead_notes(lead_id);

ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view notes for own leads" ON public.lead_notes;
  DROP POLICY IF EXISTS "Users can insert notes for own leads" ON public.lead_notes;
  DROP POLICY IF EXISTS "Users can delete own notes" ON public.lead_notes;
END $$;

CREATE POLICY "Users can view notes for own leads" ON public.lead_notes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_notes.lead_id AND leads.user_id = auth.uid()));
CREATE POLICY "Users can insert notes for own leads" ON public.lead_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_notes.lead_id AND leads.user_id = auth.uid()));
CREATE POLICY "Users can delete own notes" ON public.lead_notes FOR DELETE
  USING (auth.uid() = user_id);


-- =====================================================
-- 9. CRM: LEAD STATUS HISTORY
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lead_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_history_lead ON public.lead_status_history(lead_id);

ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view status history for own leads" ON public.lead_status_history;
  DROP POLICY IF EXISTS "Users can insert status history for own leads" ON public.lead_status_history;
END $$;

CREATE POLICY "Users can view status history for own leads" ON public.lead_status_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_status_history.lead_id AND leads.user_id = auth.uid()));
CREATE POLICY "Users can insert status history for own leads" ON public.lead_status_history FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_status_history.lead_id AND leads.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.lead_status_history (lead_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_lead_status_change ON public.leads;
CREATE TRIGGER trigger_log_lead_status_change
  AFTER UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.log_lead_status_change();


-- =====================================================
-- 10. COMMUNICATION LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.communication_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  channel VARCHAR(50) NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'call', 'other')),
  direction VARCHAR(10) DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  subject VARCHAR(500),
  content TEXT,
  status VARCHAR(20) DEFAULT 'sent',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commlog_user ON public.communication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_commlog_lead ON public.communication_logs(lead_id);

ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can manage own comm logs" ON public.communication_logs;
END $$;
CREATE POLICY "Users can manage own comm logs" ON public.communication_logs FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 11. COMMUNICATION TEMPLATES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.communication_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  subject VARCHAR(500),
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own templates" ON public.communication_templates; END $$;
CREATE POLICY "Users can manage own templates" ON public.communication_templates FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 12. EXTERNAL LISTINGS (prospecting/scraping)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.external_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  source VARCHAR(100),
  external_id VARCHAR(255),
  title VARCHAR(500),
  location VARCHAR(255),
  price DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'EUR',
  size DECIMAL(10, 2),
  rooms INTEGER,
  url TEXT,
  image_url TEXT,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  days_on_market INTEGER DEFAULT 0,
  price_history JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_extlist_user ON public.external_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_extlist_source ON public.external_listings(source, external_id);

ALTER TABLE public.external_listings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own external listings" ON public.external_listings; END $$;
CREATE POLICY "Users can manage own external listings" ON public.external_listings FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 13. PROSPECTING FILTERS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.prospecting_filters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prospecting_filters ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own filters" ON public.prospecting_filters; END $$;
CREATE POLICY "Users can manage own filters" ON public.prospecting_filters FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 14. AUTOPILOT RULES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.prospecting_autopilot_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  rule_type VARCHAR(50) NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prospecting_autopilot_rules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own autopilot rules" ON public.prospecting_autopilot_rules; END $$;
CREATE POLICY "Users can manage own autopilot rules" ON public.prospecting_autopilot_rules FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 15. AUTOPILOT RUNS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.autopilot_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rule_id UUID REFERENCES public.prospecting_autopilot_rules(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  results JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.autopilot_runs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own runs" ON public.autopilot_runs; END $$;
CREATE POLICY "Users can manage own runs" ON public.autopilot_runs FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 16. AUTOPILOT ACTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.autopilot_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID REFERENCES public.autopilot_runs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  target_id UUID,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  result JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.autopilot_actions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own actions" ON public.autopilot_actions; END $$;
CREATE POLICY "Users can manage own actions" ON public.autopilot_actions FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 17. AUTOMATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(100) NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  action_type VARCHAR(100) NOT NULL,
  action_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own automations" ON public.automations; END $$;
CREATE POLICY "Users can manage own automations" ON public.automations FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 18. AUTOMATIONS RULES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.automations_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
  name VARCHAR(255),
  condition_type VARCHAR(100),
  condition_value JSONB DEFAULT '{}',
  action_type VARCHAR(100),
  action_value JSONB DEFAULT '{}',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automations_rules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own automation rules" ON public.automations_rules; END $$;
CREATE POLICY "Users can manage own automation rules" ON public.automations_rules FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 19. AUTOMATIONS ASSIGNMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.automations_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID REFERENCES public.automations_rules(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automations_assignments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own assignments" ON public.automations_assignments; END $$;
CREATE POLICY "Users can manage own assignments" ON public.automations_assignments FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 20. AUTOMATIONS LOGS (both naming conventions used in code)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.automations_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  automation_id UUID REFERENCES public.automations(id) ON DELETE SET NULL,
  rule_id UUID REFERENCES public.automations_rules(id) ON DELETE SET NULL,
  action VARCHAR(255),
  status VARCHAR(20) DEFAULT 'success',
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_autolog_user ON public.automations_logs(user_id);

ALTER TABLE public.automations_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own auto logs" ON public.automations_logs; END $$;
CREATE POLICY "Users can manage own auto logs" ON public.automations_logs FOR ALL USING (auth.uid() = user_id);

-- Alias table (some code references "automation_logs" singular)
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  automation_id UUID,
  action VARCHAR(255),
  status VARCHAR(20) DEFAULT 'success',
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own automation_logs" ON public.automation_logs; END $$;
CREATE POLICY "Users can manage own automation_logs" ON public.automation_logs FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 21. USER API KEYS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  service VARCHAR(100) NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_service UNIQUE (user_id, service)
);

ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own API keys" ON public.user_api_keys; END $$;
CREATE POLICY "Users can manage own API keys" ON public.user_api_keys FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 22. WORKSPACE SETTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_workspace_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  agency_name VARCHAR(255),
  agency_logo_url TEXT,
  primary_color VARCHAR(20) DEFAULT '#9333ea',
  secondary_color VARCHAR(20) DEFAULT '#06b6d4',
  default_market VARCHAR(20) DEFAULT 'italy',
  default_style VARCHAR(20) DEFAULT 'standard',
  default_language VARCHAR(10) DEFAULT 'it',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_workspace_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own workspace" ON public.user_workspace_settings; END $$;
CREATE POLICY "Users can manage own workspace" ON public.user_workspace_settings FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 23. ONBOARDING PROGRESS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_onboarding_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  steps_completed JSONB DEFAULT '[]',
  current_step INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_onboarding_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Users can manage own onboarding" ON public.user_onboarding_progress; END $$;
CREATE POLICY "Users can manage own onboarding" ON public.user_onboarding_progress FOR ALL USING (auth.uid() = user_id);


-- =====================================================
-- 24. BLOG POSTS (public content marketing)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255),
  image_url TEXT,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(published, published_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN DROP POLICY IF EXISTS "Anyone can read published posts" ON public.blog_posts; END $$;
CREATE POLICY "Anyone can read published posts"
  ON public.blog_posts FOR SELECT USING (published = true);


-- =====================================================
-- VERIFICATION: Run this to confirm all tables exist
-- =====================================================
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
