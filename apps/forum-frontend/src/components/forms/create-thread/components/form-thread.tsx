import { useCreateThread } from "../hooks/use-create-thread.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { BlockWrapper } from "#components/wrappers/components/block-wrapper.tsx";
import { FormThreadCategories } from "./form-thread-categories.tsx";
import { FormThreadComments } from "./form-thread-comments.tsx";
import { FormThreadDescription } from "./form-thread-description.tsx";
import { FormThreadTitle } from "./form-thread-title.tsx";
import { Control, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { threadFormQuery } from "#components/forms/create-thread/queries/thread-form-query.ts";
import { FormThreadAdditional } from "./form-thread-additional.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { lazy, Suspense } from "react";
import { z } from "zod";
import { createThreadSchema } from "../schemas/create-form-schema.ts";
import { Edit, Eye, HelpCircle, ImagePlus, Info } from "lucide-react";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/src/components/tabs.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { FormThreadStep } from "./form-thread-stepper.tsx";
import { useEditThread } from "../hooks/use-edit-thread.tsx";
import { serializeNodes } from "@repo/lib/helpers/nodes-serializer.ts";

const FormThreadPreviewImages = lazy(() => import("./form-thread-preview-images.tsx")
  .then(m => ({ default: m.FormThreadPreviewImages }))
);

const FormThreadEditor = lazy(() => import('./form-thread-editor.tsx')
  .then(m => ({ default: m.FormThreadEditor }))
)

type zodCreateThreadForm = z.infer<typeof createThreadSchema>;

export type FormChildsProps = {
  control: Control<zodCreateThreadForm, any>;
  errors: FieldErrors<zodCreateThreadForm>;
};

const FormThreadRecommendations = () => {
  return (
    <div className="flex flex-col w-full gap-2">
      <div
        className="flex items-center gap-2 w-fit"
      >
        <Info size={18} className="text-shark-300" />
        <Typography textSize="large" textColor="gray">
          Рекомендации
        </Typography>
      </div>
      <div className="space-y-4 text-sm">
        <p>При создании темы следуйте нашим правилам сообщества:</p>
        <ul className="space-y-2">
          {[
            "Будьте уважительны к другим членам",
            "Используйте описательные заголовки",
            "Опубликовать в соответствующей категории",
            "Избегайте дублирования тем",
            "Отформатируйте свой контент для удобства чтения",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="bg-shark-300/10 text-shark-50 rounded-full p-1 mt-0.5">
                <HelpCircle className="h-3 w-3" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const FormThreadFormatHelp = () => {
  return (
    <div className="flex flex-col gap-2">
      <Typography textSize="large" textColor="gray">
        Помощь по форматированию
      </Typography>
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="font-mono bg-shark-700 p-1 rounded text-xs">**текст**</div>
          <div className="font-medium">Жирный текст</div>
          <div className="font-mono bg-shark-700 p-1 rounded text-xs">_текст_</div>
          <div className="italic">Рекурсивный текст</div>
          <div className="font-mono bg-shark-700 p-1 rounded text-xs">## Текст</div>
          <div className="font-semibold">Заголовок</div>
          <div className="font-mono bg-shark-700 p-1 rounded text-xs">[Link](https://)</div>
          <div className="text-shark-300 underline">Ссылка</div>
          <div className="font-mono bg-shark-700 p-1 rounded text-xs">```code```</div>
          <div className="font-mono text-xs bg-shark-700/50 p-0.5 rounded">Блок с кодом</div>
        </div>
      </div>
    </div>
  )
}

const CreateImage = () => {
  const { handleAddImages } = useEditThread();

  return (
    <Button
      onMouseDown={e => e.preventDefault()}
      type="button"
      className="group hover:bg-shark-700 h-10 relative w-fit overflow-hidden"
    >
      <ImagePlus size={20} className="text-shark-300" />
      <Typography textSize="medium">
        Прикрепить изображение
      </Typography>
      <input
        type="file"
        title="Загрузить изображения"
        accept="image/*"
        multiple
        className="absolute cursor-pointer right-0 top-0 left-0 bottom-0 opacity-0 w-full"
        onChange={e => handleAddImages(e)}
      />
    </Button>
  )
}

const FormThreadHead = () => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Typography textSize="big" textColor="shark_white">
          Создание треда
        </Typography>
        <FormThreadStep />
      </div>
      <span className="text-shark-300 text-sm">
        Поделитесь своими мыслями с сообществом
      </span>
    </div>
  )
}

const FormThreadContent = () => {
  return (
    <div className="flex flex-col gap-y-1 w-full max-w-full overflow-hidden">
      <Typography textColor="shark_white" textSize="large">
        Контент <span className="text-red-500">*</span>
      </Typography>
      <Tabs defaultValue="edit" className="flex flex-col w-full gap-4">
        <TabsList className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 *:w-full">
          <TabsTrigger value="edit" className="flex group items-center justify-center gap-2">
            <Edit
              size={20}
              className="group-data-[state=active]:text-shark-900 text-shark-50"
            />
            <span>Редактирование</span>
          </TabsTrigger>
          <TabsTrigger disabled value="preview" className="flex group items-center justify-center gap-2">
            <Eye
              size={20}
              className="group-data-[state=active]:text-shark-900 text-shark-50"
            />
            <span>Предварительный просмотр</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Suspense fallback={<Skeleton className="h-44 w-full" />}>
            <FormThreadEditor />
          </Suspense>
        </TabsContent>
        <TabsContent value="preview">
          Preview built...
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const CreateThreadForm = () => {
  const { createPostThreadMutation } = useCreateThread();
  const { data: threadFormState } = threadFormQuery();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<zodCreateThreadForm>({
    mode: "onSubmit",
    resolver: zodResolver(createThreadSchema),
    values: {
      title: threadFormState.title,
      category_id: threadFormState.category_id ?? undefined,
      images: null,
      is_comments: false,
      permission: false,
      tags: [],
      visibility: "all",
      description: null,
      content: serializeNodes(threadFormState.content)
    },
    defaultValues: {
      is_comments: threadFormState.is_comments,
      permission: threadFormState.permission,
      tags: threadFormState.tags,
      visibility: threadFormState.visibility,
      description: threadFormState.description,
      images: null,
    },
  });

  const onSubmit = () => createPostThreadMutation.mutate()

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex 2xl:flex-row flex-col items-start gap-4 w-full"
    >
      <div className="flex flex-col gap-y-4 w-full 2xl:w-3/4 2xl:max-w-3/4 overflow-hidden">
        <BlockWrapper className="flex flex-col gap-y-6 w-full !p-4">
          <FormThreadHead />
          <FormThreadTitle control={control} errors={errors} />
          <FormThreadDescription control={control} errors={errors} />
          <FormThreadCategories control={control} errors={errors} />
          <FormThreadContent />
          <CreateImage />
          <Suspense>
            <FormThreadPreviewImages />
          </Suspense>
          <Separator />
          <div className="flex flex-col gap-4 items-start h-full *:rounded-md *:w-full">
            <FormThreadComments control={control} errors={errors} />
          </div>
          <Separator />
          <Button
            variant="positive"
            className="self-end w-fit"
            disabled={createPostThreadMutation.isPending || !isValid}
            pending={createPostThreadMutation.isPending}
          >
            <Typography textSize="medium" className="font-semibold">
              Опубликовать
            </Typography>
          </Button>
        </BlockWrapper>
        <FormThreadAdditional />
      </div>
      <div className="flex flex-col gap-4 flex-grow-0 relative 2xl:sticky w-full 2xl:w-1/4 2xl:max-w-1/4 top-0 h-fit">
        <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
          <FormThreadRecommendations />
        </BlockWrapper>
        <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
          <FormThreadFormatHelp />
        </BlockWrapper>
      </div>
    </form>
  );
};