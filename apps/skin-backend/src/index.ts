import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getHeadRoute } from '#routes/get-head.ts';
import { getSkinRoute } from '#routes/get-skins.ts';
import { downloadSkinRoute } from '#routes/download-skin.ts';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';

const port = process.env.SKIN_BACKEND_PORT!

const app = new Hono()
.use("*", cors({ origin: "*", allowMethods: ['GET']}))
.use("*", logger())
.basePath('/api')
.route("/", getHeadRoute)
.route("/", getSkinRoute)
.route("/", downloadSkinRoute)

export type SkinAppType = typeof app

showRoutes(app, { verbose: false })

export default { port, fetch: app.fetch }