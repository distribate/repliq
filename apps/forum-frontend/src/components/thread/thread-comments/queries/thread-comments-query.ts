import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getThreadComments } from './get-thread-comments.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { GetThreadCommentsResponse } from '@repo/types/entities/thread-comments-types.ts';
import { ThreadDetailed } from '@repo/types/entities/thread-type.ts';

export const THREAD_COMMENTS_QUERY_KEY = (thread_id: string) =>
  createQueryKey('ui', ['thread-comments'], thread_id);

type ThreadCommentsQuery = Pick<ThreadDetailed, 'id' | "properties">

export type ThreadComment = Pick<GetThreadCommentsResponse, "data">["data"][0]

export const threadCommentsQuery = ({
  id, properties: { is_comments }
}: ThreadCommentsQuery) => useQuery({
  queryKey: THREAD_COMMENTS_QUERY_KEY(id),
  queryFn: () => getThreadComments({ threadId: id }),
  enabled: is_comments,
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
});