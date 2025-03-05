import { useQuery } from "@tanstack/react-query";
import { getUserLands } from "./get-user-lands.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const LANDS_STATS_QUERY_KEY = (nickname: string) => createQueryKey("user", ["lands", nickname])

export const landsStatsQuery = (nickname: string) => useQuery({
  queryKey: LANDS_STATS_QUERY_KEY(nickname),
  queryFn: () => getUserLands(nickname),
  refetchOnWindowFocus: false,
});