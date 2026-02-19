-- Add section field to workout_template_exercises for Warm-up / Workout / Cool-down
ALTER TABLE workout_template_exercises
ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'workout'
  CHECK (section IN ('warm_up', 'workout', 'cool_down'));
