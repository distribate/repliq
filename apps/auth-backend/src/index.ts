import { Hono } from 'hono';
import { getAuthUser } from './routes/get-auth-player.ts';
import { registerRoute } from './routes/register.ts';
import { invalidateSessionRoute } from './routes/invalidate-session.ts';
import { showRoutes } from 'hono/dev';
import { exceptionHandler } from './helpers/exception-handler.ts';
import { logger } from 'hono/logger';
import { initNats } from '@repo/config-nats/nats-client.ts';
import { csrf } from 'hono/csrf';
import { originList } from '@repo/shared/constants/origin-list.ts';
import { loginRoute } from './routes/login.ts';
import { terminateSessionRoute } from './routes/terminate-session.ts';
import { getSessionsRoute } from './routes/get-sessions.ts';
import { getSessionRoute } from './routes/get-session.ts';
import { timeoutMiddleware } from './middlewares/timeout-middleware.ts';
import { corsMiddleware } from './middlewares/cors-middleware.ts';
import type { Env } from './types/env-type.ts';
import { rateLimiterMiddleware } from './middlewares/rate-limiter.ts';

await initNats()

export const auth = new Hono()
  .route('/', invalidateSessionRoute)
  .route('/', getAuthUser)
  .route('/', registerRoute)
  .route("/", loginRoute)
  .route("/", terminateSessionRoute)
  .route("/", getSessionsRoute)
  .route("/", getSessionRoute)

const app = new Hono<Env>()
  .basePath('/api/auth')
  .use(corsMiddleware)
  .use(csrf({ origin: originList }))
  .use(rateLimiterMiddleware)
  .use(timeoutMiddleware)
  .use(logger())
  .onError(exceptionHandler)
  .route("/", auth)

showRoutes(app, { verbose: false });

Bun.serve({ port: Bun.env.AUTH_BACKEND_PORT!, fetch: app.fetch });

console.log(Bun.env.AUTH_BACKEND_PORT!)