import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { CoverArea } from "#components/profile/header/components/cover-area";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { reatomComponent, useUpdate } from "@reatom/npm-react";

export const userBannedAction = reatomAsync(async (ctx, target: string) => {
  return null;
}, {
  name: "userBannedAction",
}).pipe(withStatusesAtom(), withDataAtom())

const Sync = ({ target }: { target: string }) => {
  useUpdate((ctx) => userBannedAction(ctx, target), [target])
  return null;
}

export const UserBanned = reatomComponent<{ requestedUserNickname: string }>(({ ctx, requestedUserNickname }) => {
  const banDetails = ctx.spy(userBannedAction.dataAtom)

  return (
    <>
      <Sync target={requestedUserNickname} />
      {banDetails && (
        <div className="flex flex-col w-full h-full">
          <CoverArea variant="full" backgroundColor="gray" outline="default">
            <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
          </CoverArea>
          <div className="flex flex-col gap-4 justify-center items-center py-12 px-2">
            <div className="flex flex-col items-center gap-2 w-full">
              <Typography textSize="very_big" textColor="shark_white">
                Пользователь {banDetails.nickname} был заблокирован за нарушение правил
                проекта.
              </Typography>
              <Typography textSize="large" textColor="gray">
                Вернется к игре {dayjs(banDetails.time).toNow()}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </>
  );
}, "UserBanned")