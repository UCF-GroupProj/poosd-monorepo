# Prep Node Image
FROM node:22-bookworm-slim AS base
RUN npm install -g pnpm
RUN npm install -g turbo
RUN apt update && apt upgrade -y

# Setup the minimal files
FROM base AS setup
WORKDIR /app
COPY . .
RUN npx turbo prune backend --docker

# Build the project
FROM base AS builder
ARG SENTRY_AUTH_TOKEN

WORKDIR /app
COPY --from=setup /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=setup /app/out/full/ .

RUN apps/backend/scripts/preHook.sh
RUN pnpm turbo run build
RUN pnpm prune --prod
RUN apps/backend/scripts/postHook.sh

# Run
CMD node apps/backend/dist/index.js