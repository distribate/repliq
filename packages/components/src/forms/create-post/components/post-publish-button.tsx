import { Button } from "@repo/ui/src/components/button.tsx";
import { useCreatePost } from "../hooks/use-create-post.ts";
import { postFormQuery } from "../queries/post-form-query.ts";
import { POST_CONTENT_LIMIT } from '@repo/shared/constants/limits.ts';

export const PostPublishButton = () => {
	const { data: fieldQuery } = postFormQuery()
	const { createPostMutation } = useCreatePost()

	const handlePublishPost = () => {
		if (!fieldQuery.content || !fieldQuery.visibility) {
			return;
		}
		
		return createPostMutation.mutate({
			content: fieldQuery.content,
			visibility: fieldQuery.visibility || "all"
		})
	}
	
	const formFieldLength = fieldQuery?.content?.length || 0;
	
	return (
		<Button
			onClick={handlePublishPost}
			variant="action"
			disabled={formFieldLength <= POST_CONTENT_LIMIT[0] || createPostMutation.isPending}
		>
			Опубликовать
		</Button>
	)
}