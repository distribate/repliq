import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { reatomComponent } from "@reatom/npm-react";
import { forumSharedClient } from "@repo/shared/api/forum-client";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Typography } from "@repo/ui/src/components/typography";

async function getFact() {
  const res = await forumSharedClient.shared["get-fact"].$get()
  const data = await res.json();

  if (!data || "error" in data) return null;

  return data.data
}

const factResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getFact())
}).pipe(withDataAtom(), withCache(), withStatusesAtom())

export const FactSection = reatomComponent(({ ctx }) => {
  const data = ctx.spy(factResource.dataAtom)
  const isLoading = ctx.spy(factResource.statusesAtom).isPending

  return (
    <div className="flex gap-1 select-none relative minecraft-panel w-full items-start py-2 px-4 lg:px-10 overflow-x-auto">
      {isLoading ? (
        <Skeleton className="h-8 w-full" />
      ) : (
        <Typography
          font="minecraft"
          className="text-shark-800 text-[14px] lg:text-base font-semibold"
        >
          Факт: <span className="whitespace-normal font-medium">{data ? data : "ничего не нашлось"}</span>
        </Typography>
      )}
    </div>
  )
}, "FactSection")