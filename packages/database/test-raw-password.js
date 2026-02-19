// Test with raw password (no URL encoding)
const { Client } = require('pg');

// Try both with and without encoding
const rawPassword = "Kankerneger123!";
const encodedPassword = "Kankerneger123%21";

console.log('🔄 Testing with raw password...');

const client1 = new Client({
  host: 'aws-1-eu-west-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.ezciexorsprdrjhntqie',
  password: rawPassword,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

client1.connect()
  .then(() => {
    console.log('✅ SUCCESS with raw password!');
    return client1.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('✅ Query successful:', res.rows[0]);
    return client1.end();
  })
  .then(() => {
    console.log('🎉 Raw password works!');
  })
  .catch((err) => {
    console.error('❌ Raw password failed:', err.message);
    console.log('');
    console.log('Trying with URL-encoded password...');

    const client2 = new Client({
      connectionString: `postgresql://postgres.ezciexorsprdrjhntqie:${encodedPassword}@aws-1-eu-west-1.pooler.supabase.com:5432/postgres`,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    return client2.connect()
      .then(() => {
        console.log('✅ SUCCESS with encoded password!');
        return client2.query('SELECT NOW()');
      })
      .then((res) => {
        console.log('✅ Query successful:', res.rows[0]);
        return client2.end();
      })
      .then(() => {
        console.log('🎉 URL-encoded password works!');
      });
  })
  .catch((err) => {
    console.error('❌ Both methods failed:', err.message);
    console.error('Code:', err.code);
    process.exit(1);
  });
