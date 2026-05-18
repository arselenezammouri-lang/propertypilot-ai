-- Cross-Border Marketplace: listings, buyer searches, matches, escrow

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'Apartment',
  sqm NUMERIC NOT NULL DEFAULT 0,
  rooms INTEGER NOT NULL DEFAULT 0,
  photos TEXT[] DEFAULT '{}',
  languages_available TEXT[] DEFAULT '{"en"}',
  commission_rate NUMERIC NOT NULL DEFAULT 3,
  cross_border BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS buyer_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  countries TEXT[] NOT NULL DEFAULT '{}',
  min_budget NUMERIC NOT NULL DEFAULT 0,
  max_budget NUMERIC NOT NULL DEFAULT 10000000,
  property_types TEXT[] DEFAULT '{}',
  min_sqm NUMERIC NOT NULL DEFAULT 0,
  min_rooms INTEGER NOT NULL DEFAULT 0,
  preferred_languages TEXT[] DEFAULT '{"en"}',
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  buyer_search_id UUID NOT NULL REFERENCES buyer_searches(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL DEFAULT 0,
  reasons JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'viewing', 'offer', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC NOT NULL,
  commission NUMERIC NOT NULL DEFAULT 0,
  platform_fee NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'funded', 'completed', 'disputed', 'refunded')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_marketplace_listings_country ON marketplace_listings(country, status);
CREATE INDEX idx_marketplace_listings_agent ON marketplace_listings(agent_user_id);
CREATE INDEX idx_marketplace_listings_price ON marketplace_listings(price) WHERE status = 'active';
CREATE INDEX idx_buyer_searches_user ON buyer_searches(buyer_user_id);
CREATE INDEX idx_marketplace_matches_listing ON marketplace_matches(listing_id);
CREATE INDEX idx_marketplace_matches_buyer ON marketplace_matches(buyer_search_id);

-- RLS
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Marketplace listings: public read, owner manages
CREATE POLICY "Public can browse active listings"
  ON marketplace_listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Agents manage own listings"
  ON marketplace_listings FOR ALL
  USING (auth.uid() = agent_user_id);

-- Buyer searches: owner only
CREATE POLICY "Buyers manage own searches"
  ON buyer_searches FOR ALL
  USING (auth.uid() = buyer_user_id);

-- Matches: participants can view
CREATE POLICY "Match participants can view"
  ON marketplace_matches FOR SELECT
  USING (
    buyer_search_id IN (SELECT id FROM buyer_searches WHERE buyer_user_id = auth.uid())
    OR listing_id IN (SELECT id FROM marketplace_listings WHERE agent_user_id = auth.uid())
  );

-- Escrow: participants only
CREATE POLICY "Escrow participants can view"
  ON escrow_transactions FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
