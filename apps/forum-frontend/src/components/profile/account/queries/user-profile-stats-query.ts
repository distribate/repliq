import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { getUserProfileStats } from "./get-user-profile-stats";
import { useQuery } from "@tanstack/react-query";

export const USER_PROFILE_STATS_QUERY_KEY = createQueryKey('user', [
  'profile-stats',
]);

export const userProfileStatsQuery = (enabled: boolean = true) => useQuery({
  queryKey: USER_PROFILE_STATS_QUERY_KEY,
  queryFn: () => getUserProfileStats(),
  refetchOnWindowFocus: false,
  enabled
});