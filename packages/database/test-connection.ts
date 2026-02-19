// Test database connection
import { PrismaClient } from './src/generated/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase database connection...')

    // Try to connect
    await prisma.$connect()
    console.log('✅ Successfully connected to Supabase database!')

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log('✅ Query executed successfully:', result)

    await prisma.$disconnect()
    console.log('✅ Connection test complete!')
  } catch (error) {
    console.error('❌ Connection failed:', error)
    process.exit(1)
  }
}

testConnection()
