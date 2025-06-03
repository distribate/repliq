import { Hono } from 'hono';
import { registerRoute } from './routes/register.ts';
import { invalidateSessionRoute } from './routes/invalidate-session.ts';
import { showRoutes } from 'hono/dev';
import { exceptionHandler } from './helpers/exception-handler.ts';
import { logger as honoLogger } from 'hono/logger';
import { initNats } from '@repo/config-nats/nats-client.ts';
import { csrf } from 'hono/csrf';
import { originList } from '@repo/shared/constants/origin-list.ts';
import { loginRoute } from './routes/login.ts';
import { terminateSessionRoute } from './routes/terminate-session.ts';
import { getSessionsRoute } from './routes/get-sessions.ts';
import { getSessionRoute } from './routes/validate-session.ts';
import { timeoutMiddleware } from './middlewares/timeout-middleware.ts';
import { corsMiddleware } from './middlewares/cors-middleware.ts';
import type { Env } from './types/env-type.ts';
import { rateLimiterMiddleware } from './middlewares/rate-limiter.ts';
import { logger } from "@repo/lib/utils/logger.ts"
import { timing } from 'hono/timing'

await initNats()

export const auth = new Hono()
  .route('/', invalidateSessionRoute)
  .route('/', registerRoute)
  .route("/", loginRoute)
  .route("/", terminateSessionRoute)
  .route("/", getSessionsRoute)
  .route("/", getSessionRoute)

const app = new Hono<Env>()
  .basePath('/auth')
  .use(corsMiddleware())
  .use(csrf({ origin: originList }))
  .use(rateLimiterMiddleware())
  .use(timing())
  .use(timeoutMiddleware())
  .use(honoLogger())
  .onError(exceptionHandler)
  .route("/", auth)

showRoutes(app, { verbose: false });

Bun.serve({ port: Bun.env.AUTH_BACKEND_PORT!, fetch: app.fetch });

logger.success(`Fasberry Auth Backend started on ${Bun.env.AUTH_BACKEND_PORT!}`)