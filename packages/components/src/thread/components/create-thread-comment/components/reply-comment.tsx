import { Reply } from 'lucide-react';
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { createThreadCommentQuery } from "../../../../forms/create-thread-comment/queries/create-thread-comment-query.ts";
import { CloseButton } from "@repo/ui/src/components/close-button.tsx";
import { useCreateThreadComment } from "../../../../forms/create-thread-comment/hooks/use-create-thread-comment.tsx";

export const ReplyComment = () => {
	const { data: createThreadCommentState } = createThreadCommentQuery()
	const { updateCreateThreadCommentMutation } = useCreateThreadComment()
	
	const values = createThreadCommentState?.repliedValues;
	
	if (createThreadCommentState.type === 'single') return null;
	
	if (!values) return;
	
	const { comment_nickname, comment_content } = values;
	
	const handleCommentType = () => {
		updateCreateThreadCommentMutation.mutate({
			type: "single",
			repliedValues: {
				comment_id: '', comment_nickname: '', comment_content: ''
			}
		})
	}
	
	return (
		<div className="flex relative items-center gap-4 rounded-t-md bg-white/10 px-4 py-2 w-full">
			<Reply size={26}/>
			<div className="flex flex-col items-start">
				<Typography textSize="small">
					Ответить {comment_nickname}
				</Typography>
				<div className="flex max-w-[120px]">
					<Typography className="text-shark-300 truncate">
						{comment_content}
					</Typography>
				</div>
			</div>
			<CloseButton variant="center" onClick={handleCommentType}/>
		</div>
	)
}