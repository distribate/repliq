import { useQuery } from "@tanstack/react-query";
import { getPostsByNickname } from './get-posts-by-user.ts';

export const POSTS_QUERY_KEY = (nickname?: string) =>
	[ "user", "posts", nickname ]

export type PostsQuery = {

}

export const postsQuery = (nickname?: string, limit?: number) => {
	return useQuery({
		queryKey: POSTS_QUERY_KEY(nickname),
		queryFn: () => getPostsByNickname({
			nickname, limit
		}),
		refetchOnWindowFocus: false,
		enabled: !!nickname
	})
}