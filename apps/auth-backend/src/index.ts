import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { getAuthUser } from './routes/get-auth-player.ts';
import { createUserRoute } from './routes/create-user.ts';
import { createSessionRoute } from './routes/create-session.ts';
import { invalidateSessionRoute } from './routes/invalidate-session.ts';
import { validateSessionRoute } from './routes/validate-session.ts';
import { hc } from 'hono/client';
import { showRoutes } from 'hono/dev';
import { PORT as port, SECRET_TOKEN } from '#utils/initialize-env.ts';
import { getLuckpermsPlayer } from '#routes/get-luckperms-player.ts';
import { exceptionHandler } from '#helpers/exception-handler.ts';
import { mergeRoutes, type Module } from '#utils/merge-routes.ts';
import { authorizeToken } from '#helpers/authorize-token.ts';
import { logger } from 'hono/logger';

export const headers = { Authorization: `Bearer ${SECRET_TOKEN}` };

const base = new Hono();

const installedModules = [
  { path: '/auth', routes: invalidateSessionRoute },
  { path: '/auth', routes: validateSessionRoute },
  { path: '/auth', routes: getAuthUser },
  { path: '/auth', routes: createUserRoute },
  { path: '/auth', routes: createSessionRoute },
  { path: '/lp', routes: getLuckpermsPlayer },
] as const satisfies Module[];

const routes = mergeRoutes(
  base
  .use('*', logger())
  .use('*', prettyJSON())
  .use('*', (c, next) => {
    const authHeader = c.req.header('Authorization');
    authorizeToken({ authHeader, apiKey: process.env.SECRET_TOKEN! });
    return next();
  })
  .onError(exceptionHandler),
  ...installedModules,
);

export const auth = new Hono()
.route('/', invalidateSessionRoute)
.route('/', validateSessionRoute)
.route('/', getAuthUser)
.route('/', createUserRoute)
.route('/', createSessionRoute);

export const lp = new Hono().route('/', getLuckpermsPlayer);

export const lpClient = hc<typeof lp>(`http://localhost:3400/lp`, { headers });

showRoutes(base);

export default { port, fetch: routes.fetch };