import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RemoveThreadComment,
  removeThreadComment,
} from "../queries/remove-thread-comment.ts";
import { toast } from "sonner";
import { THREAD_COMMENTS_QUERY_KEY, ThreadComment } from '../../thread-comments/queries/thread-comments-query.ts';
import { editThreadCommentContent } from "../queries/edit-thread-comment-content.ts";

export const useControlThreadComment = () => {
  const qc = useQueryClient();

  const editCommentContentMutation = useMutation({
    mutationFn: async (values: { id: number; content: string; thread_id: string }) => {
      return
    },
    onSuccess: async (data, variables) => {
      // if (!data) return toast.error("Не удалось обновить комментарий");

      // const prevComments = qc.getQueryData<ThreadComment[]>(
      //   THREAD_COMMENTS_QUERY_KEY(variables.thread_id),
      // );

      // if (!prevComments) {
      //   return qc.invalidateQueries({
      //     queryKey: THREAD_COMMENTS_QUERY_KEY(variables.thread_id),
      //   });
      // }

      // const prevCommentIndex = prevComments.findIndex(
      //   (item) => item.id === Number(variables.id),
      // );

      // if (prevCommentIndex === -1) {
      //   return qc.invalidateQueries({
      //     queryKey: THREAD_COMMENTS_QUERY_KEY(variables.thread_id),
      //   });
      // }

      // const prevComment = prevComments[prevCommentIndex];

      // if (!prevComment) {
      //   return qc.invalidateQueries({
      //     queryKey: THREAD_COMMENTS_QUERY_KEY(variables.thread_id),
      //   });
      // }

      // const updatedComments = [...prevComments];

      // updatedComments[prevCommentIndex] = {
      //   ...updatedComments[prevCommentIndex],
      //   content: data.content,
      //   is_updated: data.is_updated,
      // };

      // return qc.setQueryData(
      //   THREAD_COMMENTS_QUERY_KEY(variables.thread_id),
      //   updatedComments,
      // );
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const deleteCommentItemMutation = useMutation({
    mutationFn: async (values: RemoveThreadComment) =>
      removeThreadComment(values),
    onSuccess: async (data, variables) => {
      if (!data)
        return toast.error("Произошла ошибка при удалении комментария");

      return qc.invalidateQueries({
        queryKey: THREAD_COMMENTS_QUERY_KEY(variables.thread_id),
      });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { editCommentContentMutation, deleteCommentItemMutation };
};
