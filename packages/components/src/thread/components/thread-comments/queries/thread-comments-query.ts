import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getThreadComments } from './get-thread-comments.ts';
import {
  ThreadCommentEntity,
} from '@repo/types/entities/entities-type.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { GetThreadCommentsResponse } from '@repo/types/entities/thread-comments-types.ts';

export const THREAD_COMMENTS_QUERY_KEY = (thread_id: string) =>
  createQueryKey('ui', ['thread-comments'], thread_id);

type ThreadCommentsQuery = Pick<ThreadCommentEntity, 'thread_id'> & { isComments: boolean }

export type ThreadComment = Pick<GetThreadCommentsResponse, "data">["data"][0]

type UpdateComments = {
  cursor: string | null;
  limit: number | null;
  thread_id: string;
}

export const useUpdateComments = () => {
  const qc = useQueryClient();

  const updateCommentsMutation = useMutation({
    mutationFn: async (values: UpdateComments) => getThreadComments(values),
    onSuccess: async (data, variables) => {
      if (data) {
        qc.setQueryData(THREAD_COMMENTS_QUERY_KEY(variables.thread_id), (oldData: GetThreadCommentsResponse) => {
          if (!oldData) return { data: data, meta: data.meta };

          const newComments = data.data.filter(comment => !oldData.data.some(existing => existing.id === comment.id));

          return {
            data: [...oldData.data, ...newComments],
            meta: data.meta,
          };
        });
      } else {
        const currentComments = qc.getQueryData<GetThreadCommentsResponse>(
          THREAD_COMMENTS_QUERY_KEY(variables.thread_id)
        );

        return { data: currentComments?.data, meta: currentComments?.meta };
      }
    }
  })

  return { updateCommentsMutation }
}

export const threadCommentsQuery = ({
  thread_id, isComments
}: ThreadCommentsQuery) => useQuery({
  queryKey: THREAD_COMMENTS_QUERY_KEY(thread_id),
  queryFn: async () => getThreadComments({ thread_id, limit: null, cursor: null }),
  enabled: isComments,
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});