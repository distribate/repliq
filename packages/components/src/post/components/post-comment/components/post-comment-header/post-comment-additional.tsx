import { Ellipsis } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { CommentItemProps } from '../../types/post-comment-types.ts';
import { useControlComment } from '../../hooks/use-control-comment.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';

type PostCommentItemAdditional = Pick<CommentItemProps, "id"
	| "user_nickname"
	| "post_id"
>

export const PostCommentItemAdditional = ({
	id: comment_id, user_nickname, post_id
}: PostCommentItemAdditional) => {
	const currentUser = getUser();
	const { controlCommentMutation } = useControlComment()
	
	if (!currentUser) return;
	
	const isOwner = currentUser.nickname === user_nickname;
	
	return (
		<DropdownWrapper
			properties={{ sideAlign: "left", contentAlign: "start" }}
			trigger={<Ellipsis size={18} className="text-shark-300 cursor-pointer"/>}
			content={
				<div className="flex flex-col gap-y-2 w-full">
					{isOwner && (
						<>
							<HoverCardItem onClick={(e) => {
								e.preventDefault()
								controlCommentMutation.mutate({
									type: "remove", post_id, comment_id
								})
							}}>
								<Typography textShadow="small" className="text-sm font-medium text-shark-50 cursor-pointer">
									Удалить комментарий
								</Typography>
							</HoverCardItem>
							<Separator/>
						</>
					)}
					<HoverCardItem>
						<Typography textShadow="small" className="text-sm font-medium text-red-500 cursor-pointer">
							Пожаловаться
						</Typography>
					</HoverCardItem>
				</div>
			}
		/>
	)
}