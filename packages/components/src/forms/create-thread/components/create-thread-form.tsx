import { useCreateThread } from "../hooks/use-create-thread.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { BlockWrapper } from "#wrappers/block-wrapper.tsx";
import { FormThreadContent } from "./form-thread-content.tsx";
import { FormThreadCategories } from "./form-thread-categories.tsx";
import { FormThreadComments } from "./form-thread-comments.tsx";
import { FormThreadDescription } from "./form-thread-description.tsx";
import { FormThreadTitle } from "./form-thread-title.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { threadFormQuery } from "#forms/create-thread/queries/thread-form-query.ts";
import { createThreadSchema, FormChildsProps, zodCreateThreadForm } from "../types/create-thread-form-types.ts";
import { AdditionalSections } from "./additional-sections.tsx";
import { FormThreadPreviewImages } from "./form-thread-preview-images.tsx";

export const CreateThreadForm = () => {
  const { createPostThreadMutation } = useCreateThread();
  const { data: threadFormState } = threadFormQuery();
  const { control, handleSubmit, setValue, resetField, getValues, formState: { errors, isValid } } = useForm<zodCreateThreadForm>({
    mode: "onChange",
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      is_comments: threadFormState.is_comments,
      permission: threadFormState.permission,
      tags: threadFormState.tags,
      visibility: threadFormState.visibility,
      description: threadFormState.description,
      images: null,
    },
  });

  const formChildsObj: FormChildsProps = { errors, control };

  return (
    <form
      onSubmit={handleSubmit(() => createPostThreadMutation.mutate())}
      className="flex items-start gap-4 w-full"
    >
      <div className="flex flex-col gap-y-4 w-3/4 max-w-3/4 overflow-hidden">
        <BlockWrapper className="flex flex-col gap-y-6 w-full !p-4">
          <FormThreadTitle {...formChildsObj} />
          <FormThreadDescription {...formChildsObj} />
          <FormThreadContent {...formChildsObj} />
          <FormThreadPreviewImages
            setValue={setValue}
            images={getValues("images")}
            resetField={resetField}
            {...formChildsObj}
          />
        </BlockWrapper>
        <AdditionalSections />
      </div>
      <div className="flex flex-grow-0 sticky w-1/4 max-w-1/4 top-0 h-fit">
        <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
          <FormThreadCategories {...formChildsObj} />
          <Separator />
          <div className="flex flex-col gap-4 items-start h-full *:rounded-md *:w-full">
            <FormThreadComments {...formChildsObj} />
          </div>
          <Separator />
          <Button
            variant="positive"
            disabled={createPostThreadMutation.isPending || !isValid}
            pending={createPostThreadMutation.isPending}
          >
            Опубликовать
          </Button>
        </BlockWrapper>
      </div>
    </form>
  );
};