import { reatomComponent } from "@reatom/npm-react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";
import { threadRecommendationsResource } from "../models/thread-recommendations.model";
import { CustomLink } from "#components/shared/link";
import { SOCIALS } from "#components/layout/components/default/footer";
import { createIdLink } from "@repo/lib/utils/create-link";
import { isAuthenticatedAtom } from "#components/auth/models/auth.model";

const RecommendationsList = reatomComponent(({ ctx }) => {
  const threads = ctx.spy(threadRecommendationsResource.dataAtom)?.data

  if (ctx.spy(threadRecommendationsResource.statusesAtom).isPending) return (
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
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  return (
    <>
      <div className="flex flex-col gap-y-4 bg-shark-950 rounded-lg p-4 w-full h-full">
        <Typography textSize="big" className="font-semibold">
          Другие треды, которые вам могут понравиться
        </Typography>
        <RecommendationsList />
      </div>
      {!isAuthenticated && (
        <div className="flex flex-col w-full gap-4 h-full rounded-lg bg-shark-950 p-4">
          <Typography textSize="big" className="font-semibold">
            Наши соцсети
          </Typography>
          <div className="flex flex-col gap-1 w-full h-full">
            {SOCIALS.map(item => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}, "ThreadRecommendations")