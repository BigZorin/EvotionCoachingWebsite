-- Fix UUID vs TEXT type mismatch in RLS policies.
-- Prisma stores user IDs as TEXT, but auth.uid() returns UUID.
-- All comparisons need explicit ::text cast.

-- Fix conversations RLS
DROP POLICY IF EXISTS "Users view own conversations" ON conversations;
CREATE POLICY "Users view own conversations" ON conversations
  FOR SELECT USING (auth.uid()::text = coach_id OR auth.uid()::text = client_id);

DROP POLICY IF EXISTS "Coaches create conversations" ON conversations;
CREATE POLICY "Coaches create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid()::text = coach_id OR auth.uid()::text = client_id);

DROP POLICY IF EXISTS "Users update own conversations" ON conversations;
CREATE POLICY "Users update own conversations" ON conversations
  FOR UPDATE USING (auth.uid()::text = coach_id OR auth.uid()::text = client_id);

-- Fix messages RLS
DROP POLICY IF EXISTS "Users read own messages" ON messages;
CREATE POLICY "Users read own messages" ON messages
  FOR SELECT USING (auth.uid()::text = sender_id OR auth.uid()::text = receiver_id);

DROP POLICY IF EXISTS "Users send messages" ON messages;
CREATE POLICY "Users send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid()::text = sender_id);

DROP POLICY IF EXISTS "Users update received messages" ON messages;
CREATE POLICY "Users update received messages" ON messages
  FOR UPDATE USING (auth.uid()::text = receiver_id);
