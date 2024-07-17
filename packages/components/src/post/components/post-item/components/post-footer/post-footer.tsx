import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { CreatePostCommentForm, PostItemFooterProps } from "../../../../../forms/create-post-comment/components/create-post-comment-form.tsx";

export const PostItemFooter = ({
	post_id
}: PostItemFooterProps) => {
	const { data: currentUser } = currentUserQuery();
	
	if (!currentUser) return;
	
	return <CreatePostCommentForm post_id={post_id}/>
}