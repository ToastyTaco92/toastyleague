# --- build ---
FROM node:20 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

# --- run ---
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 3000
CMD ["pnpm","start"]
