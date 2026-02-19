-- Fix migration: Add missing ENUMs
-- Date: 2025-02-13
-- Description: Create DifficultyLevel and AIGenerationStatus enums

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

-- Update exercises.difficulty to use enum (if column exists but is VARCHAR)
DO $$ BEGIN
    -- Check if difficulty column exists and is not already an enum
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'exercises'
        AND column_name = 'difficulty'
        AND data_type = 'character varying'
    ) THEN
        -- Drop default first
        ALTER TABLE exercises ALTER COLUMN difficulty DROP DEFAULT;

        -- Change to enum type
        ALTER TABLE exercises
        ALTER COLUMN difficulty TYPE "DifficultyLevel"
        USING difficulty::"DifficultyLevel";

        -- Re-add default
        ALTER TABLE exercises
        ALTER COLUMN difficulty SET DEFAULT 'BEGINNER'::"DifficultyLevel";
    END IF;
END $$;

-- Update ai_workout_generations.status to use enum (if table and column exist)
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'ai_workout_generations'
        AND column_name = 'status'
        AND data_type = 'character varying'
    ) THEN
        -- Drop default first
        ALTER TABLE ai_workout_generations ALTER COLUMN status DROP DEFAULT;

        -- Change to enum type
        ALTER TABLE ai_workout_generations
        ALTER COLUMN status TYPE "AIGenerationStatus"
        USING status::"AIGenerationStatus";

        -- Re-add default
        ALTER TABLE ai_workout_generations
        ALTER COLUMN status SET DEFAULT 'PENDING'::"AIGenerationStatus";
    END IF;
END $$;
