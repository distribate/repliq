import { CoverArea } from "@repo/ui/src/components/cover-area.tsx";
import { UserCoverMainInfo } from "./cover-main-info.tsx";
import { UserCoverPanel } from "./cover-panel.tsx";
import { COVER_QUERY_KEY, CoverQuery, coverQuery } from "#components/profile/header/queries/cover-query.ts";
import { requestedUserQuery } from "@repo/lib/queries/requested-user-query.ts";
import { UserCoverWatermark } from "./cover-watermark.tsx";
import { lazy, Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { userGameStatusQuery } from "#components/user/avatar/queries/user-game-status-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUser } from "@repo/lib/helpers/get-user.ts";

type UserCoverProps = {
  nickname: string
};

const UserLocation = lazy(() => import("#components/user/location/user-location.tsx")
  .then(m => ({ default: m.UserLocation }))
)

export const UserCover = ({
  nickname: requestedUserNickname
}: UserCoverProps) => {
  const qc = useQueryClient()
  const currentUser = getUser()
  const { data: requestedUser } = requestedUserQuery(requestedUserNickname);
  const { data: { inView } } = coverQuery();
  const { data: gameStatus } = userGameStatusQuery(requestedUserNickname, true)

  if (!requestedUser) return null;

  const { donate, preferences, nickname, cover_image } = requestedUser

  const preferOutline = preferences?.cover_outline_visible ?? false;
  const coverOutline = donate && preferOutline ? donate : "default";

  const backgroundImage = cover_image ? `url(${cover_image})` : "";
  const backgroundColor = cover_image ? "transparent" : "gray";
  const imageHeight = inView ? 168 : 76;

  const handleOpen = () => {
    const showLocation = preferences.show_game_location

    if (!showLocation && currentUser.nickname !== requestedUserNickname) {
      return toast.warning("Игрок не показывает свое игровое местоположение")
    }

    qc.setQueryData(COVER_QUERY_KEY, (prev: CoverQuery) =>
      ({ ...prev, location: { opened: true } })
    )
  }

  const isOnlineInGame = gameStatus && gameStatus.type === 'online'

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
            <Avatar variant="page" propHeight={imageHeight} propWidth={imageHeight} withStatus={true} nickname={nickname} />
          </div>
          <div className={`hidden lg:flex w-[${imageHeight}px] h-[${imageHeight}px]`}>
            <Avatar variant="page" propHeight={imageHeight} propWidth={imageHeight} withStatus={true} nickname={nickname} />
          </div>
        </Suspense>
        <UserCoverMainInfo nickname={nickname} />
      </div>
      {isOnlineInGame && (
        <div className="absolute top-4 font-[Minecraft] right-4 z-[5] bg-black/40 px-4 py-1 rounded-md w-fit">
          <Suspense>
            <UserLocation nickname={nickname} />
          </Suspense>
          <div className="flex items-center gap-2 w-fit">
            <Typography className="text-white">
              прямо сейчас в игре
            </Typography>
            <div
              onClick={handleOpen}
              className="inline-flex cursor-pointer w-fit items-center bg-shark-50 rounded-lg justify-center px-1 py-[0.5px]"
            >
              <span className="text-[14px] text-shark-950">что?</span>
            </div>
          </div>
        </div>
      )}
      <UserCoverPanel requestedNickname={nickname} variant={inView ? "end" : "default"} />
    </CoverArea>
  );
};