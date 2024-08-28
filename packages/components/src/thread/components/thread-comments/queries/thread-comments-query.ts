import { useQuery } from "@tanstack/react-query";
import { getThreadComments } from "./get-thread-comments.ts";

export const THREAD_COMMENTS_QUERY_KEY = (thread_id?: string) => ["ui", "thread-comments", thread_id]

export const threadCommentsQuery = (
	thread_id: string, comments: boolean
) => {
	return useQuery({
		queryKey: THREAD_COMMENTS_QUERY_KEY(thread_id),
		queryFn: () => getThreadComments({ thread_id, comments }),
		enabled: comments
	})
}