const { execSync } = require('child_process');

console.log("Running Prisma database migration...");

try {
  console.log("Pushing database schema...");
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log("Database migration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exit(1);
}
