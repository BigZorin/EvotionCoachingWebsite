// Final test with URL-encoded password
const { Client } = require('pg');

const connectionString = "postgresql://postgres.ezciexorsprdrjhntqie:Kankerneger123%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

console.log('🔄 Testing connection with URL-encoded password...');
console.log('');

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

client.connect()
  .then(() => {
    console.log('✅ ✅ ✅ CONNECTION SUCCESSFUL! ✅ ✅ ✅');
    console.log('');
    return client.query('SELECT NOW() as time, current_database() as db, current_user as user');
  })
  .then((res) => {
    console.log('📊 Database Info:');
    console.log('   Time:', res.rows[0].time);
    console.log('   Database:', res.rows[0].db);
    console.log('   User:', res.rows[0].user);
    console.log('');
    return client.end();
  })
  .then(() => {
    console.log('🎉 SUCCESS! Database is connected and working!');
    console.log('');
    console.log('Next steps:');
    console.log('   1. ✅ Test with Prisma');
    console.log('   2. ✅ Generate Prisma client');
    console.log('   3. ✅ Restart your dev server');
  })
  .catch((err) => {
    console.error('❌ Connection failed:');
    console.error('   Error:', err.message);
    console.error('   Code:', err.code);
    process.exit(1);
  });
