import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  POST_COMMENT_FIELD_QUERY_KEY,
  PostCommentField,
} from "../queries/post-comment-field-query.ts";
import { postComment } from "../queries/create-comment.ts";
import { toast } from "sonner";
import { POST_COMMENTS_QUERY_KEY } from "#post/components/post-comments/queries/post-comments-query.ts";

export const usePostCommentsFormControl = () => {
  const qc = useQueryClient();

  const createPostCommentMutation = useMutation({
    mutationFn: async (post_id: string) => {
      const formField = qc.getQueryData<PostCommentField>(
        POST_COMMENT_FIELD_QUERY_KEY(post_id),
      );

      if (!formField || !formField.content) {
        return toast.error("Что-то пошло не так!");
      }

      // return postComment({ post_id, content: formField.content, });
    },
    // onSuccess: async(data, variables) => {
    //   if (!data || !variables) {
    //     return toast.error('Произошла ошибка при создании комментария');
    //   }
    //
    //   return qc.invalidateQueries({ queryKey: POST_COMMENTS_QUERY_KEY(variables) })
    // },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { createPostCommentMutation };
};
