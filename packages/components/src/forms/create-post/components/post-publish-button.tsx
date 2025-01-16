import { Button } from "@repo/ui/src/components/button.tsx";
import { useCreatePost } from "../hooks/use-create-post.ts";
import { postFormQuery } from "../queries/post-form-query.ts";
import { POST_CONTENT_LIMIT } from "@repo/shared/constants/limits.ts";

export const PostPublishButton = () => {
  const { data: createPostFormState } = postFormQuery();
  const { createPostMutation } = useCreatePost();

  const { content, visibility } = createPostFormState;

  const handlePublishPost = () => {
    if (!content || !visibility) return;

    return createPostMutation.mutate({ content, visibility });
  };

  const formFieldLength = content?.length ?? 0;
  const isDisabled =
    formFieldLength <= POST_CONTENT_LIMIT[0] || createPostMutation.isPending;

  return (
    <Button onClick={handlePublishPost} variant="positive" disabled={isDisabled}>
      Опубликовать
    </Button>
  );
};
