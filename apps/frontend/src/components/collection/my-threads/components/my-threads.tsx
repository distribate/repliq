import { Typography } from "@repo/ui/src/components/typography";
import { myThreadsAction } from "../models/my-threads.model";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#shared/components/link";
import { createIdLink } from "#lib/create-link";
import { cva } from "class-variance-authority";
import { AtomState } from "@reatom/core";
import { IconPhotoScan } from "@tabler/icons-react";
import { onConnect, onDisconnect } from "@reatom/framework";
import { cn } from "@repo/shared/utils/cn";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import dayjs from "@repo/shared/constants/dayjs-instance";

export const threadCardVariants = cva(
  "flex flex-col gap-4 rounded-xl shadow-sm p-4 w-full transition hover:shadow-md bg-shark-800/20");

export const ThreadCardSkeleton = ({
  imageCount = 1,
}: { imageCount?: number }) => {
  return (
    <div className={cn(threadCardVariants({}), "animate-pulse")}>
      {imageCount > 0 && (
        <div className="flex gap-2 overflow-hidden rounded-xl">
          {Array.from({ length: Math.min(imageCount, 3) }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="aspect-video w-full rounded-xl max-h-48"
            />
          ))}
        </div>
      )}
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-1">
          <Skeleton className="h-4  w-full" />
          <Skeleton className="h-4  w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-16 self-end ml-auto" />
        </div>
      </div>
    </div>
  );
};

type ThreadItemProps = NonNullable<AtomState<typeof myThreadsAction.dataAtom>>[number]

export const ThreadItem = ({
  title, id, images, description, created_at, owner, views_count
}: ThreadItemProps) => {
  return (
    <div className={threadCardVariants({})}>
      {images.length > 0 ? (
        <div className="flex gap-2 overflow-hidden rounded-xl">
          {images.slice(0, 3).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thread-image-${idx}`}
              className="aspect-video w-full object-cover rounded-xl max-h-48"
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full gap-2 bg-shark-800 h-48 overflow-hidden rounded-xl">
          <IconPhotoScan size={36} className="text-shark-300" />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground line-clamp-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-md line-clamp-3">{description}</p>
        )}
        <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
          <span>👤 {owner}</span>
          <span>👁️ {views_count.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <CustomLink
            to={createIdLink("thread", id)}
            className="bg-shark-50 flex items-center justify-center w-2/4 px-4 py-2 rounded-lg"
          >
            <Typography textColor="shark_black" textSize="medium" className='font-semibold'>
              Перейти к треду
            </Typography>
          </CustomLink>
          <div className="text-right text-md text-muted-foreground">
            🕒 {dayjs(created_at).fromNow()}
          </div>
        </div>
      </div>
    </div>
  )
}

const ThreadsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 auto-rows-auto gap-2 w-full h-fit">
      <ThreadCardSkeleton />
      <ThreadCardSkeleton />
      <ThreadCardSkeleton />
    </div>
  )
}

onConnect(myThreadsAction.dataAtom, myThreadsAction)
onDisconnect(myThreadsAction.dataAtom, (ctx) => myThreadsAction.dataAtom.reset(ctx))

export const MyThreads = reatomComponent(({ ctx }) => {
  const threads = ctx.spy(myThreadsAction.dataAtom)
  const isExist = threads && threads.length >= 1
  const isLoading = ctx.spy(myThreadsAction.statusesAtom).isPending

  if (isLoading) {
    return <ThreadsSkeleton />
  }

  if (!isExist) {
    return <ContentNotFound title="Тредов еще нет" />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-2 w-full h-fit">
      {threads.map(thread => (
        <ThreadItem key={thread.id} {...thread} />
      ))}
    </div>
  )
}, "MyThreads")