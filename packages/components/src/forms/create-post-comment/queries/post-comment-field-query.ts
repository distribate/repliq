import { useQuery } from "@tanstack/react-query";

export type PostCommentField = {
	post_id: string | null,
	length?: number,
	content?: string
}

const initial: PostCommentField = {
	post_id: null,
	length: 0
}

export const POST_COMMENT_FIELD_QUERY_KEY = (post_id?: string) => {
	return ["ui", "create-post-comment-field", post_id]
}

export const postCommentFieldQuery = (
	post_id?: string, focused?: boolean
) => {
	return useQuery<PostCommentField, Error>({
		queryKey: POST_COMMENT_FIELD_QUERY_KEY(post_id),
		initialData: initial,
		enabled: !!post_id && focused,
		staleTime: Infinity
	})
}