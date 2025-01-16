import { Separator } from "@repo/ui/src/components/separator.tsx";
import { PostAdditionalForm } from "#forms/create-post/components/post-additional-form.tsx";
import { PostPublishButton } from "#forms/create-post/components/post-publish-button.tsx";
import { CreatePostFieldType, POST_FORM_FIELD_QUERY_KEY } from "#forms/create-post/queries/post-form-query.ts";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { useQueryClient } from "@tanstack/react-query";

const PostCreateCancelButton = () => {
  const qc = useQueryClient();

  const handleCancel = () => {
    qc.setQueryData(POST_FORM_FIELD_QUERY_KEY, (prev: CreatePostFieldType) => ({ ...prev, isActive: false }));
  };

  return (
    <Button onClick={handleCancel} variant="negative">
      <Typography>Отмена</Typography>
    </Button>
  );
}

export const CreatePostActiveSection = () => {
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
          <div className="flex items-center gap-2">
            <PostCreateCancelButton />
            <PostPublishButton />
          </div>
        </div>
      </div>
    </div>
  );
};