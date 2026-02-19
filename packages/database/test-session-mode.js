// Test with Session Mode pooler (port 5432)
const { Client } = require('pg');

const connectionString = "postgresql://postgres.ezciexorsprdrjhntqie:XVVzpTOAnORplYyW@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

console.log('Testing Session Mode (port 5432)...');
console.log('Connection string:', connectionString.replace(/:([^:@]+)@/, ':****@'));

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

client.connect()
  .then(() => {
    console.log('\n✅ Connected successfully with Session Mode!');
    return client.query('SELECT NOW() as time, current_database() as db, current_user as user');
  })
  .then((res) => {
    console.log('✅ Query successful:');
    console.log('   Time:', res.rows[0].time);
    console.log('   Database:', res.rows[0].db);
    console.log('   User:', res.rows[0].user);
    return client.end();
  })
  .catch((err) => {
    console.error('\n❌ Session Mode failed:');
    console.error('   Error:', err.message);
    console.error('   Code:', err.code);

    if (err.code === '28P01') {
      console.error('\n⚠️  Authentication failed. Please:');
      console.error('   1. Reset your database password in Supabase Dashboard');
      console.error('   2. Wait 2-3 minutes for circuit breaker to reset');
      console.error('   3. Copy the new connection string');
    }
    process.exit(1);
  })
  .finally(() => {
    console.log('\nTest complete');
  });
