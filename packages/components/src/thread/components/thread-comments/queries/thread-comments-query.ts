import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getThreadComments } from './get-thread-comments.ts';
import { RequestDetails, ThreadCommentEntity } from '@repo/types/entities/entities-type.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const THREAD_COMMENTS_QUERY_KEY = (thread_id: string) =>
  createQueryKey("ui", ["thread-comments"], thread_id)

type ThreadCommentsQuery = Pick<ThreadCommentEntity, 'thread_id'> & {
  isComments: boolean
} & RequestDetails

// export const threadCommentsInfiniteQuery = ({
//   thread_id, isComments, ...filter
// }: ThreadCommentsQuery) => useInfiniteQuery({
//   queryKey: THREAD_COMMENTS_QUERY_KEY(thread_id),
//   queryFn: ({ pageParam }) =>
//     getThreadComments({ threadId: thread_id, limit: pageParam, ...filter }),
//   initialPageParam: 0,
//   getNextPageParam: (
//     lastPage, allPages, lastPageParam, allPageParams
//   ) => lastPage.nextCursor,
//   getPreviousPageParam: (
//     firstPage, allPages, firstPageParam, allPageParams
//   ) => firstPage.prevCursor,
//   enabled: isComments && !!thread_id,
//   refetchOnWindowFocus: false,
//   refetchOnMount: false,
// });

export const threadCommentsQuery = ({
  thread_id, isComments, ...filter
}: ThreadCommentsQuery) => useQuery({
  queryKey: THREAD_COMMENTS_QUERY_KEY(thread_id),
  queryFn: () => getThreadComments({ threadId: thread_id, ...filter }),
  enabled: isComments && !!thread_id,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});