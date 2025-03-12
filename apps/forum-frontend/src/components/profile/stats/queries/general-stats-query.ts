import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { playerClient } from "@repo/shared/api/minecraft-client";

export const GENERAL_STATS_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["general-stats"], nickname);

async function getUserStats(nickname: string) {
  const res = await playerClient.player["get-player-stats"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await res.json()

  if (!data || "error" in data) return null

  return data.data
}

export const generalStatsQuery = (nickname: string) => useQuery({
  queryKey: GENERAL_STATS_QUERY_KEY(nickname),
  queryFn: () => getUserStats(nickname),
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
});