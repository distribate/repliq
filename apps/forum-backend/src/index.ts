import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { hc } from "hono/client";
import { getUserRoute } from "#routes/get-user.ts";
import { showRoutes } from "hono/dev";
import { authorizeToken } from "#helpers/authorize-token.ts";

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

const forum = new Hono().route("/", getUserRoute);

const app = new Hono()
  .use("*", prettyJSON())
  .use("*", (c, next) => {
    const authHeader = c.req.header("Authorization");
    authorizeToken({ authHeader, apiKey: process.env.SECRET_TOKEN });
    return next();
  })
  .route("/", forum);

export const forumClient = hc<typeof forum>(`http://localhost:3500/`, {
  headers,
});

showRoutes(app, { verbose: true });

export default { port: process.env.FORUM_BACKEND_PORT, fetch: app.fetch };
