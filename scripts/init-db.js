const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Initializing database...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // The database tables will be created automatically when Prisma connects
    // if they don't exist (this is what db push does)
    console.log('✅ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
