-- Migration: Exercise Library & AI Workout Generation
-- Date: 2025-02-13
-- Description: Add muscle groups, difficulty, cues to exercises + AI workout generation tracking

-- ============================================
-- 1. CREATE ENUMS
-- ============================================

-- Create DifficultyLevel enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create AIGenerationStatus enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "AIGenerationStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. EXTEND EXERCISES TABLE
-- ============================================

-- Add new columns to exercises table
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS muscle_groups JSONB,
ADD COLUMN IF NOT EXISTS difficulty "DifficultyLevel" DEFAULT 'BEGINNER'::"DifficultyLevel",
ADD COLUMN IF NOT EXISTS cues TEXT,
ADD COLUMN IF NOT EXISTS video_storage_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS image_storage_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_groups ON exercises USING GIN (muscle_groups);

-- ============================================
-- 2. CREATE AI WORKOUT GENERATION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ai_workout_generations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  coach_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status "AIGenerationStatus" NOT NULL DEFAULT 'PENDING'::"AIGenerationStatus",

  -- Input context
  client_goals TEXT,
  experience VARCHAR(50),
  available_equipment JSONB,
  sessions_per_week INTEGER,
  session_duration INTEGER,

  -- AI metadata
  prompt_used TEXT,
  model_version VARCHAR(100),
  tokens_used INTEGER,

  -- Output
  generated_template_id VARCHAR UNIQUE REFERENCES workout_templates(id) ON DELETE SET NULL,
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Add indexes for AI generations table
CREATE INDEX IF NOT EXISTS idx_ai_generations_coach ON ai_workout_generations(coach_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_client ON ai_workout_generations(client_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_status ON ai_workout_generations(status);

-- ============================================
-- 3. CREATE TRIGGER FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for exercises table
DROP TRIGGER IF EXISTS update_exercises_updated_at ON exercises;
CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN exercises.muscle_groups IS 'JSONB array of muscle groups targeted by this exercise, e.g., ["chest", "triceps", "shoulders"]';
COMMENT ON COLUMN exercises.difficulty IS 'Difficulty level: BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT';
COMMENT ON COLUMN exercises.cues IS 'Form cues and technique instructions for proper execution';
COMMENT ON COLUMN exercises.video_storage_path IS 'Supabase Storage path for exercise demonstration video';
COMMENT ON COLUMN exercises.image_storage_path IS 'Supabase Storage path for exercise thumbnail image';
COMMENT ON COLUMN exercises.is_public IS 'Whether this exercise is part of the platform library (true) or coach-created (false)';

COMMENT ON TABLE ai_workout_generations IS 'Tracks AI-generated workout template creation with Claude API';
COMMENT ON COLUMN ai_workout_generations.status IS 'Generation status: PENDING, GENERATING, COMPLETED, or FAILED';
COMMENT ON COLUMN ai_workout_generations.prompt_used IS 'The full prompt sent to Claude API for generation';
COMMENT ON COLUMN ai_workout_generations.model_version IS 'Claude model version used (e.g., claude-3-5-sonnet-20241022)';
COMMENT ON COLUMN ai_workout_generations.tokens_used IS 'Total tokens consumed (input + output) for cost tracking';
COMMENT ON COLUMN ai_workout_generations.generated_template_id IS 'Reference to the workout template created by AI';
