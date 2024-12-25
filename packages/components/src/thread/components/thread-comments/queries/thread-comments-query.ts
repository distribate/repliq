import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getThreadComments } from './get-thread-comments.ts';
import {
  ThreadCommentEntity,
} from '@repo/types/entities/entities-type.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { z } from 'zod';
import { getThreadCommentsSchema } from '@repo/types/schemas/thread/get-thread-comments-schema.ts';

export const THREAD_COMMENTS_QUERY_KEY = (thread_id: string) =>
  createQueryKey('ui', [ 'thread-comments' ], thread_id);

type ThreadCommentsQuery = Pick<ThreadCommentEntity, 'thread_id'>
  & { isComments: boolean; }

type RepliedDetails = {
  replied: Pick<ThreadCommentEntity, 'id' | 'content' | 'user_nickname'> | null;
};

export type ThreadComment = RepliedDetails & ThreadCommentEntity;

export type ThreadCommentsFiltationQuery = z.infer<typeof getThreadCommentsSchema>

export const THREAD_COMMENTS_FILTRATION_QUERY_KEY = (thread_id: string) =>
  createQueryKey("ui", ["thread-comments", "filtration"], thread_id)

const threadCommentsFiltrationQuery = (thread_id: string) => useQuery<
  ThreadCommentsFiltationQuery, Error
>({
  queryKey: THREAD_COMMENTS_FILTRATION_QUERY_KEY(thread_id),
  initialData: {
    range: [0, 4],
    ascending: false,
    limit: 4
  },
  refetchOnWindowFocus: false,
  refetchOnMount: false
})

export const threadCommentsQuery = ({
  thread_id, isComments
}: ThreadCommentsQuery) => {
  const { data: { range, limit, ascending } } = threadCommentsFiltrationQuery(thread_id)
  
  return useQuery({
    queryKey: THREAD_COMMENTS_QUERY_KEY(thread_id),
    queryFn: () => getThreadComments({ thread_id, range, limit, ascending }),
    enabled: isComments,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData
  });
};