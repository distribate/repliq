import { StatsRequest } from "../../../types/stats-types.ts";
import { useQuery } from "@tanstack/react-query";

export const LANDS_STATS_QUERY_KEY = (nickname?: string) => {
	return [ "user", "lands-stats", nickname ]
}

export const landsStatsQuery = ({
	uuid, nickname
}: StatsRequest) => {
	return useQuery({
		queryKey: LANDS_STATS_QUERY_KEY(nickname),
		refetchOnWindowFocus: false
	})
}