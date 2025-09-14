import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/shared/constants/dayjs-instance.ts";
import { HeadArea } from "#components/profile/components/head/components/head-area";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { atom, onConnect } from "@reatom/framework";
import { usePageContext } from "vike-react/usePageContext";
import { toast } from "sonner";

export const userBannedAction = reatomAsync(async (ctx) => {
  const target = ctx.get(targetAtom)
  if (!target) throw new Error("Target is not defined");

  // todo: replace to api req
  return await ctx.schedule(() => ({ nickname: target, reason: "test", time: new Date() }))
}, {
  name: "userBannedAction",
  onReject: (_, e) => {
    if (e instanceof Error) toast.error(e.message)
  }
}).pipe(withStatusesAtom(), withDataAtom())

const targetAtom = atom<string>("", "target")

const Sync = ({ nickname }: { nickname: string }) => {
  useUpdate((ctx) => {
    targetAtom(ctx, nickname)
  }, [nickname])

  return null;
}

onConnect(userBannedAction.dataAtom, userBannedAction)

const Details = reatomComponent(({ ctx }) => {
  const data = ctx.spy(userBannedAction.dataAtom)

  if (!data) return null;

  const { nickname, reason, time } = data;

  return (
    <div className="flex flex-col w-full h-full">
      <HeadArea backgroundColor="gray" outline="default">
        <div className="z-[2] absolute w-full h-full right-0 top-0 bottom-0 left-0 bg-black/40" />
      </HeadArea>
      <div className="flex flex-col gap-4 justify-center items-center py-12 px-2">
        <div className="flex flex-col items-center gap-2 w-full">
          <Typography textSize="very_big" textColor="shark_white">
            Пользователь {nickname} был заблокирован за нарушение правил
            проекта.
          </Typography>
          <Typography textSize="large" textColor="gray">
            Вернется к игре {dayjs(time).toNow()}
          </Typography>
        </div>
      </div>
    </div>
  )
}, "Details")

export const UserBanned = ({ nickname }: { nickname: string }) => {
  return (
    <>
      <Sync nickname={nickname} />
      <Details />
    </>
  );
}