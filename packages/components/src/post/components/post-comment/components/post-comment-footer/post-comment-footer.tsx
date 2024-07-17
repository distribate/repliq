import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from 'dayjs';
import { CommentItemProps } from '../../types/post-comment-types.ts';

type PostCommentItemFooter = Pick<CommentItemProps, "user_nickname" | "id" | "created_at" | "post_id">

export const PostCommentItemFooter = ({
	post_id, created_at, user_nickname, id: comment_id
}: PostCommentItemFooter) => {
	const handleCommentReplySection = () => {
	
	}
	
	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center gap-2">
				<Typography onClick={handleCommentReplySection} textShadow="small" className="text-sm font-medium text-shark-200 cursor-pointer">
					Ответить
				</Typography>
			</div>
			<Typography className="group-hover:opacity-100 opacity-0 transition-all ease-in text-shark-300 text-sm">
				{dayjs(created_at).format("DD.MM.YYYY HH:mm")}
			</Typography>
		</div>
	)
}