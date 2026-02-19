// Test with new password
const { Client } = require('pg');

const connectionString = "postgresql://postgres.ezciexorsprdrjhntqie:5mjve1hlagWdCuTI@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

console.log('🔄 Testing connection with new password...');
console.log('Connection string:', connectionString.replace(/:([^:@]+)@/, ':****@'));
console.log('');

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

client.connect()
  .then(() => {
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log('');
    return client.query('SELECT NOW() as time, current_database() as db, current_user as user, version()');
  })
  .then((res) => {
    console.log('✅ Query executed successfully:');
    console.log('   📅 Time:', res.rows[0].time);
    console.log('   🗄️  Database:', res.rows[0].db);
    console.log('   👤 User:', res.rows[0].user);
    console.log('   🔧 Version:', res.rows[0].version.split(' ')[0] + ' ' + res.rows[0].version.split(' ')[1]);
    console.log('');
    return client.end();
  })
  .then(() => {
    console.log('🎉 Database connection is working perfectly!');
    console.log('Next step: Test with Prisma');
  })
  .catch((err) => {
    console.error('❌ Connection failed:');
    console.error('   Error:', err.message);
    console.error('   Code:', err.code);
    process.exit(1);
  });
