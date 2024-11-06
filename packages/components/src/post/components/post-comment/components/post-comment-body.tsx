import { Typography } from "@repo/ui/src/components/typography.tsx";
import { PostCommentEntity } from '@repo/types/entities/entities-type.ts';

type PostCommentBody = Pick<PostCommentEntity, "content">

export const PostCommentBody =  ({
	content
}: PostCommentBody) => {
	return (
		<div className="flex w-full mb-2">
			<Typography className="text-base text-shark-50">{content}</Typography>
		</div>
	)
}