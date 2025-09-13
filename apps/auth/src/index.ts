import { Hono } from 'hono';
import { registerRoute } from './routes/register.ts';
import { invalidateSessionRoute } from './routes/invalidate-session.ts';
import { showRoutes } from 'hono/dev';
import { logger as honoLogger } from 'hono/logger';
import { csrf } from 'hono/csrf';
import { originList } from '@repo/shared/constants/origin-list.ts';
import { loginRoute } from './routes/login.ts';
import { terminateSessionRoute } from './routes/terminate-session.ts';
import { getSessionsRoute } from './routes/get-sessions.ts';
import { validateSessionRoute } from './routes/validate-session.ts';
import { timeout } from './middlewares/timeout-middleware.ts';
import { cors } from './middlewares/cors-middleware.ts';
import { rateLimiter } from './middlewares/rate-limiter.ts';
import { timing } from 'hono/timing'
import { INTERNAl_FILES, loadInternalFiles } from './shared/constants/internal-files.ts';
import { isProduction, PORT as port } from '#shared/env/index.ts';
import type { Env } from './types/env-type.ts';
import { startRedis } from './shared/redis/index.ts';
import { startSupabase } from '#shared/supabase/index.ts';
import { startNats } from '#shared/nats/index.ts';

export const auth = new Hono()
  .route("/", validateSessionRoute)
  .route('/', invalidateSessionRoute)
  .route('/', registerRoute)
  .route("/", loginRoute)
  .route("/", terminateSessionRoute)
  .route("/", getSessionsRoute)

const root = new Hono()
  .get("/health", async (ctx) => ctx.body(null, 200))

const app = new Hono<Env>()
  .basePath('/auth')
  .use(cors())
  .use(csrf({ origin: originList }))
  .use(rateLimiter())
  .use(timing())
  .use(timeout())
  .use(honoLogger())
  .route("/", root)
  .route("/", auth)
  .notFound((ctx) => ctx.json({ error: "Not Found" }, 404))
  .onError((error, ctx) => ctx.json({ error: error.message ?? "Internal Server Error" }, 500))

async function startServices() {
  await startNats()
  await startSupabase()
  await startRedis()
  await loadInternalFiles(INTERNAl_FILES);
}

async function start() {
  if (isProduction) {
    showRoutes(app, { verbose: false });
  }

  await startServices()

  Bun.serve({ port, fetch: app.fetch });

  console.log(`\x1B[35m[App]\x1B[0m ${port}`)
}

start()