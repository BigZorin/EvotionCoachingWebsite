const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.ezciexorsprdrjhntqie:Kankerneger123%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres'
});

(async () => {
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS coaching_events (
      id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id             UUID NOT NULL REFERENCES auth.users(id),
      coach_id              UUID NOT NULL REFERENCES auth.users(id),
      event_type            TEXT NOT NULL,
      area                  TEXT NOT NULL DEFAULT 'general',
      title                 TEXT NOT NULL,
      description           TEXT,
      source                TEXT NOT NULL DEFAULT 'manual',
      ai_generation_log_id  UUID REFERENCES ai_generation_logs(id) ON DELETE SET NULL,
      related_entity_type   TEXT,
      related_entity_id     TEXT,
      event_data            JSONB DEFAULT '{}',
      created_at            TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_coaching_events_client_date ON coaching_events(client_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_coaching_events_type ON coaching_events(event_type);

    ALTER TABLE coaching_events ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "service_role_all_coaching_events" ON coaching_events;
    CREATE POLICY "service_role_all_coaching_events" ON coaching_events
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  `);
  console.log('coaching_events table created');
  await client.end();
})().catch(e => { console.error(e.message); process.exit(1); });
