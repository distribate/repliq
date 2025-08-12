import { reatomComponent } from "@reatom/npm-react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { resetThreadRecommendations, threadRecommendationsAction, threadRecommendationsDataAtom } from "../models/thread-recommendations.model";
import { CustomLink } from "#components/shared/link";
import { createIdLink } from "@repo/lib/utils/create-link";
import { onConnect, onDisconnect } from "@reatom/framework";

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

const RecommendationsList = reatomComponent(({ ctx }) => {
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
        className="flex items-center gap-2 bg-shark-800 border border-shark-700 rounded-lg hover:bg-shark-700 cursor-pointer px-4 py-2"
      >
        {thread.title}
      </CustomLink>
    ))
  )
})

export const ThreadsRecommendations = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-y-4 bg-shark-950 rounded-lg p-4 w-full h-full">
      <Typography textSize="big" className="font-semibold">
        Другие треды, которые вам могут понравиться
      </Typography>
      <RecommendationsList />
    </div>
  )
}, "ThreadRecommendations")