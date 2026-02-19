-- Client check-in settings: coach sets which day of the week the weekly check-in appears
CREATE TABLE IF NOT EXISTS client_check_in_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weekly_check_in_day INT NOT NULL DEFAULT 0,  -- 0=Sunday, 1=Monday, ..., 6=Saturday (matches JS Date.getDay())
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_client_check_in_settings UNIQUE (client_id)
);

-- RLS
ALTER TABLE client_check_in_settings ENABLE ROW LEVEL SECURITY;

-- Client can read their own settings
CREATE POLICY "client_read_own_settings"
  ON client_check_in_settings FOR SELECT
  USING (auth.uid() = client_id);

-- Coach can manage settings (insert/update) for their clients
CREATE POLICY "coach_manage_settings"
  ON client_check_in_settings FOR ALL
  USING (auth.uid() = coach_id)
  WITH CHECK (auth.uid() = coach_id);
