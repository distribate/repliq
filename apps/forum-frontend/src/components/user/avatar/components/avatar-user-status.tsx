import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { userStatusAction, userStatusAtom, userStatusParamAtom } from "@repo/lib/queries/user-status.model";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/src/components/tooltip";
import { Typography } from "@repo/ui/src/components/typography";
import ExpActive from '@repo/assets/images/minecraft/exp-active.webp';
import ExpNoActive from '@repo/assets/images/minecraft/exp-noactive.webp';

const SyncUserStatus = ({ target }: { target: string }) => {
  useUpdate((ctx) => userStatusParamAtom(ctx, target), [target])
  return null;
}

export const AvatarUserStatus = reatomComponent<{ nickname: string }>(({ ctx, nickname }) => {
  const userStatus = ctx.spy(userStatusAtom)
  const isOnline = userStatus?.status === 'online';

  return (
    <>
      <SyncUserStatus target={nickname} />
      <TooltipProvider>
        <Tooltip delayDuration={1}>
          <TooltipTrigger className="min-w-[18px] min-h-[18px] absolute -bottom-2 -right-2 max-h-[26px] max-w-[26px] md:max-h-[32px] md:max-w-[32px]">
            {!ctx.spy(userStatusAction.statusesAtom).isPending && (
              <img
                src={isOnline ? ExpActive : ExpNoActive}
                alt=""
                loading="lazy"
                width={32}
                height={32}
              />
            )}
          </TooltipTrigger>
          <TooltipContent side="bottom" className="flex flex-col gap-1">
            {userStatus ? (
              <Typography>{isOnline ? `Онлайн` : userStatus.issuedTime}</Typography>
            ) : (
              <Typography>Был давно</Typography>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}, "AvatarUserStatus")