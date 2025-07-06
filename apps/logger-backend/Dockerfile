FROM node:18-alpine AS builder

RUN corepack enable && corepack prepare yarn@4.3.0 --activate
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

COPY . .

RUN yarn install --immutable

RUN yarn global add turbo

RUN yarn turbo prune apps/logger-backend --docker

FROM node:18-alpine AS installer

WORKDIR /app

COPY --from=builder /app/out/json/ ./

RUN yarn install --immutable

COPY --from=builder /app/out/full/ ./

RUN yarn turbo run build --filter=apps/logger-backend...

FROM oven/bun:1.2.17 AS runner

WORKDIR /app

COPY --from=installer /app/apps/logger-backend/dist ./dist
COPY --from=installer /app/apps/logger-backend/package.json ./
COPY --from=installer /app/packages ./packages
COPY --from=installer /app/yarn.lock ./yarn.lock
COPY --from=installer /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=installer /app/.yarn/ ./.yarn/

RUN bun install --production

CMD ["bun", "run", "dist/index.js"]
