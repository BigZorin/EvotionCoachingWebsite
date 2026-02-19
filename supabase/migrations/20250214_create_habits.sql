-- Habits tables for habit tracking feature
-- Coach creates habits for clients, clients check them off daily

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_frequency TEXT NOT NULL DEFAULT 'DAILY',
  target_count INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habit logs (daily completion tracking)
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_habit_log UNIQUE (habit_id, date)
);

-- Habit streaks (denormalized for performance)
CREATE TABLE IF NOT EXISTS habit_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL UNIQUE REFERENCES habits(id) ON DELETE CASCADE,
  current_streak_days INT NOT NULL DEFAULT 0,
  longest_streak_days INT NOT NULL DEFAULT 0,
  last_completed_date DATE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_habits_client ON habits (client_id);
CREATE INDEX IF NOT EXISTS idx_habits_coach ON habits (coach_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON habit_logs (habit_id, date DESC);

-- RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_streaks ENABLE ROW LEVEL SECURITY;

-- Habits policies: clients can view their own habits
CREATE POLICY "Clients can view own habits"
  ON habits FOR SELECT USING (auth.uid()::text = client_id);

-- Coaches can manage habits for their clients
CREATE POLICY "Coaches can manage habits"
  ON habits FOR ALL USING (auth.uid()::text = coach_id);

-- Habit logs policies: clients can view and toggle their own habit logs
CREATE POLICY "Clients can view own habit logs"
  ON habit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_logs.habit_id AND habits.client_id = auth.uid()::text)
  );

CREATE POLICY "Clients can insert own habit logs"
  ON habit_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_logs.habit_id AND habits.client_id = auth.uid()::text)
  );

CREATE POLICY "Clients can update own habit logs"
  ON habit_logs FOR UPDATE USING (
    EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_logs.habit_id AND habits.client_id = auth.uid()::text)
  );

-- Coaches can view habit logs for their clients
CREATE POLICY "Coaches can view habit logs"
  ON habit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_logs.habit_id AND habits.coach_id = auth.uid()::text)
  );

-- Habit streaks policies
CREATE POLICY "Clients can view own streaks"
  ON habit_streaks FOR SELECT USING (
    EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_streaks.habit_id AND habits.client_id = auth.uid()::text)
  );

CREATE POLICY "Clients can upsert own streaks"
  ON habit_streaks FOR ALL USING (
    EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_streaks.habit_id AND habits.client_id = auth.uid()::text)
  );

CREATE POLICY "Coaches can view streaks"
  ON habit_streaks FOR SELECT USING (
    EXISTS (SELECT 1 FROM habits WHERE habits.id = habit_streaks.habit_id AND habits.coach_id = auth.uid()::text)
  );
