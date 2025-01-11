import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { getAuthUser } from './routes/get-auth-player.ts';
import { createUserRoute } from './routes/create-user.ts';
import { createSessionRoute } from './routes/create-session.ts';
import { invalidateSessionRoute } from './routes/invalidate-session.ts';
import { validateSessionRoute } from './routes/validate-session.ts';
import { showRoutes } from 'hono/dev';
import { getLuckpermsPlayer } from './routes/get-luckperms-player.ts';
import { exceptionHandler } from './helpers/exception-handler.ts';
import { mergeRoutes, type Module } from './utils/merge-routes.ts';
import { logger } from 'hono/logger';
import { initNats } from '@repo/config-nats/nats-client.ts';
import { timeout } from 'hono/timeout';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';

const port = process.env.AUTH_BACKEND_PORT;
const base = new Hono();

await initNats()

const installedModules = [
  { path: '/', routes: invalidateSessionRoute },
  { path: '/', routes: validateSessionRoute },
  { path: '/', routes: getAuthUser },
  { path: '/', routes: createUserRoute },
  { path: '/', routes: createSessionRoute },
  { path: '/lp', routes: getLuckpermsPlayer },
] as const satisfies Module[];

const app = mergeRoutes(
  base
    .use(async (c, next) => {
      console.log(c.req.path)
      await next();
    })
    .use(cors())
    .use(csrf())
    .basePath('/api/auth')
    .use(timeout(5000))
    .use(logger())
    .use(prettyJSON())
    .onError(exceptionHandler),
  ...installedModules,
);

export const lp = new Hono()
  .route('/', getLuckpermsPlayer);

export const auth = new Hono()
  .route('/', invalidateSessionRoute)
  .route('/', validateSessionRoute)
  .route('/', getAuthUser)
  .route('/', createUserRoute)
  .route('/', createSessionRoute);

export type AuthAppType = typeof auth
export type LpAppType = typeof lp

showRoutes(app, { verbose: false });

async function createServer() {
  showRoutes(app, { verbose: false });

  Bun.serve({ port, fetch: app.fetch });
}

createServer().then((_) => console.log(`Server started on port ${port}'`)).catch(err => {
  console.error('Error starting server:', err);
});