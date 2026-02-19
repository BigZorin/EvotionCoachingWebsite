import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = 'https://ezciexorsprdrjhntqie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Y2lleG9yc3ByZHJqaG50cWllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg4NzY4NywiZXhwIjoyMDg2NDYzNjg3fQ.psMkqs1Gev-QkJLym7-YUBf2RMW96z4e9IjnnwqnRFg'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

async function runMigration() {
  const migrationFile = process.argv[2]
  if (!migrationFile) {
    console.error('Usage: tsx run-migration.ts <migration-file>')
    process.exit(1)
  }

  const migrationPath = join(process.cwd(), 'migrations', migrationFile)
  console.log(`Reading migration from: ${migrationPath}`)

  const sql = readFileSync(migrationPath, 'utf-8')
  console.log('Executing migration...\n')

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      // If exec_sql doesn't exist, try direct execution
      console.log('Trying direct SQL execution...')
      const { data: directData, error: directError } = await supabase
        .from('_migrations')
        .select('*')
        .limit(1)

      // We'll need to use Postgres REST API directly
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql })
      })

      if (!response.ok) {
        throw new Error(`Migration failed: ${await response.text()}`)
      }

      console.log('✅ Migration executed successfully!')
    } else {
      console.log('✅ Migration executed successfully!')
      if (data) console.log('Result:', data)
    }
  } catch (err) {
    console.error('❌ Migration failed:', err)
    process.exit(1)
  }
}

runMigration().then(() => process.exit(0))
