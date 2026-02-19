-- ============================================================
-- Group Chat Tables
-- ============================================================

-- Group conversations (coach creates groups of clients)
CREATE TABLE IF NOT EXISTS public.group_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Group members
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.group_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_read_at TIMESTAMPTZ,
  is_muted BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(group_id, user_id)
);

-- Group messages
CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.group_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image')),
  media_url TEXT,
  media_duration REAL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_group ON public.group_messages(group_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_messages_sender ON public.group_messages(sender_id);

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE public.group_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- group_conversations: coaches can manage their own groups; members can view
CREATE POLICY "Coaches manage own groups" ON public.group_conversations
  FOR ALL USING (coach_id = auth.uid());

CREATE POLICY "Members can view groups" ON public.group_conversations
  FOR SELECT USING (
    id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

-- group_members: coaches manage members of their groups; users see own membership
CREATE POLICY "Coaches manage group members" ON public.group_members
  FOR ALL USING (
    group_id IN (SELECT id FROM public.group_conversations WHERE coach_id = auth.uid())
  );

CREATE POLICY "Users view own memberships" ON public.group_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own membership" ON public.group_members
  FOR UPDATE USING (user_id = auth.uid());

-- group_messages: members can view and send messages in their groups
CREATE POLICY "Members view group messages" ON public.group_messages
  FOR SELECT USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members send group messages" ON public.group_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

-- Coaches can delete messages in their groups
CREATE POLICY "Coaches delete group messages" ON public.group_messages
  FOR DELETE USING (
    group_id IN (SELECT id FROM public.group_conversations WHERE coach_id = auth.uid())
  );
