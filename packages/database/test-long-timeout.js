// Test with longer timeout
const { Client } = require('pg');

const connectionString = "postgresql://postgres.ezciexorsprdrjhntqie:5mjve1hlagWdCuTI@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

console.log('🔄 Testing with 30 second timeout...');
console.log('This may take a while if the password reset is still propagating.');
console.log('');

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000, // 30 seconds
});

client.connect()
  .then(() => {
    console.log('✅ CONNECTED!');
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('✅ Query successful:', res.rows[0]);
    return client.end();
  })
  .then(() => {
    console.log('🎉 Success! The database is ready.');
  })
  .catch((err) => {
    console.error('❌ Still failing after 30 seconds:');
    console.error('   Error:', err.message);
    console.error('');
    console.error('💡 Suggestions:');
    console.error('   1. Check Supabase dashboard for any warnings');
    console.error('   2. Verify the project status is "Active"');
    console.error('   3. Try again in 2-3 minutes');
    console.error('   4. Check if there are any ongoing maintenance');
    process.exit(1);
  });
