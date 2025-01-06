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
import { bearerAuth } from 'hono/bearer-auth';
import { initNats } from '@repo/config-nats/nats-client.ts';

const port = process.env.AUTH_BACKEND_PORT;
const token = process.env.SECRET_TOKEN!

const base = new Hono();

async function startNatsSubscribers() {
  await initNats()
}

startNatsSubscribers()

const installedModules = [
  { path: '/auth', routes: invalidateSessionRoute },
  { path: '/auth', routes: validateSessionRoute },
  { path: '/auth', routes: getAuthUser },
  { path: '/auth', routes: createUserRoute },
  { path: '/auth', routes: createSessionRoute },
  { path: '/lp', routes: getLuckpermsPlayer },
] as const satisfies Module[];

const app = mergeRoutes(
  base
    .basePath('/api')
    .use('*', logger())
    .use('*', prettyJSON())
    .use('*', bearerAuth({ token }))
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

export default { port, fetch: app.fetch };