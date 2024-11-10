
export type PostCommentField = {
	post_id: string | null,
	content?: string
}

export const POST_COMMENT_FIELD_QUERY_KEY = (post_id?: string) =>
	["ui", "create-post-comment-field", post_id]