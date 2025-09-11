import { otel } from '@hono/otel';
import type { Env } from '#types/env-type.ts';
import { BOTS_IS_ENABLED, PORT as port } from './shared/env/index';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { showRoutes } from 'hono/dev';
import { contextStorage } from 'hono/context-storage'
import { timeout } from '#middlewares/timeout.ts';
import { rateLimiter } from '#middlewares/rate-limiter.ts';
import { csrfProtection } from '#middlewares/csrf-protection.ts';
import { corsProtection } from '#middlewares/cors-protection.ts';
import { timing } from 'hono/timing'
import { initNats } from '@repo/config-nats/nats-client';
import { initRedis } from '#shared/redis/init.ts';
import { initSupabase } from '#shared/supabase/supabase-client.ts';
import { startBots } from '#shared/bots/init.ts';
import { isProduction } from '#shared/env/index.ts';
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
import { startJobs } from '#shared/cronbake/jobs.ts';
import { initBaker } from '#shared/cronbake/init.ts';
import { parseBoolean } from '#utils/normalizers.ts';
import { SUBSCRIPTIONS } from './shared/subscribers';
import { sdk } from './shared/open-telemetry';

const app = new Hono<Env>()
  .basePath('/forum')
  .use(corsProtection())
  .use(csrfProtection())
  .use(rateLimiter())
  .use(timeout())
  .use(timing())
  .use(logger())
  .use(contextStorage())
  .use('*', otel())
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

  for (const [k, cb] of Object.entries(SUBSCRIPTIONS)) {
    cb()
    console.log(`\x1B[35m[NATS]\x1B[0m ${k} subscribed`)
  }
}

async function startCron() {
  initBaker()
  await startJobs()
}

async function start() {
  await initSupabase()
  await startNats()
  initRedis()

  if (parseBoolean(BOTS_IS_ENABLED)) {
    await startBots()
  }

  function startOT() {
    sdk.start()
    console.log("\x1B[35m[OpenTelemetry]\x1B[0m SDK started")
  }

  await startCron();
  startOT();
  
  if (isProduction) {
    showRoutes(app, { verbose: false });
  }
  
  Bun.serve({ port, fetch: app.fetch })

  console.log(`\x1B[35m[App]\x1B[0m ${port}`)
}

start()