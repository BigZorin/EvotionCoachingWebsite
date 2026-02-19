-- Fix message_type CHECK constraint to allow all media types
-- The original constraint only allowed: text, voice, image
-- This adds: video, document

-- Drop old constraint and add new one
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_message_type_check;
ALTER TABLE messages ADD CONSTRAINT messages_message_type_check
  CHECK (message_type IN ('text', 'voice', 'image', 'video', 'document'));

-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-notes', 'voice-notes', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for voice-notes
DO $$ BEGIN
  CREATE POLICY "Users upload own voice notes"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'voice-notes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read voice notes"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'voice-notes');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Storage RLS policies for chat-media
DO $$ BEGIN
  CREATE POLICY "Users upload own chat media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read chat media"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'chat-media');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enable Supabase Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
