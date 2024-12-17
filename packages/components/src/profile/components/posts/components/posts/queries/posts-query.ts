import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getPosts,
  GetPosts,
} from './get-posts.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';

export const POSTS_QUERY_KEY = (nickname: string) =>
  createQueryKey('user', [ 'posts' ], nickname);

export type PostsQueryResponse = GetUserPostsResponse

export const postsQuery = ({
  ...values
}: GetPosts) => useQuery({
  queryKey: POSTS_QUERY_KEY(values.requestedUserNickname),
  queryFn: async() => getPosts(values),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData,
});