import { reatomComponent } from "@reatom/npm-react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { resetThreadRecommendations, threadRecommendationsAction, threadRecommendationsDataAtom } from "../models/thread-recommendations.model";
import { CustomLink } from "#shared/components/link";
import { createIdLink } from "#shared/helpers/create-link";
import { onConnect, onDisconnect } from "@reatom/framework";
import { IconImageInPicture } from "@tabler/icons-react";
import dayjs from "@repo/shared/constants/dayjs-instance"

const RecommendationsListSkeleton = () => {
  return (
    <>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </>
  )
}

onConnect(threadRecommendationsDataAtom, threadRecommendationsAction)
onDisconnect(threadRecommendationsDataAtom, (ctx) => resetThreadRecommendations(ctx))

const List = reatomComponent(({ ctx }) => {
  const threads = ctx.spy(threadRecommendationsDataAtom)

  if (ctx.spy(threadRecommendationsAction.statusesAtom).isPending) {
    return <RecommendationsListSkeleton />
  }

  if (!threads || !threads.length) {
    return <Typography>Ничего не нашлось :/</Typography>
  }

  return (
    threads.map((thread) => (
      <CustomLink
        to={createIdLink("thread", thread.id)}
        key={thread.id}
        className="flex items-start gap-2 cursor-pointer w-full h-22"
      >
        <div className="flex items-center justify-center overflow-hidden h-full w-2/5 bg-shark-800 rounded-lg">
          {thread.image_url ? (
            <img src={thread.image_url} className="object-cover h-full w-full rounded-lg" alt=""/>
          ) : (
            <IconImageInPicture size={18} className="text-shark-300" />
          )}
        </div>
        <div className="flex flex-col gap-1 items-start h-full w-3/5">
          <p className="text-md text-shark-50">
            {thread.title}
          </p>
          {thread.description && (
            <span className="text-shark-300 text-xs">
              {thread.description}
            </span>
          )}
          <span className="text-shark-300 text-xs">
            {thread.owner.nickname}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-shark-300 text-xs">
              {dayjs(thread.created_at).fromNow()}
            </span>
          </div>
        </div>
      </CustomLink>
    ))
  )
}, "RecommendationsList")

export const ThreadsRecommendations = () => {
  return (
    <div className="flex flex-col gap-2 bg-shark-900/40 rounded-xl p-4 w-full h-full">
      <Typography textSize="big" className="font-semibold">
        Другие треды, которые вам могут понравиться
      </Typography>
      <List />
    </div>
  )
}