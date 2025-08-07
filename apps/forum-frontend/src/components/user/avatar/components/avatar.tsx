import { HTMLAttributes, lazy, Suspense, useState } from 'react';
import { reatomComponent } from '@reatom/npm-react';

const AvatarUserStatus = lazy(() => import("./avatar-user-status.tsx").then(m => ({ default: m.AvatarUserStatus })))

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  nickname: string;
  url: string | null
} & Partial<{
  withStatus: boolean,
  propHeight: number;
  propWidth: number;
  rounded: "default" | "medium"
}>

type AvatarImage = Omit<AvatarProps, "withStatus">

export const Avatar = reatomComponent<AvatarProps>(({
  ctx, url, children, withStatus, nickname, propWidth, propHeight, rounded = "default", ...props
}) => {
  return (
    <>
      <div
        data-rounded={rounded}
        className="data-[rounded=default]:rounded-md data-[rounded=medium]:rounded-md relative border border-shark-700/20"
        {...props}
      >
        <AvatarImage url={url} propHeight={propHeight} propWidth={propWidth} rounded={rounded} nickname={nickname} />
        {withStatus && (
          <Suspense>
            <AvatarUserStatus nickname={nickname} />
          </Suspense>
        )}
      </div>
    </>
  )
}, "Avatar")

const EmptyAvatar = ({ 
  propHeight, propWidth, nickname 
}: Pick<AvatarImage, "propHeight" | "propWidth" | "nickname">) => {
  return (
    <div
      className={`flex select-none items-center rounded-lg overflow-hidden bg-shark-700 justify-center`}
      style={{
        maxHeight: `${propHeight}px`,
        maxWidth: `${propWidth}px`,
        height: `${propHeight}px`,
        width: `${propWidth}px`,
        minHeight: `${propHeight}px`,
        minWidth: `${propWidth}px`
      }}
    >
      <div className={`flex items-center justify-center w-full h-full`}>
        <span
          data-state={(propHeight ?? 26) >= 56 ? "big" : "mini"}
          className="data-[state=mini]:text-base data-[state=big]:text-4xl uppercase font-bold text-shark-50"
        >
          {nickname[0]}
        </span>
      </div>
    </div>
  )
}

const AvatarImage = ({ propHeight, url, propWidth, nickname, rounded }: AvatarImage) => {
  const [isError, setIsError] = useState(false);

  if (!url || isError) {
    return <EmptyAvatar nickname={nickname} propHeight={propHeight} propWidth={propWidth} />
  }

  return (
    <img
      src={url}
      draggable={false}
      width={propWidth}
      height={propHeight}
      data-rounded={rounded}
      onError={e => setIsError(true)}
      className="rounded-lg object-cover aspect-square select-none data-[rounded=default]:rounded-sm"
      alt={nickname}
      title={nickname}
    />
  )
}