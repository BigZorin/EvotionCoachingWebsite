import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezciexorsprdrjhntqie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Y2lleG9yc3ByZHJqaG50cWllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg4NzY4NywiZXhwIjoyMDg2NDYzNjg3fQ.psMkqs1Gev-QkJLym7-YUBf2RMW96z4e9IjnnwqnRFg'

async function executeSql() {
  const sql = readFileSync('migrations/006_update_schema_for_supabase_auth.sql', 'utf-8')

  console.log('Executing migration...\n')

  // Use raw SQL execution via Postgres connection
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    })

    console.log('Response status:', response.status)
    const text = await response.text()
    console.log('Response:', text)

    if (!response.ok) {
      // Try alternative approach using Supabase client
      console.log('\nAlternative approach: Using createClient with Postgres')

      const supabase = createClient(supabaseUrl, supabaseKey)

      // Execute SQL statement by statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'))

      for (const statement of statements) {
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement })
          if (error) {
            console.error('Error executing statement:', error)
          } else {
            console.log('✓ Statement executed')
          }
        } catch (err) {
          console.log('Could not execute via rpc:', err)
        }
      }

      console.log('\n❌ Could not execute migration automatically.')
      console.log('\nPlease execute the migration manually:')
      console.log('1. Go to: https://supabase.com/dashboard/project/ezciexorsprdrjhntqie/sql/new')
      console.log('2. Copy the contents of: packages/database/migrations/006_update_schema_for_supabase_auth.sql')
      console.log('3. Paste and run the SQL')
    } else {
      console.log('\n✅ Migration executed successfully!')
    }
  } catch (err) {
    console.error('\n❌ Error:', err)
    console.log('\nPlease execute the migration manually:')
    console.log('1. Go to: https://supabase.com/dashboard/project/ezciexorsprdrjhntqie/sql/new')
    console.log('2. Copy the contents of: packages/database/migrations/006_update_schema_for_supabase_auth.sql')
    console.log('3. Paste and run the SQL')
  }
}

executeSql().then(() => process.exit(0))
