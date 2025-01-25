import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMainUserState } from "./get-user-cmi-stats.ts";
import { StatsRequest } from "#profile/components/stats/types/stats-types.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const GENERAL_STATS_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["general-stats"], nickname);

export const generalStatsQuery = ({ nickname, uuid }: StatsRequest) => useQuery({
  queryKey: GENERAL_STATS_QUERY_KEY(nickname),
  queryFn: () => getMainUserState({ nickname, uuid }),
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
});