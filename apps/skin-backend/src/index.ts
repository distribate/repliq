import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getHeadRoute } from '#routes/get-head.ts';
import { getSkinRoute } from '#routes/get-skins.ts';
import { downloadSkinRoute } from '#routes/download-skin.ts';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { timeout } from 'hono/timeout';
import { csrf } from 'hono/csrf';
import { originList } from "@repo/shared/constants/origin-list.ts";

const port = process.env.SKIN_BACKEND_PORT!

const skin = new Hono()
  .route("/", getHeadRoute)
  .route("/", getSkinRoute)
  .route("/", downloadSkinRoute)

const app = new Hono()
  .use(cors({ origin: originList, allowMethods: ['GET'], credentials: true }))
  .use(csrf())
  .use(timeout(2000))
  .use(logger())
  .basePath('/api/skin')
  .route("/", skin)

export type SkinAppType = typeof skin

showRoutes(app, { verbose: false })

async function createServer() {
  showRoutes(app, { verbose: false });

  Bun.serve({ port, fetch: app.fetch });
}

createServer()
  .then((_) => console.log(`Server started on port ${port}'`))
  .catch(err => {
    console.error('Error starting server:', err);
  });