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
import { parseBoolean } from '#utils/normalizers.ts';
import { startRedis } from '#shared/redis/index.ts';
import { startSupabase } from '#shared/supabase/index.ts';
import { startBots } from '#shared/bots/index.ts';
import { startBaker } from '#shared/cronbake/index.ts';
import { startOtel } from './shared/open-telemetry';
import { startNats } from '#shared/nats/index.ts';

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

async function startServices() {
  await startRedis()
  await startNats()
  await startSupabase()
  await startBaker()
  startOtel()

  if (parseBoolean(BOTS_IS_ENABLED)) {
    await startBots()
  }
}

async function start() {
  if (isProduction) {
    showRoutes(app, { verbose: false });
  }

  await startServices()

  Bun.serve({ port, fetch: app.fetch })

  console.log(`\x1B[35m[App]\x1B[0m ${port}`)
}

start()