-- Autopilot Mandati 24/7 - Schema Supabase
-- Esegui questo SQL nel progetto Supabase PRIMA di usare l'Autopilot.

-- 1) Regole Autopilot per utente
create table if not exists prospecting_autopilot_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  active boolean not null default true,
  name text not null,
  portals text[] not null default '{}',        -- ['idealista','immobiliare',...]
  city text,
  region text,
  min_price numeric,
  max_price numeric,
  min_bedrooms int,
  max_bedrooms int,
  run_hour_utc int not null default 7,         -- ora di esecuzione (UTC)
  daily_limit int not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Log dei run giornalieri
create table if not exists autopilot_runs (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references prospecting_autopilot_rules(id) on delete cascade,
  run_at timestamptz not null default now(),
  status text not null default 'pending',      -- 'pending' | 'success' | 'partial' | 'error'
  total_listings_scanned int not null default 0,
  total_opportunities int not null default 0,
  total_leads_created int not null default 0,
  error_message text
);

-- 3) Azioni di Autopilot per singolo listing
create table if not exists autopilot_actions (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references autopilot_runs(id) on delete cascade,
  listing_id uuid,                             -- oppure text se external_listings.id è text
  lead_id uuid,
  action_type text not null,                   -- 'call_ai' | 'create_lead' | 'send_email' | 'skip'
  action_status text not null default 'pending', -- 'pending' | 'done' | 'failed'
  notes text,
  created_at timestamptz not null default now()
);

