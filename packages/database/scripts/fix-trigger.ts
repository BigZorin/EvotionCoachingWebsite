import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezciexorsprdrjhntqie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Y2lleG9yc3ByZHJqaG50cWllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg4NzY4NywiZXhwIjoyMDg2NDYzNjg3fQ.psMkqs1Gev-QkJLym7-YUBf2RMW96z4e9IjnnwqnRFg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixTrigger() {
  console.log('Step 1: Inserting existing user into public.users...')

  // Get the user from auth.users
  const { data: authUser } = await supabase.auth.admin.listUsers()
  const user = authUser?.users.find(u => u.email === 'zorin@hotmail.nl')

  if (!user) {
    console.error('User not found!')
    return
  }

  console.log(`Found user: ${user.email} (${user.id})`)

  // Insert into public.users
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: user.id,
      email: user.email,
      role: 'COACH',
      created_at: user.created_at,
      updated_at: user.created_at
    })

  if (userError && !userError.message.includes('duplicate')) {
    console.error('Error inserting user:', userError)
  } else {
    console.log('✅ User inserted into public.users')
  }

  console.log('\nStep 2: Inserting profile...')

  // Insert into public.profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      user_id: user.id,
      first_name: 'Zorin',
      last_name: 'Wijnands',
      created_at: user.created_at,
      updated_at: user.created_at
    })

  if (profileError && !profileError.message.includes('duplicate')) {
    console.error('Error inserting profile:', profileError)
  } else {
    console.log('✅ Profile inserted')
  }

  console.log('\nStep 3: You need to manually execute the trigger fix in Supabase SQL Editor')
  console.log('Go to: https://supabase.com/dashboard/project/ezciexorsprdrjhntqie/sql/new')
  console.log('\nExecute this SQL:\n')
  console.log(`
-- Drop old trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved trigger function
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
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'firstName', NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'lastName', NEW.raw_user_meta_data->>'last_name', '');

  BEGIN
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')::user_role;
  EXCEPTION WHEN OTHERS THEN
    v_role := 'CLIENT'::user_role;
  END;

  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (NEW.id, NEW.email, v_role, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (id, user_id, first_name, last_name, created_at, updated_at)
  VALUES (gen_random_uuid(), NEW.id, v_first_name, v_last_name, NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
  `)

  console.log('\n✅ User data inserted successfully!')
  console.log('Once you run the SQL above, the trigger will be re-enabled.')
}

fixTrigger().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
