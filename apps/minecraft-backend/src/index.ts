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
import { originList } from "@repo/shared/constants/origin-list";
import { subscribePlayerJoin } from '#subscribers/sub-player-join.ts';
import { subscribeReferalReward } from '#subscribers/sub-referal-reward.ts';
import { subscribeReceiveFiatPayment } from '#subscribers/sub-receive-fiat-payment.ts';
import { subscribeRefferalCheck } from '#subscribers/sub-referal-check.ts';
import { subscribeGiveBalance } from '#subscribers/sub-give-balance.ts';
import { subscribePlayerStats } from '#subscribers/sub-player-stats.ts';
import { Objm } from '@nats-io/obj';
import { jetstream } from "@nats-io/jetstream";
import { validateRequest } from '#middlewars/validate-request.ts';
import { getPlayerBalanceRoute } from '#routes/player/get-player-balance.ts';
import { contextStorage } from 'hono/context-storage'
import { getPlayerStatsRoute } from '#routes/player/get-player-stats.ts';
import { getPlayerSkillsRoute } from '#routes/player/get-player-skills.ts';
import { corsOptions } from "@repo/shared/constants/cors-options.ts"
import { createMiddleware } from 'hono/factory';
import { csrf } from 'hono/csrf';
import { natsLogger, logger } from '@repo/lib/utils/logger';
import { timing, type TimingVariables } from 'hono/timing'

export const USERS_SKINS_BUCKET = "users_skins"

async function initSkinsBucket() {
  const nc = getNatsConnection();
  const js = jetstream(nc, { timeout: 10_000 });

  // @ts-ignore
  const objm = new Objm(js);

  let bucket = null;

  const list = objm.list()
  const next = await list.next()
  const buckets = next.map(key => key.bucket)

  if (buckets.includes(USERS_SKINS_BUCKET)) {
    natsLogger.success("Opened 'users_skins' bucket");

    bucket = await objm.open(USERS_SKINS_BUCKET)
  } else {
    natsLogger.info("Created 'users_skins' bucket");

    bucket = await objm.create(USERS_SKINS_BUCKET, { ttl: 2592000000000000, storage: "file" });
  }

  if (!bucket) {
    throw new Error("Failed to open bucket");
  }

  const watch = await bucket.watch();

  (async () => {
    for await (const e of watch) {
      natsLogger.debug(`[Watch] ${e.name} / ${e.size} / ${e.revision}`);
    }
  })().then();
}

async function startNats() {
  await initNats()

  await initSkinsBucket()

  subscribePlayerGroup()
  natsLogger.success("Subscribed to player group")
  subscribeRefferalCheck()
  natsLogger.success("Subscribed to refferal check")
  subscribePlayerJoin()
  natsLogger.success("Subscribed to player join")
  subscribeReferalReward()
  natsLogger.success("Subscribed to referal reward")
  subscribeReceiveFiatPayment()
  natsLogger.success("Subscribed to receive fiat payment")
  subscribeGiveBalance()
  natsLogger.success("Subscribed to give balance")
  subscribePlayerStats()
  natsLogger.success("Subscribed to player stats")
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
  .use(validateRequest)
  .route("/", achievements)
  .route("/", lands)
  .route("/", rating)
  .route("/", player)

export const csrfProtectionMiddleware = createMiddleware(csrf({
  origin: (origin) => /^(https:\/\/(\w+\.)?fasberry\.su|http:\/\/localhost:3000|http:\/\/localhost:3008|http:\/\/localhost:3009)$/.test(origin),
}))

const app = new Hono<{ Variables: TimingVariables }>()
  .basePath('/')
  .use(cors(corsOptions))
  .use(csrfProtectionMiddleware)
  .use(timeout(10000))
  .use(timing())
  .use(rateLimiterMiddleware)
  .use(honoLogger())
  .use(contextStorage())
  .route("/", minecraft)
  .route("/", hooks)

// showRoutes(app, { verbose: true });

Bun.serve({ port: Bun.env.MINECRAFT_BACKEND_PORT!, fetch: app.fetch });

logger.success(`Fasberry Minecraft Backend started on ${Bun.env.MINECRAFT_BACKEND_PORT!}`)