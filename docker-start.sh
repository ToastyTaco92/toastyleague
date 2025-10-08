#!/bin/sh
set -eu

echo "▶ Prisma: migrate deploy (fallback to db push if no migrations)"
npx prisma migrate deploy || npx prisma db push

echo "▶ Prisma: generate client"
npx prisma generate

echo "▶ Starting Next.js on port ${PORT:-3000}"
npm start