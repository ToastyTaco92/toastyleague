# Use Node.js 20 as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy Prisma schema first (needed for postinstall)
COPY prisma ./prisma/

# Install dependencies (this will run prisma generate in postinstall)
RUN pnpm install --frozen-lockfile

# Copy rest of source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]