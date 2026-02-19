// Test Prisma connection with a simple query
const { PrismaClient } = require('./src/generated/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('Testing Prisma connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@'));

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('\n✅ Connection successful!');
    console.log('Current time from database:', result);

    // Try counting users
    const userCount = await prisma.user.count();
    console.log(`\n✅ Found ${userCount} users in the database`);

  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\nDisconnected from database');
  }
}

testConnection();
