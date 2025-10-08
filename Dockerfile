# Use Node.js 20 as base image
FROM node:20-alpine

# Force rebuild - Railway migration fix

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy Prisma schema first (needed for postinstall)
COPY prisma ./prisma/

# Install dependencies using npm (more reliable in Docker)
RUN npm install

# Copy rest of source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npm run migrate:deploy && npm start"]