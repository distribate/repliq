import { useQuery } from "@tanstack/react-query";
import { GetThreadsUser, getThreadsUser } from './get-threads-user.ts';

export const TOPICS_QUERY_KEY = (nickname: string) =>
	["user", "thread", nickname]

type ThreadsQuery = GetThreadsUser;

export const threadsQuery = ({
	nickname, order, ascending
}: ThreadsQuery) => {
	return useQuery({
		queryKey: TOPICS_QUERY_KEY(nickname),
		queryFn: () => getThreadsUser({ nickname, ascending, order }),
		enabled: !!nickname,
		refetchOnWindowFocus: false,
	})
}