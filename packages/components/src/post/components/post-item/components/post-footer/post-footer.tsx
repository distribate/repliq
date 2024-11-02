import { CreatePostCommentForm, PostItemFooterProps } from '#forms/create-post-comment/components/create-post-comment-form.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export const PostItemFooter = ({
	post_id
}: PostItemFooterProps) => {
	const currentUser = getUser();
	if (!currentUser) return null;
	
	return <CreatePostCommentForm post_id={post_id}/>
}