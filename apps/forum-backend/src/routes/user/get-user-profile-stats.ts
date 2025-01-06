import { throwError } from "#helpers/throw-error.ts";
import { Hono } from "hono";
import type { ProfileStatsCharts, ProfileStatsDetailed, ProfileStatsMeta } from "@repo/types/routes-types/get-user-profile-stats-types.ts";
import { prepareHourlyChartData, prepareMonthlyChartData } from "#utils/prepare-charts-data.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getUserDonate } from "#lib/queries/user/get-user-donate.ts";
import { getUserProfileViews, getUserProflieViewsDetails } from "#lib/queries/user/get-user-profile-views.ts";
import { getUsersProfileViewsRank } from "#lib/queries/user/get-users-profile-views-rank.ts";

type GetUserProfileStats = {
  nickname: string,
  with_details: boolean
}

type GetUserProfileStatsReturn<T extends boolean> = T extends true
  ? ProfileStatsDetailed
  : {
    meta: ProfileStatsMeta
  };

async function getUserRanking(nickname: string) {
  const viewsCountResult = await getUsersProfileViewsRank()

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

/**
 * @param {{ nickname: string, with_details: T }} params
 * @returns {Promise<GetUserProfileStatsReturn<T>>}
 * @description
 * Gets profile stats for given nickname.
 * If `with_details` is `true`, returns detailed data about views.
 * If `with_details` is `false`, returns only meta data.
 */
async function getUserProfileStats<T extends boolean>({
  nickname, with_details
}: GetUserProfileStats): Promise<GetUserProfileStatsReturn<T>> {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [viewsByDay, viewsByMonth, viewsAll] = await Promise.all([
    getUserProfileViews({ nickname, fromDate: oneDayAgo }),
    getUserProfileViews({ nickname, fromDate: oneMonthAgo }),
    getUserProfileViews({ nickname }),
  ]);

  const { rank } = await getUserRanking(nickname)

  let meta: ProfileStatsMeta = {
    rank: rank ?? 0,
    views_by_day: Number(viewsByDay.count),
    views_by_month: Number(viewsByMonth.count),
    views_all: Number(viewsAll.count)
  };

  if (with_details) {
    const details = await getUserProflieViewsDetails(nickname)

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

export const getUserProfileStatsRoute = new Hono()
  .get("/get-user-profile-stats", async (ctx) => {
    const nickname = getNickname()

    const userDonate = await getUserDonate(nickname)
    const with_details = userDonate.donate !== 'default'

    try {
      const userProfileStats = await getUserProfileStats({
        nickname, with_details
      });

      return ctx.json(userProfileStats, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
)