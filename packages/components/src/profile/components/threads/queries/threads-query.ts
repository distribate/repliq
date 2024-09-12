import { useQuery } from "@tanstack/react-query";
import { getThreadsUser } from "./get-threads-user.ts";

export const TOPICS_QUERY_KEY = (nickname: string) => ["user", "thread", nickname]

export const threadsQuery = (nickname: string) => {
	return useQuery({
		queryKey: TOPICS_QUERY_KEY(nickname),
		queryFn: () => getThreadsUser(nickname),
		refetchOnWindowFocus: false,
	})
}