import { Button } from "@repo/ui/src/components/button.tsx";
import { useCreatePost } from "../hooks/use-create-post.ts";
import { postFormQuery } from "../queries/post-form-query.ts";

export const PostPublishButton = () => {
	const { data: fieldQuery } = postFormQuery()
	const { createPostMutation } = useCreatePost()

	const handlePublishPost = () => {
		if (!fieldQuery.content || !fieldQuery.visibility) {
			return;
		}
		
		createPostMutation.mutate({
			content: fieldQuery.content,
			visibility: fieldQuery.visibility || "all"
		})
	}
	
	const formFieldLength = fieldQuery.length || 0;
	
	return (
		<Button
			onClick={handlePublishPost}
			variant="action"
			disabled={formFieldLength <= 1 || createPostMutation.isPending}
		>
			Опубликовать
		</Button>
	)
}