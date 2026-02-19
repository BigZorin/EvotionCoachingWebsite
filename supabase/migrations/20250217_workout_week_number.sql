-- Add week_number to client_workouts so each week in a program block
-- gets its own independent workout instance.
-- Previously: 1 client_workout per template (shared across all weeks)
-- Now: 1 client_workout per template per week

ALTER TABLE client_workouts ADD COLUMN IF NOT EXISTS week_number INTEGER;
