-- ============================================================
-- Training Programs System
-- Programs → Blocks → Workouts structure with banners
-- ============================================================

-- 1. Training Programs (coach-owned)
CREATE TABLE IF NOT EXISTS training_programs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id            VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name                VARCHAR NOT NULL,
  description         TEXT,
  banner_url          TEXT,
  banner_storage_path TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_training_programs_coach ON training_programs(coach_id);

-- 2. Program Blocks (phases within a program)
CREATE TABLE IF NOT EXISTS program_blocks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id     UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
  name           VARCHAR NOT NULL,
  description    TEXT,
  order_index    INT NOT NULL DEFAULT 0,
  duration_weeks INT NOT NULL DEFAULT 4,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_program_blocks_program ON program_blocks(program_id);

-- 3. Block Workouts (link workout templates to blocks)
CREATE TABLE IF NOT EXISTS block_workouts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id             UUID NOT NULL REFERENCES program_blocks(id) ON DELETE CASCADE,
  workout_template_id  VARCHAR NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  order_index          INT NOT NULL DEFAULT 0,
  day_of_week          INT,  -- 1=Monday ... 7=Sunday (optional)
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_block_workouts_block ON block_workouts(block_id);
CREATE INDEX idx_block_workouts_template ON block_workouts(workout_template_id);

-- 4. Client Programs (assignment of a program to a client)
CREATE TABLE IF NOT EXISTS client_programs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id            VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id          UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
  start_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  current_block_index INT NOT NULL DEFAULT 0,
  status              VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_client_programs_client ON client_programs(client_id);
CREATE INDEX idx_client_programs_coach ON client_programs(coach_id);
CREATE INDEX idx_client_programs_program ON client_programs(program_id);
CREATE INDEX idx_client_programs_status ON client_programs(status);

-- 5. ALTER existing tables

-- Link client_workouts to a program assignment (optional FK)
ALTER TABLE client_workouts
ADD COLUMN IF NOT EXISTS client_program_id UUID REFERENCES client_programs(id) ON DELETE SET NULL;

-- ExerciseDB fields on exercises table
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS external_id TEXT,
ADD COLUMN IF NOT EXISTS external_source TEXT,
ADD COLUMN IF NOT EXISTS gif_url TEXT;

-- 6. Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_training_programs_updated ON training_programs;
CREATE TRIGGER trigger_training_programs_updated
  BEFORE UPDATE ON training_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_client_programs_updated ON client_programs;
CREATE TRIGGER trigger_client_programs_updated
  BEFORE UPDATE ON client_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_programs ENABLE ROW LEVEL SECURITY;

-- training_programs: coach full CRUD on own, client SELECT via client_programs
CREATE POLICY "Coaches manage own programs"
  ON training_programs FOR ALL
  USING (auth.uid()::text = coach_id)
  WITH CHECK (auth.uid()::text = coach_id);

CREATE POLICY "Clients view assigned programs"
  ON training_programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM client_programs cp
      WHERE cp.program_id = training_programs.id
        AND cp.client_id = auth.uid()::text
    )
  );

-- program_blocks: coach via program, client via client_programs
CREATE POLICY "Coaches manage blocks via program"
  ON program_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM training_programs tp
      WHERE tp.id = program_blocks.program_id
        AND tp.coach_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM training_programs tp
      WHERE tp.id = program_blocks.program_id
        AND tp.coach_id = auth.uid()::text
    )
  );

CREATE POLICY "Clients view blocks of assigned programs"
  ON program_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM client_programs cp
      WHERE cp.program_id = program_blocks.program_id
        AND cp.client_id = auth.uid()::text
    )
  );

-- block_workouts: coach via program chain, client via client_programs
CREATE POLICY "Coaches manage block workouts"
  ON block_workouts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM program_blocks pb
      JOIN training_programs tp ON tp.id = pb.program_id
      WHERE pb.id = block_workouts.block_id
        AND tp.coach_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM program_blocks pb
      JOIN training_programs tp ON tp.id = pb.program_id
      WHERE pb.id = block_workouts.block_id
        AND tp.coach_id = auth.uid()::text
    )
  );

CREATE POLICY "Clients view block workouts of assigned programs"
  ON block_workouts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM program_blocks pb
      JOIN client_programs cp ON cp.program_id = pb.program_id
      WHERE pb.id = block_workouts.block_id
        AND cp.client_id = auth.uid()::text
    )
  );

-- client_programs: coach manages assignments for own clients, client views own
CREATE POLICY "Coaches manage client program assignments"
  ON client_programs FOR ALL
  USING (auth.uid()::text = coach_id)
  WITH CHECK (auth.uid()::text = coach_id);

CREATE POLICY "Clients view own program assignments"
  ON client_programs FOR SELECT
  USING (auth.uid()::text = client_id);

CREATE POLICY "Clients update own program status"
  ON client_programs FOR UPDATE
  USING (auth.uid()::text = client_id)
  WITH CHECK (auth.uid()::text = client_id);

-- ============================================================
-- Storage: program-banners bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('program-banners', 'program-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view banners (public bucket)
CREATE POLICY "Public read program banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'program-banners');

-- Coaches can upload banners
CREATE POLICY "Coaches upload program banners"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'program-banners'
    AND auth.uid()::text IS NOT NULL
  );

-- Coaches can update/delete their own banners
CREATE POLICY "Coaches manage own program banners"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'program-banners'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Coaches delete own program banners"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'program-banners'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
