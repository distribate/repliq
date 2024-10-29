import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { CreatePostCommentForm, PostItemFooterProps } from "../../../../../forms/create-post-comment/components/create-post-comment-form.tsx";
import { useQueryClient } from '@tanstack/react-query';

export const PostItemFooter = ({
	post_id
}: PostItemFooterProps) => {
	const qc = useQueryClient()
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	
	if (!currentUser) return null;
	
	return <CreatePostCommentForm post_id={post_id}/>
}