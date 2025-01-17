import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getHeadRoute } from '#routes/get-head.ts';
import { getSkinRoute } from '#routes/get-skins.ts';
import { downloadSkinRoute } from '#routes/download-skin.ts';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { timeout } from 'hono/timeout';
import { csrf } from 'hono/csrf';
import { rateLimiter as limiter } from "hono-rate-limiter";

const port = process.env.SKIN_BACKEND_PORT!

export const skin = new Hono()
  .basePath("/skin")
  .route("/", getHeadRoute)
  .route("/", getSkinRoute)
  .route("/", downloadSkinRoute)

export const achievements = new Hono()
  .basePath("/achievements")
// .route("/", getAchievementsRoute)

const app = new Hono()
  .use(cors({ origin: '*', allowMethods: ['GET'] }))
  .use(csrf())
  .use(timeout(2000))
  .use(
    limiter({
      windowMs: 60000,
      limit: 300,
      standardHeaders: "draft-6",
      keyGenerator: (ctx) => ctx.req.header("x-forwarded-for") ?? "",
    })
  )
  .use(logger())
  .basePath('/api/minecraft')
  .route("/", skin)
  .route("/", achievements)

async function createServer() {
  showRoutes(app, { verbose: false });

  Bun.serve({ port, fetch: app.fetch });
}

createServer().then((_) => console.log(port))