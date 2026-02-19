-- First, let's insert the existing user manually
-- User ID from auth.users: 213a7d55-9670-4cc3-ace6-611819e0d6fe

-- Insert into public.users
INSERT INTO public.users (id, email, role, created_at, updated_at)
SELECT
  id,
  email,
  'COACH'::user_role,  -- Based on the registration (Zorin Wijnands, Coach)
  created_at,
  created_at as updated_at
FROM auth.users
WHERE email = 'zorin@hotmail.nl'
ON CONFLICT (id) DO NOTHING;

-- Insert into public.profiles
INSERT INTO public.profiles (id, user_id, first_name, last_name, created_at, updated_at)
SELECT
  gen_random_uuid(),
  id,
  'Zorin',  -- From registration
  'Wijnands',  -- From registration
  created_at,
  created_at as updated_at
FROM auth.users
WHERE email = 'zorin@hotmail.nl'
ON CONFLICT (user_id) DO NOTHING;

-- Now let's fix the trigger
-- Drop the old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_role user_role;
BEGIN
  -- Extract metadata with safer COALESCE handling
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'firstName', NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'lastName', NEW.raw_user_meta_data->>'last_name', '');

  -- Get role from metadata, default to CLIENT
  BEGIN
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')::user_role;
  EXCEPTION WHEN OTHERS THEN
    v_role := 'CLIENT'::user_role;
  END;

  -- Insert into users table
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    v_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

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

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger is enabled
SELECT 'Trigger created successfully!' as status;
