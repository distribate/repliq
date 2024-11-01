import { useQuery } from "@tanstack/react-query";

export const CREATE_THREAD_COMMENT_QUERY_KEY = ["ui", "create-thread-comment"]

type CreateThreadComment = {
	content: string
}

export type CreateThreadCommentType = "single" | "reply"

export type RepliedValuesType = {
	commentId: number,
	commentNickname: string,
	commentContent: string
}

export type CreateThreadCommentQuery = Partial<{
	threadId: string
	type: CreateThreadCommentType,
	repliedValues: RepliedValuesType | null,
	formState: Partial<{
		active: boolean
	}>,
	values: Partial<CreateThreadComment>
}>

export const initialThreadCommentData: CreateThreadCommentQuery = {
	type: "single",
	formState: { active: false },
	values: {
		content: undefined
	},
	repliedValues: null
}

export const createThreadCommentQuery = () => {
	return useQuery<CreateThreadCommentQuery, Error>({
		queryKey: CREATE_THREAD_COMMENT_QUERY_KEY,
		staleTime: Infinity,
		gcTime: Infinity,
		initialData: initialThreadCommentData,
		refetchOnMount: true
	})
}