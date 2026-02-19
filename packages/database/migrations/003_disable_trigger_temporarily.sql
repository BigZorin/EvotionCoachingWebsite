-- Temporarily disable trigger for testing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- We'll re-enable this later after we fix the schema mismatch issue
