import { createThreadAction } from "../models/create-thread.model.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { FormThreadCategories } from "./form-thread-categories.tsx";
import { FormThreadDescription } from "./form-thread-description.tsx";
import { FormThreadTitle } from "./form-thread-title.tsx";
import { FormThreadAdditional } from "./form-thread-additional.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { lazy, Suspense, useRef } from "react";
import { Info } from "lucide-react";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { FormThreadStep } from "./form-thread-stepper.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { FormThreadContent } from "./form-thread-content.tsx";
import { addImagesAction, threadFormIsCommentAtom, threadFormIsValidAtom } from "../models/thread-form.model.ts";
import { Switch } from "@repo/ui/src/components/switch.tsx";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { IconImageInPicture } from "@tabler/icons-react";
import { spawn } from "@reatom/framework";

const FormThreadPreviewImages = lazy(() => import("./form-thread-preview-images.tsx").then(m => ({ default: m.FormThreadPreviewImages })));

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
        <p>При создании темы следуйте правилам сообщества:</p>
        <ul className="space-y-2">
          {[
            "Будьте уважительны",
            "Используйте описательные заголовки",
            "Опубликуйте в соответствующей категории",
            "Избегайте дублирования тем",
            "Отформатируйте контент для удобства чтения",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex items-center justify-center bg-shark-300/10 w-6 text-shark-50 rounded-sm aspect-square p-1">
                {i + 1}
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

const CreateImage = reatomComponent(({ ctx }) => {
  const ref = useRef<HTMLInputElement | null>(null)

  return (
    <Button
      type="button"
      onClick={() => ref.current?.click()}
      className="group hover:bg-shark-700 h-10 relative w-fit overflow-hidden"
    >
      <IconImageInPicture size={20} className="text-shark-300" />
      <Typography textSize="medium">Прикрепить изображение</Typography>
      <input
        ref={ref}
        type="file"
        title="Загрузить изображения"
        accept="image/*"
        multiple
        className="absolute hidden"
        onChange={e => addImagesAction(ctx, e)}
      />
    </Button>
  )
}, "CreateImage")

const FormThreadHead = () => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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

const FormThreadComments = reatomComponent(({ ctx }) => {
  const is_comments = ctx.spy(threadFormIsCommentAtom)

  return (
    <FormField>
      <div className="flex items-center justify-between w-full gap-y-2">
        <div className="flex flex-col">
          <Typography textColor="shark_white" textSize="large" className="text-semibold">
            Комментирование
          </Typography>
          <Typography textColor="gray" textSize="medium">
            возможность комментировать пост
          </Typography>
        </div>
        <Switch
          defaultChecked={is_comments}
          checked={is_comments}
          onCheckedChange={checked => threadFormIsCommentAtom(ctx, checked)}
        />
      </div>
    </FormField>
  );
}, "FormThreadComments")

const CreateThreadButton = reatomComponent(({ ctx }) => {
  const isDisabled = !ctx.spy(threadFormIsValidAtom)
  const isPending = ctx.spy(createThreadAction.statusesAtom).isPending

  const handle = () => {
    void spawn(ctx, async (spawnCtx) => createThreadAction(spawnCtx))
  }

  return (
    <Button
      className="bg-shark-50 self-end w-fit" 
      disabled={isDisabled || isPending} 
      pending={isPending}
      onClick={handle}
    >
      <Typography textSize="medium" className="text-shark-950 font-semibold">
        Опубликовать
      </Typography>
    </Button>
  )
}, "CreateThreadButton")

export const CreateThreadForm = reatomComponent(({ ctx }) => {
  return (
    <form className="flex 2xl:flex-row flex-col items-start gap-4 w-full">
      <div className="flex flex-col gap-y-4 w-full 2xl:w-3/4 2xl:max-w-3/4 overflow-hidden">
        <div className="flex flex-col rounded-lg bg-primary-color p-4 gap-6 w-full">
          <FormThreadHead />
          <FormThreadTitle />
          <FormThreadDescription />
          <FormThreadCategories />
          <FormThreadContent />
          <CreateImage />
          <Suspense>
            <FormThreadPreviewImages />
          </Suspense>
          <Separator />
          <div className="flex flex-col gap-4 items-start h-full *:rounded-md *:w-full">
            <FormThreadComments />
          </div>
          <Separator />
          <CreateThreadButton/>
        </div>
        <FormThreadAdditional />
      </div>
      <div className="flex flex-col gap-4 flex-grow-0 relative 2xl:sticky w-full 2xl:w-1/4 2xl:max-w-1/4 top-0 h-fit">
        <div className="flex flex-col rounded-lg bg-primary-color p-4 gap-y-4 w-full">
          <FormThreadRecommendations />
        </div>
        <div className="flex flex-col rounded-lg bg-primary-color p-4 gap-y-4 w-full">
          <FormThreadFormatHelp />
      </div>
      </div>
    </form>
  );
}, "CreateThreadForm")