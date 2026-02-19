// Test connection now
const { Client } = require('pg');

const connectionString = "postgresql://postgres.ezciexorsprdrjhntqie:Kankerneger123%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

console.log('🔄 Testing connection...');
console.log('');

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

client.connect()
  .then(() => {
    console.log('✅✅✅ CONNECTION SUCCESSFUL! ✅✅✅');
    console.log('');
    return client.query('SELECT NOW() as time, current_database() as db, current_user as user, version()');
  })
  .then((res) => {
    console.log('Database Information:');
    console.log('  Time:', res.rows[0].time);
    console.log('  Database:', res.rows[0].db);
    console.log('  User:', res.rows[0].user);
    console.log('  PostgreSQL:', res.rows[0].version.split(' ').slice(0, 2).join(' '));
    console.log('');
    return client.end();
  })
  .then(() => {
    console.log('🎉 SUCCESS! Database connection is working!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Test with Prisma');
    console.log('  2. Generate Prisma client');
    console.log('  3. Start your dev server');
  })
  .catch((err) => {
    console.error('❌ Connection failed:');
    console.error('  Error:', err.message);
    console.error('  Code:', err.code);

    if (err.code === 'XX000' || err.message.includes('Circuit breaker')) {
      console.error('');
      console.error('⚠️  Circuit breaker is still active.');
      console.error('    Please wait another 5 minutes and try again.');
    } else if (err.code === '28P01') {
      console.error('');
      console.error('⚠️  Authentication failed.');
      console.error('    Please verify the password is correct.');
    }
    process.exit(1);
  });
