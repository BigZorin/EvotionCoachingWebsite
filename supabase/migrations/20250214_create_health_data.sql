-- ============================================================
-- Health Data Table (wearables / Apple Health / Google Fit)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.health_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('steps', 'sleep_hours', 'heart_rate_avg', 'active_calories', 'resting_heart_rate', 'distance_km', 'floors_climbed')),
  value REAL NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('apple_health', 'google_fit', 'manual')),
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date, data_type, source)
);

-- Wearable connections (track which services are connected)
CREATE TABLE IF NOT EXISTS public.wearable_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('apple_health', 'google_fit')),
  is_connected BOOLEAN NOT NULL DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  permissions_granted JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_health_data_user_date ON public.health_data(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_health_data_type ON public.health_data(user_id, data_type, date DESC);
CREATE INDEX IF NOT EXISTS idx_wearable_connections_user ON public.wearable_connections(user_id);

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE public.health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;

-- Users manage own health data
CREATE POLICY "Users manage own health data" ON public.health_data
  FOR ALL USING (user_id = auth.uid());

-- Coaches view client health data
CREATE POLICY "Coaches view client health data" ON public.health_data
  FOR SELECT USING (
    user_id IN (
      SELECT user_id FROM public.profiles WHERE coach_id = auth.uid()
    )
  );

-- Users manage own wearable connections
CREATE POLICY "Users manage own connections" ON public.wearable_connections
  FOR ALL USING (user_id = auth.uid());
