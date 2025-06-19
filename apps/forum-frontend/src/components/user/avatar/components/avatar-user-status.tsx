import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/src/components/tooltip";
import { Typography } from "@repo/ui/src/components/typography";
import { userStatusAction, userStatusAtom, userStatusParamAtom } from "../models/user-status.model";

const SyncUserStatus = ({ target }: { target: string }) => {
  useUpdate((ctx) => userStatusParamAtom(ctx, target), [target])
  return null;
}

export const AvatarUserStatus = reatomComponent<{ nickname: string }>(({ ctx, nickname }) => {
  const data = ctx.spy(userStatusAtom)
  
  const isOnline = data?.status === 'online' ? "online" : "offline";

  return (
    <>
      <SyncUserStatus target={nickname} />
      {!ctx.spy(userStatusAction.statusesAtom).isPending && (
        <TooltipProvider>
          <Tooltip delayDuration={1}>
            <TooltipTrigger 
              className="min-w-[18px] min-h-[18px] z-[2] absolute -bottom-2 -right-2 max-h-[24px] max-w-[20px] md:max-h-[20px] md:max-w-[20px]"
            >
              <div
                data-state={isOnline}
                className="flex rounded-full *:rounded-full bg-shark-900 p-0.5 size-[20px] items-center justify-center group"
              >
                <div className="h-full w-full group-data-[state=online]:bg-green-500 group-data-[state=offline]:bg-shark-600" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {data ? (
                <Typography>
                  {isOnline === 'online' ? `Онлайн` : data.issuedTime}
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