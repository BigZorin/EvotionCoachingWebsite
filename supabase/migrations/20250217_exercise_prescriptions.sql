-- Exercise Prescription System
-- Adds intensity type, prescribed weight/RPE/RIR/percentage/tempo to workout templates
-- Adds prescription snapshot + actual RPE/RIR to workout logs

-- ============================================
-- 1. ALTER workout_template_exercises (coach prescription)
-- ============================================
ALTER TABLE workout_template_exercises
ADD COLUMN IF NOT EXISTS intensity_type TEXT DEFAULT 'weight'
  CHECK (intensity_type IN ('weight', 'rpe', 'rir', 'bodyweight', 'percentage')),
ADD COLUMN IF NOT EXISTS prescribed_weight_kg FLOAT,
ADD COLUMN IF NOT EXISTS prescribed_rpe INT CHECK (prescribed_rpe BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS prescribed_rir INT CHECK (prescribed_rir BETWEEN 0 AND 5),
ADD COLUMN IF NOT EXISTS prescribed_percentage INT CHECK (prescribed_percentage BETWEEN 1 AND 100),
ADD COLUMN IF NOT EXISTS tempo TEXT;

-- ============================================
-- 2. ALTER workout_logs (client feedback + prescription snapshot)
-- ============================================
ALTER TABLE workout_logs
ADD COLUMN IF NOT EXISTS prescribed_reps TEXT,
ADD COLUMN IF NOT EXISTS prescribed_weight_kg FLOAT,
ADD COLUMN IF NOT EXISTS prescribed_rpe INT,
ADD COLUMN IF NOT EXISTS prescribed_rir INT,
ADD COLUMN IF NOT EXISTS actual_rpe INT CHECK (actual_rpe BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS actual_rir INT CHECK (actual_rir BETWEEN 0 AND 5);
