import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getPosts,
} from './get-posts.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';
import { postsFilteringQuery } from '#profile/components/posts/components/posts/queries/posts-filtering-query.ts';

export const POSTS_QUERY_KEY = (nickname: string) =>
  createQueryKey('user', [ 'posts' ], nickname);

export type PostsQueryResponse = GetUserPostsResponse

export const postsQuery = (requestedUserNickname: string) => {
  const { data: { range, filteringType, searchQuery, ascending } } = postsFilteringQuery();
  
  return useQuery({
    queryKey: POSTS_QUERY_KEY(requestedUserNickname),
    queryFn: async() => getPosts({
      requestedUserNickname, searchQuery: searchQuery ?? undefined, filteringType, range, ascending
    }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
}