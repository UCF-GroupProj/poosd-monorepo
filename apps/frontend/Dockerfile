# Prep Node Image
FROM node:22-bookworm-slim AS base
RUN npm install -g pnpm
RUN npm install -g turbo
RUN apt update && apt upgrade -y

# Setup the minimal files
FROM base AS setup
WORKDIR /app
COPY . .
RUN npx turbo prune frontend --docker

 
# Build the project
FROM base AS builder
WORKDIR /app
COPY --from=setup /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=setup /app/out/full/ .
RUN pnpm turbo run build

# Release Images
FROM base AS publish
WORKDIR /app
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

CMD node apps/frontend/server.js