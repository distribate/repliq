import { useQuery } from "@tanstack/react-query";
import { getThreadComments, ThreadComment } from './get-thread-comments.ts';

export const THREAD_COMMENTS_QUERY_KEY = (thread_id?: string) => ["ui", "thread-comments", thread_id]

type ThreadCommentsQuery = {
	threadId: string,
	comments: boolean
}

export const threadCommentsQuery = ({
	threadId, comments
}: ThreadCommentsQuery) => {
	return useQuery<ThreadComment[] | undefined>({
		queryKey: THREAD_COMMENTS_QUERY_KEY(threadId),
		queryFn: () => getThreadComments(threadId),
		enabled: comments && !!threadId
	})
}