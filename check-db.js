const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  console.log('Testing database connection...');
  
  const prisma = new PrismaClient();
  
  try {
    const divisions = await prisma.division.findMany();
    console.log('Found', divisions.length, 'divisions');
    
    if (divisions.length > 0) {
      divisions.forEach(div => console.log('- ' + div.name));
    } else {
      console.log('No divisions found in database');
    }
    
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
