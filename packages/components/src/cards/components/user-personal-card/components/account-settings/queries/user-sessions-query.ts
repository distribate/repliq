import { QueryKey, useQuery } from "@tanstack/react-query";
import { getUserActiveSessions } from "@repo/lib/queries/get-user-sessions.ts";

export const USER_ACTIVE_SESSIONS_QUERY_KEY: QueryKey = ["user", "active-sessions"]

export const userActiveSessionsQuery = () => {
	return useQuery({
		queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY,
		queryFn: () => getUserActiveSessions(),
		refetchInterval: 10 * 3600
	})
}