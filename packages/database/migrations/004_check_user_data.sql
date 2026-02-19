-- Check if users exist in our custom tables
SELECT 'Users in auth.users:' as info;
SELECT id, email, created_at FROM auth.users;

SELECT '' as separator;
SELECT 'Users in public.users:' as info;
SELECT id, email, role, created_at FROM public.users;

SELECT '' as separator;
SELECT 'Profiles in public.profiles:' as info;
SELECT id, user_id, first_name, last_name, created_at FROM public.profiles;
