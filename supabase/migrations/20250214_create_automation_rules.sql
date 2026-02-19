-- Automation Rules: coaches can define automated reminders and triggers

CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,

  -- Trigger configuration
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'checkin_reminder',     -- Remind client to do check-in
    'workout_reminder',     -- Remind client about scheduled workout
    'welcome',              -- Welcome message for new clients
    'inactivity',           -- Client hasn't checked in for X days
    'streak_celebration',   -- Celebrate habit streaks
    'weekly_summary'        -- Weekly progress summary
  )),

  -- Schedule (for recurring triggers)
  schedule_cron TEXT,       -- cron expression, e.g. "0 9 * * 1" (Monday 9am)
  schedule_time TEXT,       -- e.g. "09:00" for daily triggers
  schedule_days JSONB,      -- e.g. ["monday","wednesday","friday"]

  -- Conditions
  conditions JSONB DEFAULT '{}',
  -- Examples:
  -- checkin_reminder: { "check_in_type": "daily", "hours_before_deadline": 4 }
  -- inactivity: { "days_inactive": 3 }
  -- streak_celebration: { "streak_milestones": [7, 14, 30] }

  -- Action
  action_type TEXT NOT NULL DEFAULT 'push_notification' CHECK (action_type IN (
    'push_notification',
    'in_app_notification',
    'both'
  )),
  action_title TEXT,        -- notification title
  action_message TEXT,      -- notification message (supports {name}, {days} placeholders)

  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation logs: track when automations fire
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'skipped')),
  error_message TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_automation_rules_coach ON automation_rules(coach_id);
CREATE INDEX IF NOT EXISTS idx_automation_rules_trigger ON automation_rules(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automation_logs_rule ON automation_logs(rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_client ON automation_logs(client_id);

-- RLS
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Coaches manage their own rules
CREATE POLICY "Coaches manage own automation rules" ON automation_rules
  FOR ALL USING (auth.uid() = coach_id);

-- Coaches view their automation logs
CREATE POLICY "Coaches view own automation logs" ON automation_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM automation_rules r
      WHERE r.id = automation_logs.rule_id AND r.coach_id = auth.uid()
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_automation_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_automation_rules_updated_at
  BEFORE UPDATE ON automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_automation_rules_updated_at();
