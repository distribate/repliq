import { CoverArea } from "@repo/ui/src/components/cover-area.tsx";
import { UserCoverMainInfo } from "./cover-main-info.tsx";
import { UserCoverPanel } from "./cover-panel.tsx";
import { coverQuery } from "#components/profile/header/queries/cover-query.ts";
import { requestedUserQuery } from "@repo/lib/queries/requested-user-query.ts";
import { UserCoverWatermark } from "./cover-watermark.tsx";
import { Suspense, useState } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { userGameStatusQuery } from "#components/user/avatar/queries/user-game-status-query.ts";
import { Dialog, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { useQuery } from "@tanstack/react-query";

type UserCoverProps = {
  nickname: string
};

async function getUserLocation(nickname: string) {
  const res = await forumUserClient.user["get-user-location"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  return data.data
}

const userLocationQuery = (nickname: string, enabled: boolean) => useQuery({
  queryKey: createQueryKey("user", ["location"], nickname),
  queryFn: () => getUserLocation(nickname),
  enabled
})

function getPlayerDirection(pitch: number, yaw: number): string {
  if (yaw < 0) {
    yaw += 360;
  }

  let horizontalDirection: string;

  if (yaw >= 315 || yaw < 45) {
    horizontalDirection = "взгляд на север";
  } else if (yaw >= 45 && yaw < 135) {
    horizontalDirection = "взгляд на восток";
  } else if (yaw >= 135 && yaw < 225) {
    horizontalDirection = "взгляд на юг";
  } else {
    horizontalDirection = "взгляд на запад";
  }

  let verticalDirection: string;

  if (pitch > 45) {
    verticalDirection = "смотрит вверх";
  } else if (pitch < -45) {
    verticalDirection = "смотрит вниз";
  } else {
    verticalDirection = "смотрит прямо";
  }

  return `${horizontalDirection} и ${verticalDirection}`;
}

const UserStatusEvent = ({ nickname }: UserCoverProps) => {
  const [open, setOpen] = useState(false)
  const { data: status } = userGameStatusQuery(nickname, true)
  const { data: location } = userLocationQuery(nickname, status?.type === 'online')

  if (!status || status.type === 'offline') return null;

  let pitch: number | null = null
  let yaw: number | null = null;
  let x: number | null = null;
  let y: number | null = null;
  let z: number | null = null;
  let world: string | null = null
  let customLocation: string | null = null;
  
  if (location) {
    pitch = Number(location.pitch.toFixed(2))
    yaw = Number(location.yaw.toFixed(2))
    x = Number(location.x.toFixed(2))
    y = Number(location.y.toFixed(2))
    z = Number(location.z.toFixed(2))
    customLocation = location.customLocation ?? "Дикий мир"
    world = location.world
  }

  return (
    <div className="absolute top-4 right-4 z-[5] bg-black/40 px-4 py-1 rounded-md w-fit">
      {location && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <div className="flex flex-col font-[Minecraft] items-center justify-center w-full gap-4 h-full">
              <Typography variant="dialogTitle">
                Сервер Bisquite
              </Typography>
              <div className="flex flex-col gap-2 w-full p-2">
                <Typography>
                  Мир: {world}
                </Typography>
                <Typography>
                  Локация: {customLocation}
                </Typography>
                <Typography>
                  Координаты: {x} / {y} / {z}
                </Typography>
                <Typography>
                  Предварительно {getPlayerDirection(pitch!, yaw!)}
                </Typography>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div>
        {location && (
          <>
            <div className="flex items-center gap-2 w-fit">
              <Typography className="text-white font-[Minecraft]">
                прямо сейчас в игре
              </Typography>
              <div
                onClick={() => setOpen(true)}
                className="cursor-pointer inline-flex w-fit items-center
                     bg-shark-50 rounded-lg justify-center px-1 py-[0.5px]"
              >
                <span className="ml-[2px] text-[14px] text-shark-950 font-[Minecraft] self-end">
                  что?
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export const UserCover = ({
  nickname: requestedUserNickname
}: UserCoverProps) => {
  const { data: requestedUser } = requestedUserQuery(requestedUserNickname);
  const { data: { inView } } = coverQuery();

  if (!requestedUser) return null;

  const { donate, preferences, nickname, cover_image } = requestedUser

  const preferOutline = preferences?.cover_outline_visible ?? false;
  const coverOutline = donate && preferOutline ? donate : "default";

  const backgroundImage = cover_image ? `url(${cover_image})` : "";
  const backgroundColor = cover_image ? "transparent" : "gray";
  const imageHeight = inView ? 168 : 76;

  return (
    <CoverArea
      variant={inView ? "full" : "compact"}
      backgroundColor={backgroundColor}
      outline={coverOutline}
      style={{ backgroundImage }}
    >
      {!cover_image && <UserCoverWatermark />}
      <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
      <div className="flex flex-col gap-y-2 lg:flex-row gap-x-6 z-[4] relative items-center lg:items-start">
        <Suspense fallback={<Skeleton className={`w-[${imageHeight}px] h-[${imageHeight}px]`} />}>
          <div className={`lg:hidden flex w-[120px] h-[120px]`}>
            <Avatar
              variant="page"
              propHeight={imageHeight}
              propWidth={imageHeight}
              withStatus={true}
              nickname={nickname}
            />
          </div>
          <div className={`hidden lg:flex w-[${imageHeight}px] h-[${imageHeight}px]`}>
            <Avatar
              variant="page"
              propHeight={imageHeight}
              propWidth={imageHeight}
              withStatus={true}
              nickname={nickname}
            />
          </div>
        </Suspense>
        <UserCoverMainInfo nickname={nickname} />
      </div>
      <UserStatusEvent nickname={nickname} />
      <UserCoverPanel requestedNickname={nickname} variant={inView ? "end" : "default"} />
    </CoverArea>
  );
};