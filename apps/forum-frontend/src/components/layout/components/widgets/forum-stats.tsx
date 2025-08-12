import { forumSharedClient } from "#shared/forum-client";
import { AnimatedNumber } from "#ui/animated-number";
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { reatomComponent } from "@reatom/npm-react";

const publicStatsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumSharedClient.shared["get-public-stats"].$get()
    const data = await res.json()

    if ("error" in data) {
      return null;
    }

    return {
      threads: Number(data.data.threads_count),
      users: Number(data.data.users_count),
      posts: Number(data.data.posts_count)
    }
  })
}).pipe(withStatusesAtom(), withCache(), withDataAtom({ users: 0, threads: 0, posts: 0 }))

export const ForumStats = reatomComponent(({ ctx }) => {
  const data = ctx.spy(publicStatsResource.dataAtom)

  return (
    <>
      <div className="text-center">
        <AnimatedNumber
          className='text-3xl font-bold text-pink-300 mb-1'
          springOptions={{
            bounce: 0,
            duration: 2000,
          }}
          value={data?.users ?? 50}
        />
        <div className="text-shark-50">Участников</div>
      </div>
      <div className="text-center">
        <AnimatedNumber
          className='text-3xl font-bold text-pink-300 mb-1'
          springOptions={{
            bounce: 0,
            duration: 2000,
          }}
          value={data?.threads ?? 50}
        />
        <div className="text-shark-50">Тредов</div>
      </div>
      <div className="text-center">
        <AnimatedNumber
          className='text-3xl font-bold text-pink-300 mb-1'
          springOptions={{
            bounce: 0,
            duration: 2000,
          }}
          value={data?.posts ?? 50}
        />
        <div className="text-shark-50">Постов</div>
      </div>
    </>
  )
}, "ForumStats")
