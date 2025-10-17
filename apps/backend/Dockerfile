# Prep Node Image
FROM node:22-bookworm-slim AS base
RUN npm install -g pnpm
RUN npm install -g turbo
RUN apt update && apt upgrade -y

# Setup the minimal files
FROM base as setup
COPY . .
RUN npx turbo prune backend --docker

# Build the project
FROM base AS builder
COPY --from=setup /app/out/json/ .
RUN pnpm install
COPY --from=setup /app/out/full/ .
RUN pnpm turbo run build

# Run
CMD apps/backend/dist/index.js