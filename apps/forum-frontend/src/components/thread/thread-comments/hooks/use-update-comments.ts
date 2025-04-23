import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getThreadComments, GetThreadComments } from "../queries/get-thread-comments";
import { GetThreadCommentsResponse } from "@repo/types/entities/thread-comments-types";
import { THREAD_COMMENTS_QUERY_KEY } from "../queries/thread-comments-query";

export const UPDATE_COMMENTS_MUTATION_KEY = ["update-comments-mutation"];

export const useUpdateComments = () => {
  const qc = useQueryClient();

  const updateCommentsMutation = useMutation({
    mutationKey: UPDATE_COMMENTS_MUTATION_KEY,
    mutationFn: async (values: GetThreadComments) => getThreadComments(values),
    onSuccess: async (data, variables) => {
      if (data) {
        qc.setQueryData(THREAD_COMMENTS_QUERY_KEY(variables.threadId), (oldData: GetThreadCommentsResponse) => {
          if (!oldData) return { data: data, meta: data.meta };

          const newComments = data.data.filter(comment => !oldData.data.some(existing => existing.id === comment.id));

          return {
            data: [...oldData.data, ...newComments],
            meta: data.meta,
          };
        });
      } else {
        const currentComments = qc.getQueryData<GetThreadCommentsResponse>(
          THREAD_COMMENTS_QUERY_KEY(variables.threadId)
        );

        return { data: currentComments?.data, meta: currentComments?.meta };
      }
    }
  })

  return { updateCommentsMutation }
}