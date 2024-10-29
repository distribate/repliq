import { StatsRequest } from "../../../types/stats-types.ts";
import { useQuery } from "@tanstack/react-query";
import { getUserLands } from './get-user-lands.ts';

export const LANDS_STATS_QUERY_KEY = (uuid?: string) => {
	return [ "user", "lands-stats", uuid ]
}

export const landsStatsQuery = (
	uuid: Pick<StatsRequest, "uuid">["uuid"]
) => {
	return useQuery({
		queryKey: LANDS_STATS_QUERY_KEY(uuid),
		queryFn: async () => getUserLands(uuid),
		refetchOnMount: false,
		retry: 1,
		enabled: !!uuid,
		refetchOnWindowFocus: false
	})
}