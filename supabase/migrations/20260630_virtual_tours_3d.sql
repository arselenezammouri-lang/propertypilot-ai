-- Virtual Tours 3D tables
-- Run after all previous migrations

-- Virtual tours
CREATE TABLE IF NOT EXISTS virtual_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  provider TEXT NOT NULL CHECK (provider IN ('matterport', 'cloudpano', 'pannellum', 'ai_walkthrough')),
  provider_tour_id TEXT,
  embed_url TEXT,
  public_url TEXT,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'active', 'archived')),
  scenes_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tour analytics
CREATE TABLE IF NOT EXISTS tour_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES virtual_tours(id) ON DELETE CASCADE,
  visitor_id TEXT,
  session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  duration_seconds INTEGER,
  scenes_viewed INTEGER DEFAULT 0,
  hotspots_clicked INTEGER DEFAULT 0,
  device_type TEXT,
  country TEXT,
  referrer TEXT,
  completed BOOLEAN DEFAULT FALSE
);

-- Tour hotspots
CREATE TABLE IF NOT EXISTS tour_hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES virtual_tours(id) ON DELETE CASCADE,
  scene_id TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  hotspot_type TEXT NOT NULL CHECK (hotspot_type IN ('info', 'link', 'scene', 'media')),
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  target_scene_id TEXT,
  link_url TEXT,
  media_url TEXT,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS policies
ALTER TABLE virtual_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_hotspots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tours" ON virtual_tours
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Tour analytics viewable by tour owner" ON tour_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM virtual_tours WHERE virtual_tours.id = tour_analytics.tour_id AND virtual_tours.user_id = auth.uid())
  );

CREATE POLICY "Anyone can insert analytics" ON tour_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Hotspots managed by tour owner" ON tour_hotspots
  FOR ALL USING (
    EXISTS (SELECT 1 FROM virtual_tours WHERE virtual_tours.id = tour_hotspots.tour_id AND virtual_tours.user_id = auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_virtual_tours_user ON virtual_tours(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_tours_listing ON virtual_tours(listing_id);
CREATE INDEX IF NOT EXISTS idx_tour_analytics_tour ON tour_analytics(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_hotspots_tour ON tour_hotspots(tour_id);
