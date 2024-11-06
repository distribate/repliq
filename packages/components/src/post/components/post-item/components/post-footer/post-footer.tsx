import { CreatePostCommentForm } from '#forms/create-post-comment/components/create-post-comment-form.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

export const PostItemFooter = ({
	id
}: Pick<PostEntity, "id">) => {
	const currentUser = getUser();
	if (!currentUser) return null;
	
	return <CreatePostCommentForm id={id}/>
}