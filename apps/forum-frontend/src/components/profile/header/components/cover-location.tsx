import { userGameStatusResource } from "#components/user/avatar/models/user-game-status.model";
import { reatomComponent } from "@reatom/npm-react";
import { lazy, Suspense } from "react";
import { openLocationViewerAction } from "../models/cover.model";
import { Typography } from "@repo/ui/src/components/typography";

const Location = lazy(() => import("#components/user/location/components/user-location.tsx").then(m => ({ default: m.UserLocation })))

export const UserCoverLocation = reatomComponent(({ ctx }) => {
  const isOnlineInGame = ctx.spy(userGameStatusResource.dataAtom)?.type === 'online'

  if (!isOnlineInGame) return null;

  return (
    <div className="absolute top-4 font-[Minecraft] right-4 z-[5] bg-black/40 px-4 py-1 rounded-md w-fit">
      <Suspense>
        <Location />
      </Suspense>
      <div className="flex items-center gap-2 w-fit">
        <Typography className="text-white">
          прямо сейчас в игре
        </Typography>
        <div
          onClick={() => openLocationViewerAction(ctx)}
          className="inline-flex cursor-pointer w-fit items-center bg-shark-50 rounded-lg justify-center px-1 py-[0.5px]"
        >
          <span className="text-[14px] text-shark-950">что?</span>
        </div>
      </div>
    </div>
  )
})