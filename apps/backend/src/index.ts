import { Hono } from 'hono';
import type { Env } from '#types/env-type.ts';
import type { Subscription } from '@nats-io/transport-node';
import { logger } from 'hono/logger';
import { showRoutes } from 'hono/dev';
import { contextStorage } from 'hono/context-storage'
import { timeout } from '#middlewares/timeout.ts';
import { rateLimiter } from '#middlewares/rate-limiter.ts';
import { csrfProtection } from '#middlewares/csrf-protection.ts';
import { corsProtection } from '#middlewares/cors-protection.ts';
import { subscribeUserStatus } from '#subscribers/sub-user-status.ts';
import { subscribeCollectStats } from '#subscribers/sub-collect-stats.ts';
import { subscribeReceiveNotify } from '#subscribers/sub-receive-notify.ts';
import { subscribeAdminLog } from '#subscribers/sub-admin-log.ts';
import { subscribeDisconnectService } from '#subscribers/sub-disconnect-service.ts';
import { timing } from 'hono/timing'
import { initNats } from '@repo/config-nats/nats-client';
import { initRedis } from '#shared/redis/init.ts';
import { initSupabase } from '#shared/supabase/supabase-client.ts';
import { startBots } from '#shared/bots/init.ts';
import { isProduction } from '#helpers/is-production.ts';
import { user } from './routes/user';
import { thread } from './routes/thread';
import { post } from './routes/post';
import { comment } from './routes/comments';
import { report } from './routes/report';
import { admin } from './routes/admin';
import { shared } from './routes/public';
import { category } from './routes/categories';
import { search } from './routes/search';
import { root } from './routes/root';
import { friend } from './routes/friend';

const PORT = Bun.env.PORT
const BOTS_IS_ENABLED = parseBoolean(Bun.env.BOTS_IS_ENABLED)

function parseBoolean(v: string | boolean): boolean {
  return typeof v === "boolean" ? v : v.toLowerCase() === "true";
}

const SUBSCRIPTIONS = new Map<string, () => Subscription>([
  ["users-status", subscribeUserStatus],
  ["collect-stats", subscribeCollectStats],
  ["receive-notify", subscribeReceiveNotify],
  ["admin-log", subscribeAdminLog],
  ["disconnect-service", subscribeDisconnectService]
])

const app = new Hono<Env>()
  .basePath('/forum')
  .use(corsProtection())
  .use(csrfProtection())
  .use(rateLimiter())
  .use(timeout())
  .use(timing())
  .use(logger())
  .use(contextStorage())
  .route('/', admin)
  .route("/", root)
  .route("/", category)
  .route("/", comment)
  .route("/", search)
  .route("/", shared)
  .route("/", thread)
  .route("/", post)
  .route("/", report)
  .route('/', user)
  .route("/", friend)
  .onError((err, ctx) => ctx.json({ error: err.message }, 500))
  .notFound((ctx) => ctx.json({ error: "Not Found" }, 404))

async function startNats() {
  await initNats()

  for (const [k, cb] of SUBSCRIPTIONS) {
    cb()
    console.log(`\x1B[35m[NATS]\x1B[0m ${k} subscribed`)
  }
}

async function start() {
  await initSupabase()
  await startNats()

  if (BOTS_IS_ENABLED) {
    await startBots()
  }

  initRedis()

  isProduction && showRoutes(app, { verbose: false });

  Bun.serve({ port: PORT, fetch: app.fetch })

  console.log(`\x1B[35m[App]\x1B[0m ${PORT}`)
}

start()