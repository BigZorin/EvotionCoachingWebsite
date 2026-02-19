-- Fix: Prisma @default(uuid()) only generates UUIDs in the Prisma client,
-- not at the database level. Since the mobile app inserts directly via
-- Supabase (bypassing Prisma), these columns need a database-level DEFAULT.

ALTER TABLE client_workouts ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE workout_logs ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
