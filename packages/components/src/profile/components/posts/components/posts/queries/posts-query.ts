import { useQuery } from "@tanstack/react-query";
import { getPostsByNickname, GetPostsByUser } from './get-posts-by-user.ts';

export const POSTS_QUERY_KEY = (nickname?: string) =>
	[ "user", "posts", nickname ]

export type PostsQuery = GetPostsByUser

export const postsQuery = ({
	limit, nickname, range, ascending
}: PostsQuery) => {
	return useQuery({
		queryKey: POSTS_QUERY_KEY(nickname),
		queryFn: () => getPostsByNickname({
			nickname, limit, ascending, range
		}),
		refetchOnWindowFocus: false,
		enabled: !!nickname
	})
}