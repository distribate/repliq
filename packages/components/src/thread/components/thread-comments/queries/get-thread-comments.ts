"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { ThreadRequest } from '../../../types/thread-request-types.ts';

type CommentsReplied = {
	initiator_id: string
}

export async function getCommentsReplied({
	initiator_id
}: CommentsReplied) {
	const supabase = createClient();
	
	const { data, error } = await supabase
		.from("t_comments_replies")
		.select("recipient_comment_id")
		.eq("initiator_comment_id", initiator_id)
		.single()

	if (error) return null
	
	return data;
}

async function getCommentMore(comment_id: string) {
	const supabase = createClient();
	
	const { data, error } = await supabase
	.from("t_comments")
	.select(`
		id,
		content,
		user_nickname
	`)
	.eq("id", comment_id)
	.single()
	
	if (error) throw new Error(error.message)
	
	return data;
}

export async function getThreadComments({
	thread_id, comments
}: ThreadRequest & {
	comments?: boolean
}) {
	const supabase = createClient();
	
	if (!comments) return null;
	
	const { data, error } = await supabase
	.from("threads_comments")
	.select(`comment_id, t_comments(
		id,
		created_at,
		user_nickname,
		content
	)`)
	.eq("thread_id", thread_id)
	.order("created_at", {
		referencedTable: "t_comments",
		ascending: true
	})
	
	if (error) throw new Error(error.message);
	
	const rawComments = data.map(
		item => item.t_comments
	).flat()

	return await Promise.all(
		rawComments.map(async(item) => {
			const replied = await getCommentsReplied({
				initiator_id: item.id
			});
			
			let repliedComment = null;
			
			if (replied) {
				repliedComment = await getCommentMore(
					replied.recipient_comment_id
				);
			}

			return { ...item, replied: repliedComment };
		})
	)
}