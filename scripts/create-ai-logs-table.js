const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.ezciexorsprdrjhntqie:Kankerneger123%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres'
});

(async () => {
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS ai_generation_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL REFERENCES auth.users(id),
      coach_id UUID NOT NULL REFERENCES auth.users(id),
      generation_type TEXT NOT NULL,
      title TEXT,
      result JSONB NOT NULL,
      model TEXT,
      tokens_used INTEGER,
      rag_used BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "service_role_all_ai_logs" ON ai_generation_logs;
    CREATE POLICY "service_role_all_ai_logs" ON ai_generation_logs
      FOR ALL TO service_role USING (true) WITH CHECK (true);

    CREATE INDEX IF NOT EXISTS idx_ai_gen_logs_client ON ai_generation_logs(client_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_ai_gen_logs_type ON ai_generation_logs(client_id, generation_type, created_at DESC);
  `);
  console.log('ai_generation_logs table created');
  await client.end();
})().catch(e => { console.error(e.message); process.exit(1); });
