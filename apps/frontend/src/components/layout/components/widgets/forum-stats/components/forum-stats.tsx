import { AnimatedNumber } from "#ui/animated-number";
import { reatomComponent } from "@reatom/npm-react";
import { publicStatsResource } from "../models/forum-stats.model";

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
