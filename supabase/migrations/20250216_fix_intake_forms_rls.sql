-- ============================================================
-- Create intake_forms table + RLS policies
-- (Original migration was never run)
-- ============================================================

CREATE TABLE IF NOT EXISTS intake_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Step 1: Goals & Experience
  goals TEXT,
  fitness_experience TEXT,
  training_history TEXT,

  -- Step 2: Health
  injuries TEXT,
  medical_conditions TEXT,
  medications TEXT,

  -- Step 3: Lifestyle
  dietary_restrictions TEXT,
  allergies TEXT,
  sleep_hours NUMERIC(3,1),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  occupation TEXT,

  -- Step 4: Schedule & Equipment
  available_days JSONB DEFAULT '[]',
  preferred_training_time TEXT,
  equipment_access TEXT,
  additional_notes TEXT,

  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_intake UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_intake_forms_user_id ON intake_forms(user_id);

-- RLS
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own intake" ON intake_forms;
DROP POLICY IF EXISTS "Users can insert own intake" ON intake_forms;
DROP POLICY IF EXISTS "Users can update own intake" ON intake_forms;

CREATE POLICY "Users can view own intake" ON intake_forms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own intake" ON intake_forms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own intake" ON intake_forms
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_intake_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_intake_forms_updated_at ON intake_forms;
CREATE TRIGGER trigger_intake_forms_updated_at
  BEFORE UPDATE ON intake_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_intake_forms_updated_at();
