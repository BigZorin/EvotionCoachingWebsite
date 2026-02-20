-- ============================================================
-- SCHEDULING SYSTEM: Sessions + Coach Availability
-- ============================================================

-- Coach sessie planning
CREATE TABLE IF NOT EXISTS client_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pt_session', 'video_call', 'check_in_gesprek', 'programma_review')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'no_show', 'cancelled')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  mode TEXT CHECK (mode IN ('in_person', 'video')),
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_client_sessions_coach ON client_sessions(coach_id);
CREATE INDEX idx_client_sessions_client ON client_sessions(client_id);
CREATE INDEX idx_client_sessions_start ON client_sessions(start_time);

-- Coach wekelijkse beschikbaarheid
CREATE TABLE IF NOT EXISTS coach_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  active BOOLEAN DEFAULT true,
  UNIQUE(coach_id, day_of_week, start_time)
);

CREATE INDEX idx_coach_availability_coach ON coach_availability(coach_id);

-- RLS Policies
ALTER TABLE client_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_availability ENABLE ROW LEVEL SECURITY;

-- Coaches can manage their own sessions
DROP POLICY IF EXISTS "Coaches manage own sessions" ON client_sessions;
CREATE POLICY "Coaches manage own sessions" ON client_sessions
  FOR ALL USING (coach_id = auth.uid());

-- Clients can view their own sessions
DROP POLICY IF EXISTS "Clients view own sessions" ON client_sessions;
CREATE POLICY "Clients view own sessions" ON client_sessions
  FOR SELECT USING (client_id = auth.uid());

-- Coaches manage own availability
DROP POLICY IF EXISTS "Coaches manage own availability" ON coach_availability;
CREATE POLICY "Coaches manage own availability" ON coach_availability
  FOR ALL USING (coach_id = auth.uid());

-- Service role bypass (for server actions)
DROP POLICY IF EXISTS "Service role full access sessions" ON client_sessions;
CREATE POLICY "Service role full access sessions" ON client_sessions
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access availability" ON coach_availability;
CREATE POLICY "Service role full access availability" ON coach_availability
  FOR ALL USING (auth.role() = 'service_role');
