-- Intake Forms: onboarding questionnaire for new clients
CREATE TABLE IF NOT EXISTS intake_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Step 1: Goals & Experience
  goals TEXT,                          -- e.g. "Afvallen", "Spiermassa opbouwen"
  fitness_experience TEXT,             -- e.g. "Beginner", "Gevorderd"
  training_history TEXT,               -- free text about past training

  -- Step 2: Health
  injuries TEXT,                       -- current or past injuries
  medical_conditions TEXT,             -- relevant medical conditions
  medications TEXT,                    -- current medications

  -- Step 3: Lifestyle
  dietary_restrictions TEXT,           -- e.g. "Vegetarisch", "Glutenvrij"
  allergies TEXT,                      -- food allergies
  sleep_hours NUMERIC(3,1),           -- average sleep hours
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  occupation TEXT,                     -- job type for activity level assessment

  -- Step 4: Schedule & Equipment
  available_days JSONB DEFAULT '[]',   -- e.g. ["maandag","woensdag","vrijdag"]
  preferred_training_time TEXT,        -- e.g. "Ochtend", "Middag", "Avond"
  equipment_access TEXT,               -- e.g. "Volledige sportschool", "Thuis basic"
  additional_notes TEXT,               -- anything else the client wants to share

  completed_at TIMESTAMPTZ,           -- NULL = not yet completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_intake UNIQUE (user_id)
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_intake_forms_user_id ON intake_forms(user_id);

-- RLS
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;

-- Clients can view and manage their own intake form
CREATE POLICY "Users can view own intake" ON intake_forms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own intake" ON intake_forms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own intake" ON intake_forms
  FOR UPDATE USING (auth.uid() = user_id);

-- Coaches/Admins can view all intake forms (via service role key, no RLS policy needed)
-- They use getSupabaseAdmin() which bypasses RLS

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_intake_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_intake_forms_updated_at
  BEFORE UPDATE ON intake_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_intake_forms_updated_at();
