import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getPosts,
  GetPosts,
  OverridedPosts,
  PostsByUser,
} from "./get-posts.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const POSTS_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["posts"], nickname);

export type PostsQuery = GetPosts;

export type PostsQueryPromise = {
  data: OverridedPosts[] | undefined;
  meta: Pick<PostsByUser, "meta">["meta"];
};

export const postsQuery = ({
  limit,
  nickname,
  range,
  ascending,
  searchQuery,
  filteringType,
}: PostsQuery) =>
  useQuery<PostsQueryPromise, Error>({
    queryKey: POSTS_QUERY_KEY(nickname),
    queryFn: async () => {
      const postsData = await getPosts({
        nickname,
        limit,
        ascending,
        range,
        searchQuery,
        filteringType,
      });

      const meta: Pick<PostsByUser, "meta">["meta"] = {
        count: postsData?.meta.count ?? 0,
      };

      return { data: postsData?.data, meta };
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
