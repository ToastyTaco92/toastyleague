#!/usr/bin/env node

/**
 * Environment Variable Debug Utility
 * 
 * This script safely logs environment variables for debugging purposes.
 * Passwords and sensitive data are masked for security.
 */

function maskPassword(url) {
  if (!url) return 'NOT SET';
  
  try {
    const urlObj = new URL(url);
    if (urlObj.password) {
      urlObj.password = '***MASKED***';
    }
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, mask any potential password patterns
    return url.replace(/:([^:@]+)@/, ':***MASKED***@');
  }
}

function getEnvironmentInfo() {
  const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || 'local',
    DATABASE_URL: maskPassword(process.env.DATABASE_URL),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '***MASKED***' : 'NOT SET',
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || 'NOT SET',
    PORT: process.env.PORT || 'NOT SET',
    RAILWAY_PROJECT_NAME: process.env.RAILWAY_PROJECT_NAME || 'NOT SET',
    RAILWAY_SERVICE_NAME: process.env.RAILWAY_SERVICE_NAME || 'NOT SET'
  };

  return env;
}

function printEnvironmentInfo() {
  console.log('🔍 Environment Variables Debug Info');
  console.log('=====================================');
  
  const env = getEnvironmentInfo();
  
  Object.entries(env).forEach(([key, value]) => {
    const status = value === 'NOT SET' ? '❌' : '✅';
    console.log(`${status} ${key}: ${value}`);
  });
  
  console.log('=====================================');
  
  // Additional checks
  if (env.DATABASE_URL === 'NOT SET') {
    console.log('⚠️  WARNING: DATABASE_URL is not set!');
    console.log('   This will cause database connection failures.');
  } else if (env.DATABASE_URL.includes('railway.internal')) {
    console.log('ℹ️  INFO: Using Railway internal database URL');
    console.log('   This is correct for Railway deployment.');
  } else if (env.DATABASE_URL.includes('localhost')) {
    console.log('ℹ️  INFO: Using local database URL');
    console.log('   This is correct for local development.');
  } else {
    console.log('ℹ️  INFO: Using external database URL');
    console.log('   This is correct for local development with Railway PostgreSQL.');
  }
  
  if (env.RAILWAY_ENVIRONMENT !== 'local') {
    console.log('🚀 Running in Railway environment');
  } else {
    console.log('💻 Running in local environment');
  }
}

// Run if called directly
if (require.main === module) {
  printEnvironmentInfo();
}

module.exports = {
  maskPassword,
  getEnvironmentInfo,
  printEnvironmentInfo
};
