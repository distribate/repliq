import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getHeadRoute } from '#routes/skins/get-head.ts';
import { getSkinRoute } from '#routes/skins/get-skins.ts';
import { downloadSkinRoute } from '#routes/skins/download-skin.ts';
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
import { subscribeUserBalance } from '#subscribers/sub-user-balance.ts';
import { subscribeUserLands } from '#subscribers/sub-user-lands.ts';
import { subscribePlayerGroup } from '#subscribers/sub-player-group.ts';
import { subscribePlayerJoin, subscribeRefferalCheck } from '#subscribers/sub-player-join.ts';
import { getAchievementsMetaRoute, getAchievementsRoute } from '#routes/achievements/get-achievements.ts';
import { originList } from "@repo/shared/constants/origin-list";
import { subscribeServerStatus } from '#subscribers/sub-server-status.ts';

async function startNats() {
  await initNats()

  subscribeUserBalance()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to balance")
  subscribeUserLands()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to lands")
  subscribePlayerGroup()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to player group")
  subscribeRefferalCheck()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to refferal check")
  subscribePlayerJoin()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to player join")
  subscribeServerStatus()
  console.log("\x1b[34m[NATS]\x1b[0m Subscribed to server status")
}

await startNats()

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
  .route("/", getAchievementsRoute)
  .route("/", getAchievementsMetaRoute)

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
  .basePath('/')
  .use(cors({
    origin: originList,
    allowMethods: ['GET', "POST", "OPTIONS"],
    credentials: true
  }))
  .use(timeout(2000))
  .use(rateLimiterMiddleware)
  .use(logger())
  .route("/", minecraft)
  .route("/", hooks)

// showRoutes(app, { verbose: false });

Bun.serve({ port, fetch: app.fetch });

console.log(port)