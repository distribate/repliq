import { StatsRequest } from "../../../types/stats-types.ts";
import { useQuery } from "@tanstack/react-query";
import { getLandsStats } from "./get-lands-stats.ts";

export const LANDS_STATS_QUERY_KEY = (nickname?: string) => {
	return [ "user", "lands-stats", nickname ]
}

export const landsStatsQuery = ({
	uuid, nickname
}: StatsRequest) => {
	return useQuery({
		queryKey: LANDS_STATS_QUERY_KEY(nickname),
		queryFn: () => getLandsStats({
			nickname: nickname, uuid: uuid
		}),
		refetchOnWindowFocus: false
	})
}