export type ThreadCommentProps = {
	nickname: string,
	isAuthor: boolean,
	id: string,
	created_at: string,
	thread_id: string,
	content: string,
	replied: {
		id: string,
		user_nickname: string,
		content: string
	} | null
}