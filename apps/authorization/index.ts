import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { authorizeToken } from '#utils/authorize-token.ts';
import { app as luckperms } from './lib/routes/get-luckperms-player.ts';
import { app as getAuthUser } from './lib/routes/get-auth-player.ts';
import { app as createUser } from './lib/routes/create-user.ts';
import { app as createSession } from './lib/routes/create-session.ts';
import { app as invalidateSession } from './lib/routes/invalidate-session.ts';
import { app as validateSession } from './lib/routes/validate-session.ts';
import { hc } from 'hono/client'
import { showRoutes } from 'hono/dev';

const port = process.env.SERVICE_PORT

const app = new Hono()
.use('*', prettyJSON())
.use('*', (c, next) => {
  const authHeader = c.req.header('Authorization');
  authorizeToken(authHeader);
  return next();
})

const authApp = new Hono()
const lpApp = new Hono()

const auth = authApp
.route('/auth', getAuthUser)
.route('/auth', createUser)
.route('/auth', createSession)
.route('/auth', invalidateSession)
.route('/auth', validateSession)

// todo:
// fix route grouping





const lp = lpApp
.route('/lp', luckperms)

app.route("/", auth)
app.route("/", lp)

type LPRouteType = typeof lp;
type AuthRouteType = typeof auth;

export const authClient = hc<AuthRouteType>(`"http://localhost:${port}"`)
export const lpClient = hc<LPRouteType>(`"http://localhost:${port}"`)

showRoutes(app, {
  verbose: false, colorize: true
})

export default { port, fetch: app.fetch };