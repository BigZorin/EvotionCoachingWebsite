-- ============================================================
-- RLS Policies for client_workouts and workout_logs
-- Ensures clients can create/update workouts and save exercise logs
-- ============================================================

-- Enable RLS (safe to call even if already enabled)
ALTER TABLE client_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────
-- client_workouts policies
-- ────────────────────────────────────────────────────

-- Clients can view their own workouts
DROP POLICY IF EXISTS "Clients view own workouts" ON client_workouts;
CREATE POLICY "Clients view own workouts"
  ON client_workouts FOR SELECT
  USING (auth.uid()::text = client_id);

-- Clients can insert their own workouts (for starting from program templates)
DROP POLICY IF EXISTS "Clients insert own workouts" ON client_workouts;
CREATE POLICY "Clients insert own workouts"
  ON client_workouts FOR INSERT
  WITH CHECK (auth.uid()::text = client_id);

-- Clients can update their own workouts (for marking complete)
DROP POLICY IF EXISTS "Clients update own workouts" ON client_workouts;
CREATE POLICY "Clients update own workouts"
  ON client_workouts FOR UPDATE
  USING (auth.uid()::text = client_id)
  WITH CHECK (auth.uid()::text = client_id);

-- Clients can delete their own incomplete workouts (for discarding)
DROP POLICY IF EXISTS "Clients delete own workouts" ON client_workouts;
CREATE POLICY "Clients delete own workouts"
  ON client_workouts FOR DELETE
  USING (auth.uid()::text = client_id AND completed = false);

-- Coaches can manage workouts for their clients
DROP POLICY IF EXISTS "Coaches manage client workouts" ON client_workouts;
CREATE POLICY "Coaches manage client workouts"
  ON client_workouts FOR ALL
  USING (auth.uid()::text = coach_id)
  WITH CHECK (auth.uid()::text = coach_id);

-- ────────────────────────────────────────────────────
-- workout_logs policies
-- ────────────────────────────────────────────────────

-- Clients can view their own logs
DROP POLICY IF EXISTS "Clients view own logs" ON workout_logs;
CREATE POLICY "Clients view own logs"
  ON workout_logs FOR SELECT
  USING (auth.uid()::text = user_id);

-- Clients can insert their own logs
DROP POLICY IF EXISTS "Clients insert own logs" ON workout_logs;
CREATE POLICY "Clients insert own logs"
  ON workout_logs FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Clients can update their own logs
DROP POLICY IF EXISTS "Clients update own logs" ON workout_logs;
CREATE POLICY "Clients update own logs"
  ON workout_logs FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Coaches can view logs of their clients
DROP POLICY IF EXISTS "Coaches view client logs" ON workout_logs;
CREATE POLICY "Coaches view client logs"
  ON workout_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM client_workouts cw
      WHERE cw.id = workout_logs.client_workout_id
        AND cw.coach_id = auth.uid()::text
    )
  );
