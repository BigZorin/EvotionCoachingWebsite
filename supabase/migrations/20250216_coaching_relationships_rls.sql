-- Enable RLS on coaching_relationships
ALTER TABLE coaching_relationships ENABLE ROW LEVEL SECURITY;

-- Clients and coaches can view their own relationships
CREATE POLICY "Users view own coaching relationships" ON coaching_relationships
  FOR SELECT USING (auth.uid()::text = client_id OR auth.uid()::text = coach_id);

-- Only service_role (admin backend) should insert/update/delete coaching relationships,
-- but we add a coach policy for flexibility
CREATE POLICY "Coaches manage own relationships" ON coaching_relationships
  FOR ALL USING (auth.uid()::text = coach_id);

-- Add database-level UUID defaults for Prisma-managed tables that lack them
ALTER TABLE coaching_relationships ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE conversations ALTER COLUMN id SET DEFAULT gen_random_uuid();
