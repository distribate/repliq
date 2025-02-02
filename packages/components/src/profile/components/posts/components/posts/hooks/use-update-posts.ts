import { forumUserClient } from "@repo/shared/api/forum-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { POSTS_FILTERING_QUERY_KEY, PostsFilteringQuery } from "../queries/posts-filtering-query";
import { getPosts } from "../queries/get-posts";
import { POSTS_QUERY_KEY } from "../queries/posts-query";
import type { InferResponseType } from "hono/client";

export const UPDATE_POSTS_MUTATION_KEY = ["update-posts-mutation"];

const client = forumUserClient.user['get-user-posts'][':nickname'].$get

type GetPostsResponse = InferResponseType<typeof client, 200>

type UseUpdatePosts = {
  nickname: string,
  type: "update-filter" | "update-cursor"
}

export const useUpdatePosts = () => {
  const qc = useQueryClient();

  const updatePostsMutation = useMutation({
    mutationKey: UPDATE_POSTS_MUTATION_KEY,
    mutationFn: async ({ nickname }: UseUpdatePosts) => {
      const filtering = qc.getQueryData<PostsFilteringQuery>(POSTS_FILTERING_QUERY_KEY);

      if (!filtering) return;

      return getPosts({ nickname, ...filtering })
    },
    onSuccess: async (data, variables) => {
      if (!data) {
        const currentPosts = qc.getQueryData<GetPostsResponse>(POSTS_QUERY_KEY(variables.nickname));

        return { data: currentPosts?.data, meta: currentPosts?.meta };
      }

      if (variables.type === "update-filter") {
        qc.setQueryData(POSTS_QUERY_KEY(variables.nickname), data)

        return qc.setQueryData(POSTS_FILTERING_QUERY_KEY, (prev: PostsFilteringQuery) => ({ ...prev, cursor: data.meta.endCursor }))
      }

      qc.setQueryData(POSTS_QUERY_KEY(variables.nickname), (prev: GetPostsResponse) => {
        if (!prev) {
          return { data: data.data, meta: data.meta };
        }

        const newPosts = data.data.filter(
          post => !prev.data.some(exist => exist.id === post.id)
        );

        return { data: [...prev.data, ...newPosts], meta: data.meta };
      });
    }
  })

  return { updatePostsMutation }
}