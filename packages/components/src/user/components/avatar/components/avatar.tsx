'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, HTMLAttributes } from 'react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { userAvatarQuery } from '../queries/avatar-query.ts';
import { ImageWrapper } from '../../../../wrappers/image-wrapper.tsx';
import { TooltipWrapper } from '../../../../wrappers/tooltip-wrapper.tsx';
import ExpActive from '@repo/assets/images/minecraft/exp-active.webp';
import ExpNoActive from '@repo/assets/images/minecraft/exp-noactive.webp';

const avatarVariants = cva('relative rounded-sm ', {
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
  withBadge?: {
    active?: boolean
  },
  propHeight?: number,
  propWidth?: number,
  nickname: string
}

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants>, Avatar {
}

export const Avatar = forwardRef<
  HTMLDivElement, AvatarProps
>(({ className, children, withBadge, variant, shadow, propWidth, propHeight, border, nickname, ...props },
  ref,
) => {
  const { data: avatarUrl } = userAvatarQuery(nickname);

  const activeImage = withBadge?.active ? ExpActive.src : ExpNoActive.src;
  
  return (
    <div className={avatarVariants(({ variant, shadow, border, className }))} ref={ref}{...props}>
      <ImageWrapper
        propSrc={avatarUrl!}
        width={propWidth}
        height={propHeight}
        className="rounded-sm"
        loading="eager"
        propAlt=""
      />
      {withBadge && (
        <TooltipWrapper
          properties={{
            triggerClassname: 'rounded-full min-w-[18px] min-h-[18px] absolute -bottom-2 -right-2 max-h-[32px] max-w-[32px]',
            sideAlign: 'bottom',
          }}
          trigger={
            <ImageWrapper
              propSrc={activeImage}
              propAlt=""
              width={32}
              height={32}
            />
          }
          content={
            <Typography>
              {withBadge.active ? (
                `Сейчас в сети`
              ) : (
                `Оффлайн. Был в 14:32`
              )}
            </Typography>
          }
        />
      )}
    </div>
  );
});