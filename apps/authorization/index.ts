import { Hono } from 'hono';
import { prettyJSON } from "hono/pretty-json"
import luckperms from './lib/routes/get-luckperms-player.ts'
import getAuthUser from "./lib/routes/get-auth-player.ts"
import createUser from "./lib/routes/create-user.ts"
import { authorizeToken } from '#utils/authorize-token.ts';

const app = new Hono()

app.use("*", prettyJSON())
app.use('*', (c, next) => {
  const authHeader = c.req.header("Authorization");
  authorizeToken(authHeader)
  return next();
});

app.route('/lp', luckperms)
app.route('/auth/get', getAuthUser)
app.route('/auth', createUser)

export default {
  port: process.env.SERVICE_PORT,
  fetch: app.fetch,
}