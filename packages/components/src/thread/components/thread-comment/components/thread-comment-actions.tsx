"use client"

import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useCreateThreadComment } from "../../../../forms/create-thread-comment/hooks/use-create-thread-comment.tsx";
import { RepliedValuesType } from "../../../../forms/create-thread-comment/queries/create-thread-comment-query.ts";
import { ReportItem } from "../../../../report/components/report-item.tsx";

type ThreadCommentActionsProps = RepliedValuesType & {
	thread_id: string
}

export const ThreadCommentActions = ({
	comment_id, comment_nickname, comment_content, thread_id
}: ThreadCommentActionsProps) => {
	const { updateCreateThreadCommentMutation } = useCreateThreadComment();
	
	const handleReplyComment = () => {
		updateCreateThreadCommentMutation.mutate({
			type: "reply",
			repliedValues: {
				comment_id, comment_nickname, comment_content
			}
		})
	}

	return (
		<div className="flex items-center gap-4">
			<Typography className="text-shark-300 text-md cursor-pointer" onClick={handleReplyComment}>
				Ответить
			</Typography>
			<ReportItem report_type="comment" threadId={thread_id} targetId={comment_id}/>
		</div>
	)
}