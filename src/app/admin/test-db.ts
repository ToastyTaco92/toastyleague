"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function testDatabase() {
  try {
    // Test basic database connection
    const userCount = await prisma.user.count();
    
    // Test if we can create a simple record
    const testResult = await prisma.$queryRaw`SELECT 1 as test`;
    
    return { 
      success: true, 
      message: "Database connection successful",
      userCount,
      testResult
    };
  } catch (error) {
    console.error("Database test error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    };
  }
}
