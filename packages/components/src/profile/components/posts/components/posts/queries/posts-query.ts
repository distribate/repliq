import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPosts,
} from './get-posts.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';
import { POSTS_FILTERING_QUERY_KEY, PostsFilteringQuery } from './posts-filtering-query.ts';

export const POSTS_QUERY_KEY = (nickname: string) =>
  createQueryKey('user', ['posts'], nickname);

export type PostsQueryResponse = GetUserPostsResponse

export const postsQuery = (nickname: string) => {
  const qc = useQueryClient()

  return useQuery({
    queryKey: POSTS_QUERY_KEY(nickname),
    queryFn: async () => {
      const res = await getPosts({ nickname, filteringType: "created_at" })

      if (!res) {
        return null
      }

      qc.setQueryData(POSTS_FILTERING_QUERY_KEY,
        (prev: PostsFilteringQuery) => ({ ...prev, cursor: res.meta.endCursor })
      )

      return res;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}