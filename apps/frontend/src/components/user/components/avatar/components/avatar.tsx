import { HTMLAttributes, useState } from 'react';
import { reatomComponent } from '@reatom/npm-react';
import { clientOnly } from 'vike-react/clientOnly';

const AvatarUserStatus = clientOnly(() => import("./avatar-user-status.tsx").then(m => m.AvatarUserStatus))

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  nickname: string;
  url: string | null
} & Partial<{
  withStatus: boolean,
  propHeight: number;
  propWidth: number
}>

type AvatarImage = Omit<AvatarProps, "withStatus">

const EmptyAvatar = ({ nickname }: Pick<AvatarProps, "nickname">) => {
  return (
    <div
      className="flex items-center justify-center 
        rounded-lg w-full h-fit aspect-square overflow-hidden bg-shark-700 select-none"
    >
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-xl uppercase font-bold text-shark-50">
          {nickname[0]}
        </span>
      </div>
    </div>
  )
}

const AvatarImage = ({ propHeight, url, propWidth, nickname }: AvatarImage) => {
  const [isError, setIsError] = useState(false);

  if (!url || isError) {
    return <EmptyAvatar nickname={nickname} />
  }

  return (
    <img
      src={url}
      draggable={false}
      width={propWidth}
      height={propHeight}
      onError={e => setIsError(true)}
      className="rounded-lg object-cover aspect-square select-none"
      alt={nickname}
      title={nickname}
    />
  )
}

export const Avatar = reatomComponent<AvatarProps>(({
  ctx, url, children, withStatus, nickname, propWidth, propHeight, ...props
}) => {
  return (
    <div className="rounded-lg relative border border-shark-700/40" {...props}>
      <AvatarImage url={url} propHeight={propHeight} propWidth={propWidth} nickname={nickname} />
      {withStatus && <AvatarUserStatus nickname={nickname} />}
    </div>
  )
}, "Avatar")