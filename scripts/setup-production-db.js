#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up production database...');

// Check if DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.log('Please set your PostgreSQL connection string in Railway environment variables');
  process.exit(1);
}

// Check if it's a PostgreSQL URL
if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  console.error('❌ DATABASE_URL must be a PostgreSQL connection string');
  console.log('Expected format: postgresql://username:password@host:port/database');
  process.exit(1);
}

console.log('✅ DATABASE_URL is set and valid');

// Copy production schema to main schema
const productionSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.production.prisma');
const mainSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (fs.existsSync(productionSchemaPath)) {
  fs.copyFileSync(productionSchemaPath, mainSchemaPath);
  console.log('✅ Copied production schema');
} else {
  console.error('❌ Production schema file not found');
  process.exit(1);
}

try {
  // Generate Prisma client
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');

  // Push schema to database
  console.log('🔄 Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Schema pushed to database');

  console.log('🎉 Production database setup complete!');
  console.log('Your divisions will now persist permanently!');
} catch (error) {
  console.error('❌ Error setting up database:', error.message);
  process.exit(1);
}
