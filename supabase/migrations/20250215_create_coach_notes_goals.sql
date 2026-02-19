-- ============================================================
-- Coach Notes (private notes per client, only visible to coach)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.coach_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coach_notes_client ON public.coach_notes(coach_id, client_id, created_at DESC);

ALTER TABLE public.coach_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches manage own notes" ON public.coach_notes
  FOR ALL USING (coach_id = auth.uid());

-- ============================================================
-- Client Goals (motivational targets set by coach)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.client_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_client_goals_client ON public.client_goals(client_id, status);

ALTER TABLE public.client_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches manage client goals" ON public.client_goals
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY "Clients view own goals" ON public.client_goals
  FOR SELECT USING (client_id = auth.uid());
