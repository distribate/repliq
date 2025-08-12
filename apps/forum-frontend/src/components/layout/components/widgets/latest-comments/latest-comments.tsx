import { CustomLink } from "#components/shared/link"
import { Avatar } from "#components/user/avatar/components/avatar"
import { UserNickname } from "#components/user/name/nickname"
import { reatomComponent } from "@reatom/npm-react"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { latestCommentsResource } from "./latest-comments.model"
import { createIdLink } from "@repo/lib/utils/create-link"
import { Atom } from "@reatom/core"

export type AtomState<T extends Atom<any>> = T extends Atom<infer State> ? State : never;

export type ExtractAtomData<T extends Atom<any>> =
  AtomState<T> extends { data: infer Data } ? Data : AtomState<T>;

type CommentItemProps = NonNullable<ExtractAtomData<typeof latestCommentsResource.dataAtom>>[0]

const CommentItem = ({
  user_nickname, avatar, content, parent_type, title, parent_id
}: CommentItemProps) => {
  return (
    <div className="flex flex-col bg-shark-700/60 rounded-md p-2 gap-1">
      <div className="flex items-center gap-2">
        <CustomLink to={createIdLink("user", user_nickname)}>
          <Avatar url={avatar} nickname={user_nickname} propWidth={24} propHeight={24} />
        </CustomLink>
        <CustomLink to={createIdLink("user", user_nickname)}>
          <UserNickname nickname={user_nickname} />
        </CustomLink>
      </div>
      <Typography className="text-[16px]">
        {content}
      </Typography>
      <div className="flex w-full items-center gap-1">
        <Typography className="text-[14px]" textColor="gray">
          к треду
        </Typography>
        <div className="flex overflow-hidden w-2/3 *:px-1 *:py-0.5 *:bg-shark-700 *:rounded-md">
          <Typography textColor="gray" className="text-[14px] truncate">
            {/* @ts-ignore */}
            <CustomLink to={`/${parent_type}/${parent_id}`} className="text-shark-50">{title}</CustomLink>
          </Typography>
        </div>
      </div>
    </div>
  )
}

const LatestCommentsSkeleton = () => {
  return (
    <>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </>
  )
}

export const LatestComments = reatomComponent(({ ctx }) => {
  const comments = ctx.spy(latestCommentsResource.dataAtom)
  const isExist = comments && comments.length >= 1

  return (
    <div className="flex flex-col gap-4 w-full rounded-lg ">
      <Typography textSize="big" textColor="shark_white" className="font-semibold">
        Последние комментарии
      </Typography>
      <div className="flex flex-col w-full h-full gap-2">
        {ctx.spy(latestCommentsResource.statusesAtom).isPending && <LatestCommentsSkeleton />}
        {isExist && comments.map((item, idx) => (
          <CommentItem key={idx} {...item} />
        ))}
      </div>
    </div>
  )
}, "LatestComments")