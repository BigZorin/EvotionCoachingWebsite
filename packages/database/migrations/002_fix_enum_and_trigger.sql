-- Fix ENUM type and trigger
-- First, drop the old trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the UserRole enum type
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('CLIENT', 'COACH', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Recreate the trigger function with simpler logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table with default CLIENT role
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'CLIENT'::user_role,  -- Default to CLIENT for now
    NOW(),
    NOW()
  );

  -- Insert into profiles table
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
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
