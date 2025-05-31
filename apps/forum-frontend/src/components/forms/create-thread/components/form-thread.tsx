import { createThreadAction } from "../models/create-thread.model.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { BlockWrapper } from "#components/wrappers/components/block-wrapper.tsx";
import { FormThreadCategories } from "./form-thread-categories.tsx";
import { FormThreadComments } from "./form-thread-comments.tsx";
import { FormThreadDescription } from "./form-thread-description.tsx";
import { FormThreadTitle } from "./form-thread-title.tsx";
import { FormThreadAdditional } from "./form-thread-additional.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { lazy, Suspense } from "react";
import { HelpCircle, ImagePlus, Info } from "lucide-react";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { FormThreadStep } from "./form-thread-stepper.tsx";
import { handleAddImagesAction } from "../models/edit-thread.model.ts";
import { reatomComponent } from "@reatom/npm-react";
import { FormThreadContent } from "./form-thread-content.tsx";

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

const CreateImage = reatomComponent(({ ctx }) => {
  return (
    <Button
      type="button"
      onMouseDown={e => e.preventDefault()}
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
        onChange={e => handleAddImagesAction(ctx, e)}
      />
    </Button>
  )
}, "CreateImage")

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

export const CreateThreadForm = reatomComponent(({ ctx }) => {
  const isPending = ctx.spy(createThreadAction.statusesAtom).isPending

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); createThreadAction(ctx) }}
      className="flex 2xl:flex-row flex-col items-start gap-4 w-full"
    >
      <div className="flex flex-col gap-y-4 w-full 2xl:w-3/4 2xl:max-w-3/4 overflow-hidden">
        <BlockWrapper className="flex flex-col gap-y-6 w-full !p-4">
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
          <Button
            variant="positive" className="self-end w-fit" disabled={isPending} pending={isPending}
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
}, "CreateThreadForm")