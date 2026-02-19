import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezciexorsprdrjhntqie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Y2lleG9yc3ByZHJqaG50cWllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg4NzY4NywiZXhwIjoyMDg2NDYzNjg3fQ.psMkqs1Gev-QkJLym7-YUBf2RMW96z4e9IjnnwqnRFg'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkUsers() {
  console.log('=== Checking Auth Users ===')
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error('Error fetching auth users:', authError)
  } else {
    console.log(`Found ${authUsers.users.length} users in auth.users:`)
    authUsers.users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id}, Created: ${user.created_at})`)
    })
  }

  console.log('\n=== Checking Public Users Table ===')
  const { data: publicUsers, error: usersError } = await supabase
    .from('users')
    .select('*')

  if (usersError) {
    console.error('Error fetching public users:', usersError)
  } else {
    console.log(`Found ${publicUsers?.length || 0} users in public.users:`)
    publicUsers?.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id}, Role: ${user.role})`)
    })
  }

  console.log('\n=== Checking Profiles Table ===')
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
  } else {
    console.log(`Found ${profiles?.length || 0} profiles:`)
    profiles?.forEach(profile => {
      console.log(`  - ${profile.first_name} ${profile.last_name} (User ID: ${profile.user_id})`)
    })
  }
}

checkUsers().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
