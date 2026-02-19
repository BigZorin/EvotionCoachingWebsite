-- Custom Check-in Templates: coaches can define custom check-in questions per client

-- 1. Templates (owned by coach)
CREATE TABLE IF NOT EXISTS check_in_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  check_in_type TEXT NOT NULL DEFAULT 'weekly' CHECK (check_in_type IN ('daily', 'weekly')),
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Questions within a template
CREATE TABLE IF NOT EXISTS template_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES check_in_templates(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('scale', 'number', 'text', 'yes_no', 'multiple_choice')),
  options JSONB,                    -- for multiple_choice: ["Option A", "Option B", ...]
  scale_labels JSONB,               -- for scale: ["Label 1", "Label 2", ..., "Label 5"]
  is_required BOOLEAN DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  field_key TEXT,                    -- optional key for known fields like 'weight', 'mood'
  unit TEXT,                         -- optional unit for number fields like 'kg'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Template assignments to clients (1 template per client per type)
CREATE TABLE IF NOT EXISTS check_in_template_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES check_in_templates(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_client_type_assignment UNIQUE (client_id, template_id)
);

-- 4. Answers per check-in per question
CREATE TABLE IF NOT EXISTS check_in_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  check_in_id UUID NOT NULL,        -- references check_ins.id or daily_check_ins.id
  check_in_type TEXT NOT NULL DEFAULT 'weekly' CHECK (check_in_type IN ('daily', 'weekly')),
  question_id UUID NOT NULL REFERENCES template_questions(id) ON DELETE CASCADE,
  answer_value TEXT,                 -- stored as text, parsed by type
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_check_in_templates_coach ON check_in_templates(coach_id);
CREATE INDEX IF NOT EXISTS idx_template_questions_template ON template_questions(template_id);
CREATE INDEX IF NOT EXISTS idx_template_assignments_client ON check_in_template_assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_template_assignments_template ON check_in_template_assignments(template_id);
CREATE INDEX IF NOT EXISTS idx_check_in_answers_check_in ON check_in_answers(check_in_id);
CREATE INDEX IF NOT EXISTS idx_check_in_answers_question ON check_in_answers(question_id);

-- RLS
ALTER TABLE check_in_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_template_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_answers ENABLE ROW LEVEL SECURITY;

-- Templates: coaches can manage their own
CREATE POLICY "Coaches manage own templates" ON check_in_templates
  FOR ALL USING (auth.uid() = coach_id);

-- Questions: coaches can manage via template ownership
CREATE POLICY "Coaches manage template questions" ON template_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM check_in_templates t
      WHERE t.id = template_questions.template_id AND t.coach_id = auth.uid()
    )
  );

-- Clients can read questions for their assigned template
CREATE POLICY "Clients read assigned template questions" ON template_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM check_in_template_assignments a
      WHERE a.template_id = template_questions.template_id AND a.client_id = auth.uid()
    )
  );

-- Assignments: coaches manage, clients read own
CREATE POLICY "Coaches manage assignments" ON check_in_template_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM check_in_templates t
      WHERE t.id = check_in_template_assignments.template_id AND t.coach_id = auth.uid()
    )
  );

CREATE POLICY "Clients read own assignments" ON check_in_template_assignments
  FOR SELECT USING (auth.uid() = client_id);

-- Answers: clients manage own, coaches read via template
CREATE POLICY "Clients manage own answers" ON check_in_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM check_ins ci WHERE ci.id = check_in_answers.check_in_id AND ci.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM daily_check_ins dci WHERE dci.id = check_in_answers.check_in_id AND dci.user_id = auth.uid()
    )
  );

-- Updated_at trigger for templates
CREATE OR REPLACE FUNCTION update_check_in_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_in_templates_updated_at
  BEFORE UPDATE ON check_in_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_check_in_templates_updated_at();
