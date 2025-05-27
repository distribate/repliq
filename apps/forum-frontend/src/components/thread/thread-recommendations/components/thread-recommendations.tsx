import { reatomComponent } from "@reatom/npm-react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { threadRecommendationsResource } from "../models/thread-recommendations.model";
import { THREAD_URL } from "@repo/shared/constants/routes";
import { CustomLink } from "#components/shared/link";
import { isAuthenticatedAtom } from "@repo/lib/queries/global-option-query";
import { SOCIALS } from "#components/layout/components/default/footer";

const RecommendationsList = reatomComponent(({ ctx }) => {
  const threads = ctx.spy(threadRecommendationsResource.dataAtom)?.data
  const isLoading = ctx.spy(threadRecommendationsResource.statusesAtom).isPending

  if (isLoading) return (
    <>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </>
  )

  if (!threads || !threads.length) return (
    <Typography>Ничего не нашлось :/</Typography>
  )

  return (
    threads.map((thread) => (
      <CustomLink
        to={THREAD_URL + thread.id}
        key={thread.id}
        className="flex items-center gap-2 bg-shark-800 border border-shark-700 rounded-lg hover:bg-shark-700 cursor-pointer px-4 py-2"
      >
        {thread.title}
      </CustomLink>
    ))
  )
})

export const ThreadsRecommendations = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  return (
    isAuthenticated ? (
      <div className="flex flex-col gap-y-4 bg-shark-950 rounded-lg p-4 w-full h-full">
        <Typography textSize="big" className="font-semibold">
          Другие треды, которые вам могут понравиться
        </Typography>
        <RecommendationsList />
      </div>
    ) : (
      <div className="flex flex-col w-full h-full rounded-lg bg-shark-950 p-4">
        <Typography textSize="big" className="font-semibold">
          Наши соцсети
        </Typography>
        <div className="flex flex-col gap-2 w-full h-full">
          {SOCIALS.map(item => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    )
  )
}, "ThreadRecommendations")