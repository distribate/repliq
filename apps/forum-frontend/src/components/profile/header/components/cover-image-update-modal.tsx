import { ImageUp } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { DynamicModal } from "../../../modals/dynamic-modal/components/dynamic-modal.tsx";
import { ChangeEvent, Suspense, useRef } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { uploadBackgroundImageAction } from "#components/profile/header/models/cover-image.model.ts";
import { Image } from 'lucide-react';
import { imagesLibraryAction } from '#components/profile/header/models/cover-image.model.ts';
import { spawn } from "@reatom/framework";
import { IconCloud } from "@tabler/icons-react";

const BackgroundImagesSkeleton = () => {
  return (
    <>
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
    </>
  )
}

const CoverImagesList = reatomComponent(({ ctx }) => {
  const defaultImages = ctx.spy(imagesLibraryAction.dataAtom)

  if (ctx.spy(imagesLibraryAction.statusesAtom).isPending) {
    return <BackgroundImagesSkeleton />
  }

  const handle = (name: string) => {
    void spawn(ctx, async (spawnCtx) => uploadBackgroundImageAction(spawnCtx, { fileName: name, type: "default" }))
  }

  return (
    <>
      {!defaultImages && <Typography>Изображения не найдены</Typography>}
      {defaultImages && defaultImages.map(({ name, id, url }) => (
        <div
          key={id}
          className="flex flex-col rounded-lg overflow-hidden border border-shark-800 
            relative hover:bg-secondary-color cursor-pointer group transition-all duration-150 w-full"
          onClick={() => handle(name)}
        >
          <img
            src={url}
            alt={name}
            height={900}
            width={1200}
            loading="lazy"
            className="min-w-[340px] group-hover:brightness-50 transition-all duration-150"
          />
        </div>
      ))}
    </>
  );
}, "CoverImagesList")

const CoverImageDefaultImagesModal = reatomComponent(({ ctx }) => {
  return (
    <DynamicModal
      autoClose
      withLoader
      isPending={ctx.spy(uploadBackgroundImageAction.statusesAtom).isPending}
      contentClassName="max-w-6xl"
      trigger={
        <HoverCardItem className="w-full gap-2 p-6 group items-center">
          <Image size={24} className="text-shark-300" />
          <Typography textSize="large" textColor="shark_white">
            Выбрать из библиотеки
          </Typography>
        </HoverCardItem>
      }
      content={
        <div className="flex flex-col items-center gap-y-4 w-full">
          <Typography variant="dialogTitle" textColor="shark_white">
            Библиотека
          </Typography>
          <div className="grid grid-cols-3 gap-2 grid-rows-1 w-full">
            <CoverImagesList />
          </div>
        </div>
      }
    />
  );
}, "CoverImageDefaultImagesModal")

const CoverImageUploadCustom = reatomComponent(({ ctx }) => {
  const ref = useRef<HTMLInputElement | null>(null)

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files ? e.target.files[0] : null;
    if (!file) return;

    void spawn(ctx, async (spawnCtx) => uploadBackgroundImageAction(spawnCtx, { file, type: "custom" }))
  };

  return (
    <HoverCardItem onClick={() => ref.current?.click()} className="relative gap-2 p-6 items-center group">
      <IconCloud size={24} className="text-shark-300" />
      <Typography textSize="large" textColor="shark_white">
        Загрузить своё
      </Typography>
      <input
        ref={ref}
        type="file"
        id="file"
        className="absolute right-0 top-0 left-0 bottom-0 hidden w-full"
        onChange={handle}
      />
    </HoverCardItem>
  );
}, "CoverImageUploadCustom")

export const CoverImageUpdateModal = reatomComponent(({ ctx }) => {
  return (
    <DynamicModal
      autoClose
      withLoader
      isPending={ctx.spy(uploadBackgroundImageAction.statusesAtom).isPending}
      trigger={
        <div className="flex hover:bg-shark-600 rounded-md p-2 gap-2 items-center group">
          <ImageUp size={20} className="text-shark-300 group-hover:text-pink-500" />
          <Typography>Обновить фон</Typography>
        </div>
      }
      content={
        <div className="flex flex-col items-center gap-4 w-full">
          <Typography variant="dialogTitle">
            Обновление фона
          </Typography>
          <div className="flex flex-col items-center p-2 justify-center *:w-full w-full">
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
              <CoverImageDefaultImagesModal />
            </Suspense>
            <CoverImageUploadCustom />
          </div>
        </div>
      }
    />
  );
}, "CoverImageUpdateModal")