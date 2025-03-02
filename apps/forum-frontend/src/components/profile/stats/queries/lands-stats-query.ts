import { useQuery } from "@tanstack/react-query";
import { getUserLands } from "./get-user-lands.ts";
import { StatsRequest } from "#components/profile/stats/types/stats-types.ts";

export const LANDS_STATS_QUERY_KEY = (uuid?: string) => [
  "user",
  "lands-stats",
  uuid,
];

export const landsStatsQuery = (uuid: Pick<StatsRequest, "uuid">["uuid"]) => useQuery({
  queryKey: LANDS_STATS_QUERY_KEY(uuid),
  queryFn: () => getUserLands(uuid),
  enabled: !!uuid,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});