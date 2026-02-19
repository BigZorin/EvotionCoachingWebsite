-- Enhance messaging: add conversation_id, message types, and media support

-- 1. Add columns to messages table
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image')),
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_duration INTEGER; -- duration in seconds for voice notes

-- 2. Create index for conversation lookup
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- 3. Add last_message preview to conversations
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS last_message_text TEXT,
  ADD COLUMN IF NOT EXISTS unread_count_coach INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unread_count_client INTEGER DEFAULT 0;

-- 4. RLS policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages they sent or received
CREATE POLICY "Users read own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages (insert with themselves as sender)
CREATE POLICY "Users send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can update their own received messages (mark as read)
CREATE POLICY "Users update received messages" ON messages
  FOR UPDATE USING (auth.uid() = receiver_id);

-- 5. RLS policies for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Users can see their own conversations
CREATE POLICY "Users view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = coach_id OR auth.uid() = client_id);

-- Coaches can create conversations
CREATE POLICY "Coaches create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = coach_id OR auth.uid() = client_id);

-- Users can update their own conversations
CREATE POLICY "Users update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = coach_id OR auth.uid() = client_id);

-- 6. Enable Supabase Realtime for messages
-- Note: This needs to be done in the Supabase dashboard:
-- Go to Database > Replication and enable the 'messages' table
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
