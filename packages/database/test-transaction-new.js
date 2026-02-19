// Test Transaction mode with new password
const { Client } = require('pg');

const connectionString = "postgresql://postgres.ezciexorsprdrjhntqie:5mjve1hlagWdCuTI@aws-1-eu-west-1.pooler.supabase.com:6543/postgres";

console.log('🔄 Testing Transaction Mode (port 6543) with new password...');
console.log('');

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

client.connect()
  .then(() => {
    console.log('✅ CONNECTION SUCCESSFUL!');
    return client.query('SELECT NOW() as time, current_user as user');
  })
  .then((res) => {
    console.log('✅ Query successful:');
    console.log('   Time:', res.rows[0].time);
    console.log('   User:', res.rows[0].user);
    return client.end();
  })
  .then(() => {
    console.log('');
    console.log('🎉 Transaction mode works! Updating configuration...');
  })
  .catch((err) => {
    console.error('❌ Failed:');
    console.error('   Error:', err.message);
    console.error('   Code:', err.code);
    process.exit(1);
  });
