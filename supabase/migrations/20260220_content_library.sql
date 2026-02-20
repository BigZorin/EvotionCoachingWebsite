-- ============================================================
-- CONTENT LIBRARY: Coach content items
-- ============================================================

CREATE TABLE IF NOT EXISTS content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('video', 'article', 'image', 'pdf', 'template')),
  category TEXT,
  url TEXT,
  thumbnail TEXT,
  duration TEXT,
  views INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_content_items_coach ON content_items(coach_id);
CREATE INDEX idx_content_items_type ON content_items(type);
CREATE INDEX idx_content_items_status ON content_items(status);

-- RLS Policies
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Coaches manage own content
DROP POLICY IF EXISTS "Coaches manage own content" ON content_items;
CREATE POLICY "Coaches manage own content" ON content_items
  FOR ALL USING (coach_id = auth.uid());

-- Service role bypass
DROP POLICY IF EXISTS "Service role full access content" ON content_items;
CREATE POLICY "Service role full access content" ON content_items
  FOR ALL USING (auth.role() = 'service_role');
