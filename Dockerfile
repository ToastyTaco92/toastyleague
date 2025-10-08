FROM node:20-alpine

WORKDIR /app

# Only package manifests first for better layer caching
COPY package.json pnpm-lock.yaml* ./

RUN npm install

# Copy rest of project
COPY . .

# Generate Prisma client and build Next
RUN npx prisma generate
RUN npm run build

# Copy entrypoint and make it executable
COPY docker-start.sh /app/docker-start.sh
RUN chmod +x /app/docker-start.sh

# Railway will provide $PORT
EXPOSE 3000

# Always run Prisma before Next.js
CMD ["/app/docker-start.sh"]
