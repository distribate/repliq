import { useQuery } from "@tanstack/react-query";

export const CREATE_THREAD_COMMENT_QUERY_KEY = ["ui", "create-thread-comment"]

type CreateThreadComment = {
	content: string
}

export type CreateThreadCommentType = "single" | "reply"

export type RepliedValuesType = {
	comment_id: string,
	comment_nickname: string,
	comment_content: string
}

export type CreateThreadCommentQuery = Partial<{
	type: CreateThreadCommentType,
	repliedValues: RepliedValuesType,
	formState: Partial<{
		error: string | null,
		status: string | null,
		active: boolean
	}>,
	values: Partial<CreateThreadComment>
}>

const initial: CreateThreadCommentQuery = {
	type: "single",
	formState: {
		error: null,
		status: null,
		active: false
	},
	values: {
		content: ""
	}
}

export const createThreadCommentQuery = () => {
	return useQuery<CreateThreadCommentQuery, Error>({
		queryKey: CREATE_THREAD_COMMENT_QUERY_KEY,
		staleTime: Infinity,
		gcTime: Infinity,
		initialData: initial,
		refetchOnWindowFocus: false,
		refetchOnMount: false
	})
}