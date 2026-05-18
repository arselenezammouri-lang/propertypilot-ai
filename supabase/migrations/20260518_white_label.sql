-- White-Label Client Portal: agency branding, clients, assigned listings

-- Agency branding / theming
CREATE TABLE IF NOT EXISTS agency_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_name TEXT NOT NULL DEFAULT 'My Agency',
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#6366f1',
  secondary_color TEXT NOT NULL DEFAULT '#8b5cf6',
  accent_color TEXT NOT NULL DEFAULT '#a78bfa',
  background_color TEXT NOT NULL DEFAULT '#0f0f23',
  text_color TEXT NOT NULL DEFAULT '#f8fafc',
  font_family TEXT NOT NULL DEFAULT 'Inter, system-ui, sans-serif',
  custom_domain TEXT,
  footer_text TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  social_links JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Clients managed by agency
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  preferred_zones TEXT[] DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'signed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Listings assigned to clients
CREATE TABLE IF NOT EXISTS client_assigned_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL,
  agency_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'liked', 'rejected', 'viewing_scheduled', 'offer_made')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_agency_branding_user ON agency_branding(user_id);
CREATE INDEX idx_agency_branding_slug ON agency_branding(slug);
CREATE INDEX idx_clients_agency ON clients(agency_user_id);
CREATE INDEX idx_client_listings_client ON client_assigned_listings(client_id);
CREATE INDEX idx_client_listings_agency ON client_assigned_listings(agency_user_id);

-- RLS
ALTER TABLE agency_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_assigned_listings ENABLE ROW LEVEL SECURITY;

-- Agency branding: owner can manage, public can read by slug
CREATE POLICY "Owner manages branding"
  ON agency_branding FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read branding by slug"
  ON agency_branding FOR SELECT
  USING (true);

-- Clients: agency owner manages
CREATE POLICY "Agency manages own clients"
  ON clients FOR ALL
  USING (auth.uid() = agency_user_id);

-- Client assigned listings: agency owner manages
CREATE POLICY "Agency manages client listings"
  ON client_assigned_listings FOR ALL
  USING (auth.uid() = agency_user_id);
