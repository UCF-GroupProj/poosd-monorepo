# Prep Node Image
FROM node:22-bookworm-slim AS base
RUN npm install -g pnpm
RUN npm install -g turbo
RUN apt update && apt upgrade -y

# Setup the minimal files
FROM base as setup
COPY . .
RUN npx turbo prune frontend --docker

 
# Build the project
FROM base AS builder
COPY --from=setup out/pnpm-lock.yaml .
COPY --from=setup out/json/ .
RUN pnpm install --prod --frozen-lockfile
COPY --from=setup out/full/ .
RUN yarn turbo run build

# Release Images
FROM base AS publish
COPY --from=builder apps/frontend/.next/standalone ./
COPY --from=builder apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder apps/frontend/public ./apps/frontend/public

CMD node apps/frontend/server.js