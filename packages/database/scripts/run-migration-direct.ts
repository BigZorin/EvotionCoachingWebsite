import { Client } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

async function runMigration() {
  const client = new Client({
    connectionString: 'postgresql://postgres.ezciexorsprdrjhntqie:6g0l8DGYlqN5I1tc@aws-1-eu-west-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🔌 Connecting to database...')
    await client.connect()
    console.log('✅ Connected!\n')

    const migrationPath = join(process.cwd(), 'migrations', '006_update_schema_for_supabase_auth.sql')
    const sql = readFileSync(migrationPath, 'utf-8')

    console.log('📝 Executing migration...\n')
    const result = await client.query(sql)

    console.log('✅ Migration executed successfully!')
    console.log('\nResult:', result.rows)

    // Verify the changes
    console.log('\n📊 Verifying database state...')

    const { rows: users } = await client.query(`
      SELECT id, email, role FROM public.users LIMIT 5
    `)
    console.log('\nUsers table:', users)

    const { rows: profiles } = await client.query(`
      SELECT user_id, first_name, last_name FROM public.profiles LIMIT 5
    `)
    console.log('Profiles table:', profiles)

    const { rows: triggers } = await client.query(`
      SELECT trigger_name, event_manipulation, event_object_table
      FROM information_schema.triggers
      WHERE trigger_name = 'on_auth_user_created'
    `)
    console.log('\nTrigger status:', triggers.length > 0 ? '✅ Enabled' : '❌ Not found')

  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  } finally {
    await client.end()
    console.log('\n🔌 Disconnected from database')
  }
}

runMigration().then(() => {
  console.log('\n✨ All done!')
  process.exit(0)
})
