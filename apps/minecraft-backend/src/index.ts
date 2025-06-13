import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getHeadRoute } from '#routes/skins/get-head.ts';
import { getSkinRoute } from '#routes/skins/get-skins.ts';
import { downloadSkinRoute } from '#routes/skins/download-skin.ts';
import { showRoutes } from 'hono/dev';
import { logger as honoLogger } from 'hono/logger';
import { timeout } from 'hono/timeout';
import { processPlayerVoteRoute } from '#routes/hooks/process-player-vote.ts';
import { getNatsConnection, initNats } from '@repo/config-nats/nats-client';
import { rateLimiterMiddleware } from '#middlewars/rate-limiter.ts';
import { getLandsRoute } from '#routes/lands/get-lands.ts';
import { getPlayerLandsRoute } from '#routes/lands/get-lands-by-nickname.ts';
import { getLandRoute } from '#routes/lands/get-land.ts';
import { getRatingByRoute } from '#routes/rating/get-rating-by.ts';
import { subscribePlayerGroup } from '#subscribers/sub-player-group.ts';
import { getAchievementsMetaRoute, getAchievementsRoute } from '#routes/achievements/get-achievements.ts';
import { subscribePlayerJoin } from '#subscribers/sub-player-join.ts';
import { subscribeReferalReward } from '#subscribers/sub-referal-reward.ts';
import { subscribeReceiveFiatPayment } from '#subscribers/sub-receive-fiat-payment.ts';
import { subscribeRefferalCheck } from '#subscribers/sub-referal-check.ts';
import { subscribeGiveBalance } from '#subscribers/sub-give-balance.ts';
import { subscribePlayerStats } from '#subscribers/sub-player-stats.ts';
import { validateRequest } from '#middlewars/validate-request.ts';
import { getPlayerBalanceRoute } from '#routes/player/get-player-balance.ts';
import { contextStorage } from 'hono/context-storage'
import { getPlayerStatsRoute } from '#routes/player/get-player-stats.ts';
import { getPlayerSkillsRoute } from '#routes/player/get-player-skills.ts';
import { corsOptions } from "@repo/shared/constants/cors-options.ts"
import { natsLogger, logger } from '@repo/lib/utils/logger';
import { timing, type TimingVariables } from 'hono/timing'
import { csrfProtectionMiddleware } from '#middlewars/csrf-protection.ts';
import { initSkinsBucket } from '#utils/init-buckets.ts';

async function startNats() {
  await initNats()
  await initSkinsBucket()

  subscribePlayerGroup()
  subscribeRefferalCheck()
  subscribePlayerJoin()
  subscribeReferalReward()
  subscribeReceiveFiatPayment()
  subscribeGiveBalance()
  subscribePlayerStats()
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

export const player = new Hono()
  .basePath("/player")
  .route("/", getPlayerBalanceRoute)
  .route("/", getPlayerLandsRoute)
  .route("/", getPlayerStatsRoute)
  .route("/", getPlayerSkillsRoute)

export const achievements = new Hono()
  .basePath("/achievements")
  .route("/", getAchievementsRoute)
  .route("/", getAchievementsMetaRoute)

export const lands = new Hono()
  .basePath("/lands")
  .route("/", getLandsRoute)
  .route("/", getLandRoute)

export const minecraft = new Hono()
  .basePath('/minecraft')
  .route("/", skin)
  .use(validateRequest())
  .route("/", achievements)
  .route("/", lands)
  .route("/", rating)
  .route("/", player)

type Env = {
  Variables: TimingVariables & {}
}

const TIMEOUT_TIME_MS = 10000

const app = new Hono<Env>()
  .basePath('/')
  .use(cors(corsOptions))
  .use(csrfProtectionMiddleware())
  .use(timeout(TIMEOUT_TIME_MS))
  .use(timing())
  .use(rateLimiterMiddleware())
  .use(honoLogger())
  .use(contextStorage())
  .route("/", minecraft)
  .route("/", hooks)

// showRoutes(app, { verbose: false });

Bun.serve({ port: Bun.env.MINECRAFT_BACKEND_PORT!, fetch: app.fetch });

logger.success(`Fasberry Minecraft Backend started on ${Bun.env.MINECRAFT_BACKEND_PORT!}`)