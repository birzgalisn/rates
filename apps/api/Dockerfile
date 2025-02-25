# syntax=docker/dockerfile:1

FROM node:22.14.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS pruner
WORKDIR /app

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm dlx turbo prune api --docker

FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/pnpm-*.yaml ./
COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

COPY --from=pruner /app/out/full/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm turbo build --filter=api...

FROM base AS installer
WORKDIR /app

COPY --from=pruner /app/out/pnpm-*.yaml ./
COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

USER nestjs

COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules

COPY --from=installer --chown=nestjs:nodejs /app/packages/api/node_modules ./packages/api/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages/api/dist/ ./packages/api

COPY --from=installer --chown=nestjs:nodejs /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/dist/ ./packages/database

COPY --from=installer --chown=nestjs:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist/ ./apps/api

EXPOSE 4000/tcp

CMD [ "node", "apps/api/main.js" ]
