import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { reatomComponent } from "@reatom/npm-react"
import { forumSharedClient } from "@repo/shared/api/forum-client"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { useState } from "react"

async function getStaticImage() {
  const res = await forumSharedClient.shared["get-auth-image"].$get({ query: { random: "true" } })
  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

export const authImageResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getStaticImage())
}).pipe(withDataAtom(), withStatusesAtom(), withCache())

export const AuthImage = reatomComponent(({ ctx }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const url = ctx.spy(authImageResource.dataAtom)
  const isLoading = ctx.spy(authImageResource.statusesAtom).isPending

  if (isLoading) return <Skeleton className="absolute w-full h-screen" />

  if (!url) return null;

  return (
    <img
      src={url}
      width={1920}
      height={1080}
      alt=""
      draggable={false}
      onLoad={() => setIsLoaded(true)}
      className={`w-full h-screen absolute object-cover transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    />
  )
}, "AuthImage")