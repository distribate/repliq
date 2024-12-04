import { Separator } from "@repo/ui/src/components/separator.tsx";
import { PostAdditionalForm } from "#forms/create-post/components/post-additional-form.tsx";
import { PostPublishButton } from "#forms/create-post/components/post-publish-button.tsx";
import { postFormQuery } from "#forms/create-post/queries/post-form-query.ts";

export const CreatePostActiveSection = () => {
  const { data: createPostFormState } = postFormQuery();
  const { content, isActive } = createPostFormState;

  const postFieldLength = content ? content.length : 0;
  const isFormActive = isActive || postFieldLength >= 1;

  if (!isFormActive) return null;

  return (
    <div className="flex flex-col py-2 w-full">
      <div className="flex flex-col">
        <Separator orientation="horizontal" />
        <div className="flex items-center pt-2 justify-between w-full">
          <div className="flex items-center gap-2">
            <PostAdditionalForm />
            {/*<div className="flex gap-4 items-start">*/}
            {/*  <Camera size={18} className="text-shark-300"/>*/}
            {/*  <Video size={18} className="text-shark-300"/>*/}
            {/*</div>*/}
          </div>
          <PostPublishButton />
        </div>
      </div>
    </div>
  );
};
