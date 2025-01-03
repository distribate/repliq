import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { ProfileStatsCharts, ProfileStatsMeta } from "@repo/types/routes-types/get-user-profile-stats-types.ts";
import type { ProfileViewsDetails } from "@repo/types/routes-types/get-user-profile-stats-types.ts";
import { sql } from "kysely";
import { prepareHourlyChartData, prepareMonthlyChartData } from "#utils/prepare-charts-data.ts";

type GetUserProfileStats = {
  nickname: string,
  with_details: boolean
}

type GetUserProfileStatsReturn<T extends boolean> = T extends true
  ? {
    details: ProfileViewsDetails[];
    meta: ProfileStatsMeta;
    charts: ProfileStatsCharts
  }
  : {
    meta: ProfileStatsMeta
  };

const RATING_LIMIT = 200;

async function getUserRanking(nickname: string) {
  const viewsCountResult = await forumDB
    .selectFrom('profile_views')
    .select([
      'recipient',
      sql`COUNT(*)`.as('views_count'),
    ])
    .groupBy('recipient')
    .orderBy(sql`COUNT(*)`, 'desc')
    .limit(RATING_LIMIT)
    .execute();

  const viewsCountWithNumbers = viewsCountResult.map(row => ({
    ...row,
    views_count: Number(row.views_count),
  }));

  viewsCountWithNumbers.sort((a, b) => b.views_count - a.views_count);

  const targetUserData = viewsCountWithNumbers.find(row => row.recipient === nickname);

  if (!targetUserData) {
    return { rank: null, views_count: 0 };
  }

  const rank = viewsCountWithNumbers.indexOf(targetUserData) + 1;

  return {
    rank,
    views_count: targetUserData.views_count,
  };
}

async function getUserProfileStats<T extends boolean>({
  nickname, with_details
}: GetUserProfileStats): Promise<GetUserProfileStatsReturn<T>> {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [viewsByDay, viewsByMonth, viewsAll] = await Promise.all([
    forumDB
      .selectFrom('profile_views')
      .select(forumDB.fn.countAll().as('count'))
      .where('recipient', '=', nickname)
      .where('created_at', '>=', oneDayAgo)
      .executeTakeFirstOrThrow(),
    forumDB
      .selectFrom('profile_views')
      .select(forumDB.fn.countAll().as('count'))
      .where('recipient', '=', nickname)
      .where('created_at', '>=', oneMonthAgo)
      .executeTakeFirstOrThrow(),
    forumDB
      .selectFrom('profile_views')
      .select(forumDB.fn.countAll().as('count'))
      .where('recipient', '=', nickname)
      .executeTakeFirstOrThrow(),
  ]);

  const { rank } = await getUserRanking(nickname)

  let meta: ProfileStatsMeta = {
    rank: rank ?? 0,
    views_by_day: Number(viewsByDay.count),
    views_by_month: Number(viewsByMonth.count),
    views_all: Number(viewsAll.count)
  };

  if (with_details) {
    const details = await forumDB
      .selectFrom('profile_views')
      .select(["initiator", "recipient", "created_at"])
      .where('recipient', '=', nickname)
      .execute();

    const detailsWithStringDate = details.map(detail => ({
      ...detail,
      created_at: new Date(detail.created_at).toISOString(),
    }));

    const dailyChartData = prepareHourlyChartData({
      details: detailsWithStringDate, with_missing: true
    })

    const monthlyChartData = prepareMonthlyChartData({
      details: detailsWithStringDate, with_missing: true
    });

    const charts: ProfileStatsCharts = {
      views_by_day: dailyChartData,
      views_by_month: monthlyChartData
    }

    return {
      details: detailsWithStringDate,
      meta,
      charts
    } as GetUserProfileStatsReturn<T>;
  }

  return { meta } as GetUserProfileStatsReturn<T>;
}

const getUserProfileStatsSchema = z.object({
  initiator: z.string(),
  recipient: z.string(),
})

export const getUserProfileStatsRoute = new Hono()
  .post("/get-user-profile-stats", zValidator("json", getUserProfileStatsSchema), async (ctx) => {
    const body = await ctx.req.json();
    const result = getUserProfileStatsSchema.parse(body);

    const { initiator, recipient } = result;

    // check initiator donate
    const userDonate = await forumDB
      .selectFrom('users')
      .select('donate')
      .where('nickname', '=', initiator)
      .executeTakeFirstOrThrow();

    let with_details = false;

    if (userDonate.donate !== 'default') {
      with_details = true
    }

    try {
      const userProfileStats = await getUserProfileStats({
        nickname: recipient,
        with_details
      });

      return ctx.json(userProfileStats, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
)