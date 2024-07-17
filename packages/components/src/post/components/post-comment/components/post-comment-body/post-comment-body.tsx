import { Typography } from "@repo/ui/src/components/typography.tsx";
import { CommentItemProps } from '../../types/post-comment-types.ts';

type PostCommentBody = Pick<CommentItemProps, "content">

export const PostCommentBody =  ({
	content
}: PostCommentBody) => {
	return (
		<div className="flex w-full mb-2">
			<Typography className="text-base text-shark-50">{content}</Typography>
		</div>
	)
}