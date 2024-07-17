import { useQuery } from "@tanstack/react-query";
import { getPostsByNickname, Posts } from './get-posts-by-user.ts';

export const POSTS_QUERY_KEY = (nickname?: string) => {
	return [ "user", "posts", nickname ]
}

export type PostsQuery = Posts[]

export const postsQuery = (nickname?: string, limit?: number) => {
	return useQuery<PostsQuery | null, Error>({
		queryKey: POSTS_QUERY_KEY(nickname),
		queryFn: () => getPostsByNickname(nickname, limit),
		enabled: !!nickname
	})
}