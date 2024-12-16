import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { getAuthUser } from './lib/routes/get-auth-player.ts';
import { createUserRoute } from './lib/routes/create-user.ts';
import { createSessionRoute } from './lib/routes/create-session.ts';
import { invalidateSessionRoute } from './lib/routes/invalidate-session.ts';
import { validateSessionRoute } from './lib/routes/validate-session.ts';
import { hc } from 'hono/client';
import { showRoutes } from 'hono/dev';
import { PORT as port, SECRET_TOKEN } from '#utils/initialize-env.ts';
import { getLuckpermsPlayer } from '#lib/routes/get-luckperms-player.ts';
import { exceptionHandler } from '#helpers/exception-handler.ts';
import { mergeRoutes, type Module } from '#utils/merge-routes.ts';
import { authorizeToken } from '#helpers/authorize-token.ts';

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

export default { port, fetch: routes.fetch };