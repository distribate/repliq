import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/src/components/tooltip";
import { Typography } from "@repo/ui/src/components/typography";
import { userActivityStatusAction, userActivityStatusAtom, userActivityStatusParamAtom } from "../models/user-status.model";
import { cva } from "class-variance-authority";

const SyncUserStatus = ({ nickname }: { nickname: string }) => {
  useUpdate((ctx) => userActivityStatusParamAtom(ctx, nickname), [nickname])
  return null;
}

const statusBadgeVariant = cva(`h-full w-full rounded-full`, {
  variants: {
    variant: {
      active: "bg-green-500",
      inactive: "bg-shark-600"
    }
  }
})

export const AvatarUserStatus = reatomComponent<{
  nickname: string
}>(({ ctx, nickname }) => {
  const data = ctx.spy(userActivityStatusAtom)
  const isOnline = data?.status === 'online';
  const variant = isOnline ? "active" : "inactive";

  return (
    <>
      <SyncUserStatus nickname={nickname} />
      {!ctx.spy(userActivityStatusAction.statusesAtom).isPending && (
        <TooltipProvider>
          <Tooltip delayDuration={1}>
            <TooltipTrigger className="absolute -bottom-2 -right-2 z-[2] h-4 min-h-4 max-h-4 sm:h-4 sm:min-h-4 sm:max-h-4">
              <div className="flex rounded-full bg-shark-800 p-[1px] size-4 items-center justify-center group">
                <div className={statusBadgeVariant({ variant })} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {data ? (
                <Typography>
                  {isOnline ? `Онлайн` : data.issuedTime}
                </Typography>
              ) : (
                <Typography>Был давно</Typography>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  )
}, "AvatarUserStatus")