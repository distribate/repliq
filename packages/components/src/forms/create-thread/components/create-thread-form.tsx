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
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { lazy, Suspense, useState } from "react";
import { EditorPanel } from "#editor/components/editor-panel.tsx";
import { ImagePlus } from "lucide-react";
import { ReactEditor, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor } from "slate";

const FormThreadPreviewImages = lazy(() =>
  import("./form-thread-preview-images.tsx").then(m => ({ default: m.FormThreadPreviewImages }))
);

const FormThreadEditor = ({ editor }: { editor: ReactEditor }) => {
  const { handleAddImages } = useCreateThread();

  return (
    <EditorPanel
      editor={editor}
      withImage={
        <Button
          onMouseDown={e => e.preventDefault()}
          type="button"
          className="group hover:bg-shark-700 h-10 relative w-14 overflow-hidden"
        >
          <ImagePlus size={20} className="text-shark-300" />
          <input
            type="file"
            title="Загрузить изображения"
            accept="image/*"
            multiple
            className="absolute cursor-pointer right-0 top-0 left-0 bottom-0 opacity-0 w-full"
            onChange={e => handleAddImages(e)}
          />
        </Button>
      }
    />
  )
}

export const CreateThreadForm = () => {
  const { createPostThreadMutation } = useCreateThread();
  const { data: threadFormState } = threadFormQuery();
  const [editor] = useState(() => withReact(withHistory(createEditor())));
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<zodCreateThreadForm>({
    mode: "onSubmit",
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
      className="flex 2xl:flex-row flex-col items-start gap-4 w-full"
    >
      <div className="flex flex-col gap-y-4 w-full 2xl:w-3/4 2xl:max-w-3/4 overflow-hidden">
        <BlockWrapper className="flex flex-col gap-y-6 w-full !p-4">
          <FormThreadTitle {...formChildsObj} />
          <FormThreadDescription {...formChildsObj} />
          <div className="flex flex-col gap-y-1 w-full max-w-full overflow-hidden">
            <Typography textColor="shark_white" textSize="large">
              Контент
            </Typography>
            <div className="flex flex-col gap-y-2 w-full">
              <FormThreadEditor editor={editor} />
              <FormThreadContent editor={editor} {...formChildsObj} />
            </div>
          </div>
          <Suspense>
            <FormThreadPreviewImages />
          </Suspense>
        </BlockWrapper>
        <AdditionalSections />
      </div>
      <div className="flex flex-grow-0 relative 2xl:sticky w-full 2xl:w-1/4 2xl:max-w-1/4 top-0 h-fit">
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
            <Typography textSize="medium">
              Опубликовать
            </Typography>
          </Button>
        </BlockWrapper>
      </div>
    </form>
  );
};