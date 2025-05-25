import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, HTMLAttributes } from 'react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { userAvatarQuery } from '../queries/avatar-query.ts';
import ExpActive from '@repo/assets/images/minecraft/exp-active.webp';
import ExpNoActive from '@repo/assets/images/minecraft/exp-noactive.webp';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui/src/components/tooltip.tsx';
import { userStatusQuery } from '../queries/user-status-query.ts';

const avatarVariants = cva('relative rounded-lg border border-shark-600/20', {
  variants: {
    variant: {
      default: 'max-w-[68px] max-h-[68px]',
      page: 'max-w-[256px] max-h-[256px]',
    },
    border: {
      withBorder: 'border-[1px] border-shark-300/30',
    },
    shadow: {
      default: 'shadow-md shadow-black/70',
    },
  },
});

interface Avatar {
  withStatus?: boolean,
  propHeight?: number;
  propWidth?: number;
  nickname: string;
}

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof avatarVariants>,
  Avatar {
}

const AvatarUserStatus = ({ nickname }: { nickname: string }) => {
  const { data: userStatus, isLoading } = userStatusQuery(nickname)

  const isOnline = userStatus?.status === 'online';
  const issuedTime = userStatus?.issuedTime

  return (
    <TooltipProvider>
      <Tooltip delayDuration={1}>
        <TooltipTrigger className="rounded-full min-w-[18px] min-h-[18px] absolute -bottom-2 -right-2 max-h-[32px] max-w-[32px]">
          {!isLoading && (
            <img
              // @ts-ignore
              src={isOnline ? ExpActive : ExpNoActive}
              alt=""
              loading="lazy"
              width={32}
              height={32}
            />
          )}
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {userStatus ? (
            <Typography>
              {isOnline ? `В сети` : issuedTime}
            </Typography>
          ) : (
            <Typography>
              Был давно
            </Typography>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({
  className, children, withStatus, variant, shadow, propWidth, propHeight, border, nickname, ...props
}, ref) => {
  const { data: avatarUrl } = userAvatarQuery(nickname);

  return (
    <div
      className={avatarVariants({ variant, shadow, border, className })}
      ref={ref}
      {...props}
    >
      <img src={avatarUrl} width={propWidth} height={propHeight} className="rounded-sm" loading="eager" alt="" />
      {withStatus && (
        <AvatarUserStatus nickname={nickname} />
      )}
    </div>
  );
});