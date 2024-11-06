import { useQuery } from "@tanstack/react-query";
import { getThreadComments } from './get-thread-comments.ts';
import { ThreadCommentEntity } from '@repo/types/entities/entities-type.ts';

export const THREAD_COMMENTS_QUERY_KEY = (thread_id?: string) =>
	["ui", "thread-comments", thread_id]

type ThreadCommentsQuery = Pick<ThreadCommentEntity, "thread_id"> & {
	comments: boolean
}

export const threadCommentsQuery = ({
	thread_id, comments
}: ThreadCommentsQuery) => {
	return useQuery({
		queryKey: THREAD_COMMENTS_QUERY_KEY(thread_id),
		queryFn: () => getThreadComments(thread_id),
		refetchOnWindowFocus: false,
		enabled: comments && !!thread_id
	})
}