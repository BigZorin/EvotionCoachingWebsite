// Test authentication with explicit parameters
const { Client } = require('pg');

const config = {
  host: 'aws-1-eu-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.ezciexorsprdrjhntqie',  // Full username with dot
  password: 'XVVzpTOAnORplYyW',
  ssl: { rejectUnauthorized: false }
};

console.log('Testing with explicit config:');
console.log('Host:', config.host);
console.log('Port:', config.port);
console.log('User:', config.user);
console.log('Database:', config.database);
console.log('');

const client = new Client(config);

client.connect()
  .then(() => {
    console.log('✅ Connected successfully!');
    return client.query('SELECT NOW() as time, current_user as user');
  })
  .then((res) => {
    console.log('✅ Query successful:');
    console.log('   Current time:', res.rows[0].time);
    console.log('   Connected as:', res.rows[0].user);
    return client.end();
  })
  .catch((err) => {
    console.error('❌ Connection failed:');
    console.error('   Error:', err.message);
    console.error('   Code:', err.code);
    if (err.code === '28P01') {
      console.error('\n💡 This is an authentication error. Please verify:');
      console.error('   1. Username is correct (should include project ref after dot)');
      console.error('   2. Password is correct');
      console.error('   3. Try resetting your database password in Supabase dashboard');
    }
    process.exit(1);
  });
