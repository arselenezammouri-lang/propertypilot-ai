-- =====================================================
-- PROPILOT AI - CRM LIGHT MIGRATION
-- Migration SQL for Supabase
-- Version: 1.5 (Leads + Pipeline Kanban)
-- =====================================================

-- =====================================================
-- TABLE 1: LEADS
-- Main table for storing lead information
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
  market VARCHAR(20) DEFAULT 'italy' CHECK (market IN ('italy', 'usa')),
  property_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for leads table
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON public.leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_user_status ON public.leads(user_id, status);

-- Enable RLS for leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "Users can view own leads"
  ON public.leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
  ON public.leads FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE 2: LEAD_NOTES
-- Internal notes for each lead
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lead_notes
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_created_at ON public.lead_notes(lead_id, created_at DESC);

-- Enable RLS for lead_notes
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_notes
CREATE POLICY "Users can view notes for own leads"
  ON public.lead_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert notes for own leads"
  ON public.lead_notes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own notes"
  ON public.lead_notes FOR DELETE
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = lead_notes.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

-- =====================================================
-- TABLE 3: LEAD_STATUS_HISTORY
-- Automatic tracking of status changes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lead_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lead_status_history
CREATE INDEX IF NOT EXISTS idx_lead_status_history_lead_id ON public.lead_status_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_status_history_created_at ON public.lead_status_history(lead_id, created_at DESC);

-- Enable RLS for lead_status_history
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_status_history
CREATE POLICY "Users can view status history for own leads"
  ON public.lead_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = lead_status_history.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert status history for own leads"
  ON public.lead_status_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads 
      WHERE leads.id = lead_status_history.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

-- =====================================================
-- TRIGGER: Auto-update updated_at on leads
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_leads_updated_at ON public.leads;
CREATE TRIGGER trigger_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_leads_updated_at();

-- =====================================================
-- TRIGGER: Auto-log status changes
-- =====================================================
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
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.log_lead_status_change();

-- =====================================================
-- NOTES FOR DEPLOYMENT:
-- 
-- 1. Run this SQL in Supabase SQL Editor
-- 2. After running, verify tables created:
--    - leads
--    - lead_notes  
--    - lead_status_history
-- 3. Verify RLS policies are active
-- 4. Test CRUD operations with authenticated user
-- =====================================================
