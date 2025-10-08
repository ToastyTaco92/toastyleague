#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy || npx prisma db push

echo "Starting Next.js..."
npm run start