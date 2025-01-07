import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetThreadComments, getThreadComments } from './get-thread-comments.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { GetThreadCommentsResponse } from '@repo/types/entities/thread-comments-types.ts';
import { ThreadDetailed } from '@repo/types/entities/thread-type.ts';

export const THREAD_COMMENTS_QUERY_KEY = (thread_id: string) =>
  createQueryKey('ui', ['thread-comments'], thread_id);

type ThreadCommentsQuery = Pick<ThreadDetailed, 'id' | "is_comments">

export type ThreadComment = Pick<GetThreadCommentsResponse, "data">["data"][0]

export const useUpdateComments = () => {
  const qc = useQueryClient();

  const updateCommentsMutation = useMutation({
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

export const threadCommentsQuery = ({
  id, is_comments
}: ThreadCommentsQuery) => useQuery({
  queryKey: THREAD_COMMENTS_QUERY_KEY(id),
  queryFn: async () => getThreadComments({ threadId: id }),
  enabled: is_comments,
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});