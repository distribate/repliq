import { useQuery } from "@tanstack/react-query";
import { StatsRequest } from "../../../types/stats-types.ts";

export const GENERAL_STATS_QUERY_KEY = (nickname: string) => {
	return [ "user", "general-stats", nickname ]
}

export const generalStatsQuery = ({
	nickname, uuid
}: StatsRequest) => {
	return useQuery({
		queryKey: GENERAL_STATS_QUERY_KEY(nickname),
		refetchOnWindowFocus: true,
		retry: 2
	})
}