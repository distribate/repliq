import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes, lazy, Suspense } from 'react';
import { avatarAction, avatarAtom } from '../models/avatar.model.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { reatomComponent, useUpdate } from '@reatom/npm-react';

const AvatarUserStatus = lazy(() => import("./avatar-user-status.tsx").then(m => ({ default: m.AvatarUserStatus })))

const avatarVariants = cva('relative border border-shark-600/20', {
  variants: {
    border: {
      withBorder: 'border-[1px] border-shark-300/30',
    },
    shadow: {
      default: 'shadow-md shadow-black/70',
    },
    rounded: {
      default: "rounded-lg",
      medium: "rounded-md"
    }
  },
  defaultVariants: {
    rounded: "default"
  }
});

type Avatar = Partial<{
  withStatus: boolean,
  propHeight: number;
  propWidth: number;
}> & {
  nickname: string;
}

type AvatarProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof avatarVariants> & Avatar

const SyncTarget = ({ nickname }: { nickname: string }) => {
  useUpdate((ctx) => avatarAction(ctx, nickname), [nickname])
  return null;
}

export const Avatar = reatomComponent<AvatarProps>(({
  ctx, className, children, withStatus, shadow, rounded, propWidth, propHeight, border, nickname, ...props
}) => {
  return (
    <div className={avatarVariants({ shadow, border, className })} {...props}>
      <SyncTarget nickname={nickname} />
      <AvatarImage propHeight={propHeight} propWidth={propWidth} rounded={rounded} nickname={nickname} />
      {withStatus && (
        <Suspense>
          <AvatarUserStatus nickname={nickname} />
        </Suspense>
      )}
    </div>
  )
}, "Avatar")

const AvatarImage = reatomComponent<Pick<AvatarProps, "rounded" | "propWidth" | "propHeight" | "nickname">>(({
  ctx, rounded, propWidth, propHeight, nickname
}) => {
  const { url, isLoading } = ctx.spy(avatarAtom(nickname))

  if (isLoading) {
    return <Skeleton style={{ height: propHeight, width: propWidth }} />
  }

  return (
    <img
      src={url}
      width={propWidth}
      height={propHeight}
      data-rounded={rounded}
      className="rounded-lg data-[rounded=default]:rounded-sm"
      alt=""
    />
  );
}, "AvatarImage")