// Test database connection directly with pg library
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.ezciexorsprdrjhntqie:XVVzpTOAnORplYyW@aws-1-eu-west-1.pooler.supabase.com:6543/postgres";

console.log('Testing connection with:', connectionString.replace(/:([^:@]+)@/, ':****@'));

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ Connected successfully!');
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('✅ Query successful:', res.rows[0]);
    return client.end();
  })
  .catch((err) => {
    console.error('❌ Connection failed:', err.message);
    console.error('Error code:', err.code);
    process.exit(1);
  })
  .finally(() => {
    console.log('Connection test complete');
  });
