"use client"

import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { createThreadCommentQuery } from "../../../../forms/create-thread-comment/queries/create-thread-comment-query.ts";
import { ReplyComment } from "./reply-comment.tsx";
import { CreateThreadCommentForm } from "../../../../forms/create-thread-comment/components/create-thread-comment-form.tsx";

type CreateThreadCommentProps = {
	thread_id: string
}

export const CreateThreadComment = ({
	thread_id
}: CreateThreadCommentProps) => {
	const { data: currentUser } = currentUserQuery()
	const { data: createThreadCommentState } = createThreadCommentQuery()
	
	if (!createThreadCommentState || !currentUser) return null;
	
	const type = createThreadCommentState.type || "single";
	
	return (
		<div className="flex flex-col w-full">
			{type === 'reply' && <ReplyComment/>}
			<CreateThreadCommentForm thread_id={thread_id}/>
		</div>
	)
}