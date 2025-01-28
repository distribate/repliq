import { useMutation, useQueryClient } from "@tanstack/react-query";
import { POSTS_QUERY_KEY, PostsQueryResponse } from "#profile/components/posts/components/posts/queries/posts-query.ts";
import { POST_CONTROL_QUERY_KEY, PostControlQuery } from "#post/components/post-item/queries/post-control-query.ts";
import { toast } from "sonner";
import { getUser } from "@repo/lib/helpers/get-user";
import { pinPost } from "../queries/pin-post";
import { disablePostComments } from "../queries/disable-post-comments";
import { deletePost } from "../queries/delete-post";
import { editPost } from "../queries/edit-post";

type ControlPostActionType = "delete" | "edit" | "pin" | "comments";

type ControlPost = {
  id: string;
  nickname: string;
  type: ControlPostActionType;
};

export const useControlPost = () => {
  const qc = useQueryClient();
  const { nickname } = getUser();

  const controlPostMutation = useMutation({
    mutationFn: async (values: ControlPost) => {
      const { id, type, nickname } = values;

      const posts = qc.getQueryData<PostsQueryResponse>(POSTS_QUERY_KEY(nickname))?.data;

      if (!posts) return;

      let post = posts.find(p => p.id === id);

      if (!post) return;

      const { content: prev } = post;

      const content = qc.getQueryData<PostControlQuery>(POST_CONTROL_QUERY_KEY(id))?.content;

      switch (type) {
        case "pin":
          return pinPost({ id, value: !post.isPinned });
        case "comments":
          return disablePostComments({ id });
        case "delete":
          return deletePost({ id });
        case "edit":
          return editPost({ id, content: content ?? prev });
        default:
          break;
      }
    },
    onSuccess: async (data, variables) => {
      if (!data) return toast.error("Произошла ошибка");

      switch (variables.type) {
        case "comments":
          return qc.setQueryData(POSTS_QUERY_KEY(nickname), (prev: PostsQueryResponse) => {
            if (!prev.data) return prev;

            // @ts-ignore
            if ((data.status !== 'Success') || ("is_comments" in data.data)) {
              return;
            }

            const post = prev.data.find((post) => post.id === variables.id);

            const updatedPost = {
              ...post,
              // @ts-ignore
              isComments: data.data.isComments,
            };

            return {
              ...prev,
              data: prev.data.map((post) =>
                post.id === updatedPost.id ? updatedPost : post,
              ),
            };
          });
        case "delete":
          return qc.setQueryData(POSTS_QUERY_KEY(nickname),
            (prev: PostsQueryResponse) => {
              if (!prev.data) return null;

              if (data.status !== 'Success') {
                return;
              }

              const newData = prev.data.filter(
                (post) => post.id !== variables.id,
              );

              return {
                data: newData,
                meta: {
                  count: newData.length ?? 0,
                },
              };
            },
          );
        case "edit":
          return qc.setQueryData(POSTS_QUERY_KEY(nickname),
            (prev: PostsQueryResponse) => {
              if (!prev.data) return null;

              if (data.status !== 'Success') {
                return;
              }

              return {
                ...prev,
                data: prev.data.map((post) =>
                  post.id === variables.id
                    // @ts-ignore
                    ? { ...post, content: data.data.content }
                    : post,
                ),
              };
            });
        case "pin":
          return qc.setQueryData(POSTS_QUERY_KEY(nickname),
            (prev: PostsQueryResponse) => {
              if (!prev.data) return null;

              if (data.status !== 'Success') {
                return;
              }

              return {
                ...prev,
                data: prev.data.map((post) =>
                  post.id === variables.id
                    // @ts-ignore
                    ? { ...post, isPinned: data.data.isPinned }
                    : post,
                ),
              };
            },
          );
        default:
          break;
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { controlPostMutation };
}