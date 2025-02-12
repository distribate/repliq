import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getHeadRoute } from '#routes/get-head.ts';
import { getSkinRoute } from '#routes/get-skins.ts';
import { downloadSkinRoute } from '#routes/download-skin.ts';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { timeout } from 'hono/timeout';
import { processPlayerVoteRoute } from '#routes/hooks/process-player-vote.ts';
import { initNats } from '@repo/config-nats/nats-client';
import { rateLimiterMiddleware } from '#middlewars/rate-limiter.ts';
import { port } from "./utils/init-env.ts"
import { getLandsRoute } from '#routes/lands/get-lands.ts';
import { getLandsByNicknameRoute } from '#routes/lands/get-lands-by-nickname.ts';
import { getLandRoute } from '#routes/lands/get-land.ts';
import { getRatingByRoute } from '#routes/rating/get-rating-by.ts';
import { subscribeUserBalance } from '#subscribers/subscribe-user-balance.ts';

await initNats()
subscribeUserBalance()

export const hooks = new Hono()
  .basePath('/hooks')
  .route("/", processPlayerVoteRoute)

export const rating = new Hono()
  .basePath("/rating")
  .route("/", getRatingByRoute)

export const skin = new Hono()
  .basePath("/skin")
  .route("/", getHeadRoute)
  .route("/", getSkinRoute)
  .route("/", downloadSkinRoute)

export const achievements = new Hono()
  .basePath("/achievements")
// .route("/", getAchievementsRoute)

export const lands = new Hono()
  .basePath("/lands")
  .route("/", getLandsRoute)
  .route("/", getLandsByNicknameRoute)
  .route("/", getLandRoute)

export const minecraft = new Hono()
  .basePath('/minecraft')
  .route("/", skin)
  .route("/", achievements)
  .route("/", lands)
  .route("/", rating)

const app = new Hono()
  .use(cors({
    origin: ["http://localhost:3000", "https://cc.fasberry.su", "https://fasberry.su", "http://localhost:3001"],
    allowMethods: ['GET', "POST", "OPTIONS"],
    allowHeaders: ["Cookie", "cookie", "x-csrf-token", "X-CSRF-Token", "content-type", "Content-Type"],
    credentials: true
  }))
  .use(timeout(2000))
  .use(rateLimiterMiddleware)
  .use(logger())
  .basePath('/api')
  .route("/", minecraft)
  .route("/", hooks)

showRoutes(app, { verbose: false });

Bun.serve({
  port,
  fetch: app.fetch
});

console.log(port)