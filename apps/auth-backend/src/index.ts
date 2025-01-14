import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { getAuthUser } from './routes/get-auth-player.ts';
import { registerRoute } from './routes/register.ts';
import { createSessionRoute } from './routes/create-session.ts';
import { invalidateSessionRoute } from './routes/invalidate-session.ts';
import { validateSessionRoute } from './routes/validate-session.ts';
import { showRoutes } from 'hono/dev';
import { exceptionHandler } from './helpers/exception-handler.ts';
import { logger } from 'hono/logger';
import { initNats } from '@repo/config-nats/nats-client.ts';
import { timeout } from 'hono/timeout';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { originList } from '@repo/shared/constants/origin-list.ts';
import { loginRoute } from './routes/login.ts';
import { terminateSessionRoute } from './routes/terminate-session.ts';
import { getSessionsRoute } from './routes/get-sessions.ts';

const port = process.env.AUTH_BACKEND_PORT;

await initNats()

export type Env = {
  Variables: {
    nickname: string
    currentSessionId: string
  }
}

const auth = new Hono()
  .route('/', invalidateSessionRoute)
  .route('/', validateSessionRoute)
  .route('/', getAuthUser)
  .route('/', registerRoute)
  .route('/', createSessionRoute)
  .route("/", loginRoute)
  .route("/", terminateSessionRoute)
  .route("/", getSessionsRoute)

const app = new Hono<Env>()
  .use(cors({ 
    origin: originList, 
    credentials: true, 
    allowHeaders: ["Cookie", "cookie", "content-type", "Content-Type"] 
  }))
  .use(csrf({ origin: originList }))
  .basePath('/api/auth')
  .use(timeout(5000))
  .use(logger())
  .use(prettyJSON())
  .onError(exceptionHandler)
  .route("/", auth)

export type AuthAppType = typeof auth

async function createServer() {
  showRoutes(app, { verbose: false });

  Bun.serve({ port, fetch: app.fetch });
}

createServer().then((_) => console.log(port))