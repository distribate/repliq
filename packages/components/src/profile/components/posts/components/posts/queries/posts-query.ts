import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getPosts,
} from './get-posts.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';
import { PostsFilteringQuery, postsFilteringQuery } from '#profile/components/posts/components/posts/queries/posts-filtering-query.ts';

export const POSTS_QUERY_KEY = (nickname: string) =>
  createQueryKey('user', ['posts'], nickname);

export type PostsQueryResponse = GetUserPostsResponse

export const postsQuery = (nickname: string, filteringType: PostsFilteringQuery['filteringType'], ascending: boolean) => {
  return useQuery({
    queryKey: POSTS_QUERY_KEY(nickname),
    queryFn: () => getPosts({ nickname, filteringType, ascending }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
}