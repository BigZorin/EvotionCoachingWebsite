-- Update schema for Supabase Auth compatibility
-- This migration removes fields from users table that are handled by Supabase Auth
-- and moves user profile fields to the profiles table

-- Step 1: Add new columns to profiles table if they don't exist
DO $$
BEGIN
    -- Add first_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='first_name') THEN
        ALTER TABLE profiles ADD COLUMN first_name TEXT DEFAULT '';
    END IF;

    -- Add last_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='last_name') THEN
        ALTER TABLE profiles ADD COLUMN last_name TEXT DEFAULT '';
    END IF;

    -- Add avatar_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;

    -- Add created_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='created_at') THEN
        ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Add updated_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='updated_at') THEN
        ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Step 2: Migrate existing data from users to profiles (if any columns exist)
DO $$
BEGIN
    -- Migrate first_name if it exists in users
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='first_name') THEN
        UPDATE profiles p
        SET first_name = u.first_name
        FROM users u
        WHERE p.user_id = u.id AND u.first_name IS NOT NULL;
    END IF;

    -- Migrate last_name if it exists in users
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_name') THEN
        UPDATE profiles p
        SET last_name = u.last_name
        FROM users u
        WHERE p.user_id = u.id AND u.last_name IS NOT NULL;
    END IF;

    -- Migrate avatar_url if it exists in users
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
        UPDATE profiles p
        SET avatar_url = u.avatar_url
        FROM users u
        WHERE p.user_id = u.id AND u.avatar_url IS NOT NULL;
    END IF;
END $$;

-- Step 3: Drop columns from users table that are now handled by Supabase Auth or moved to profiles
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;
ALTER TABLE users DROP COLUMN IF EXISTS first_name;
ALTER TABLE users DROP COLUMN IF EXISTS last_name;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE users DROP COLUMN IF EXISTS phone;

-- Step 4: Ensure UserRole ENUM exists (Prisma creates this)
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'COACH', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 5: Update the trigger function to use the new schema
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_role "UserRole";
BEGIN
  -- Extract metadata
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'firstName', NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'lastName', NEW.raw_user_meta_data->>'last_name', '');

  -- Get role from metadata, default to CLIENT
  BEGIN
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')::"UserRole";
  EXCEPTION WHEN OTHERS THEN
    v_role := 'CLIENT'::"UserRole";
  END;

  -- Insert into users table (minimal fields)
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (NEW.id, NEW.email, v_role, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- Insert into profiles table (with user details)
  INSERT INTO public.profiles (
    id,
    user_id,
    first_name,
    last_name,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,
    v_first_name,
    v_last_name,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the auth.users insert
  RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Step 6: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Insert the existing user manually if they don't exist
INSERT INTO public.users (id, email, role, created_at, updated_at)
SELECT
  id,
  email,
  'COACH'::"UserRole",
  created_at,
  created_at as updated_at
FROM auth.users
WHERE email = 'zorin@hotmail.nl'
ON CONFLICT (id) DO UPDATE
SET role = 'COACH'::"UserRole";

INSERT INTO public.profiles (id, user_id, first_name, last_name, created_at, updated_at)
SELECT
  gen_random_uuid(),
  id,
  'Zorin',
  'Wijnands',
  created_at,
  created_at as updated_at
FROM auth.users
WHERE email = 'zorin@hotmail.nl'
ON CONFLICT (user_id) DO UPDATE
SET first_name = 'Zorin', last_name = 'Wijnands';

SELECT 'Migration completed successfully!' as status;
