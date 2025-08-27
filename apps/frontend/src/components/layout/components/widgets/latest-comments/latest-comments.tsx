import { CustomLink } from "#shared/components/link"
import { Avatar } from "#components/user/components/avatar/components/avatar"
import { UserNickname } from "#components/user/components/name/nickname"
import { reatomComponent } from "@reatom/npm-react"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { latestCommentsResource } from "./latest-comments.model"
import { createIdLink } from "#lib/create-link"
import { Atom } from "@reatom/core"

export type AtomState<T extends Atom<any>> = T extends Atom<infer State> ? State : never;

export type ExtractAtomData<T extends Atom<any>> =
  AtomState<T> extends { data: infer Data } ? Data : AtomState<T>;

type CommentItemProps = NonNullable<ExtractAtomData<typeof latestCommentsResource.dataAtom>>[0]

const CommentItem = ({
  nickname, avatar, content, parent_type, title, parent_id
}: CommentItemProps) => {
  return (
    <div className="flex flex-col bg-shark-900/40 rounded-lg p-2 gap-1">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <CustomLink to={createIdLink("user", nickname)} className="h-6 max-h-6 min-h-6 aspect-square">
            <Avatar
              url={avatar}
              nickname={nickname}
              propWidth={24}
              propHeight={24}
              className="h-6 max-h-6 min-h-6 aspect-square"
            />
          </CustomLink>
          <CustomLink to={createIdLink("user", nickname)}>
            <UserNickname nickname={nickname} />
          </CustomLink>
        </div>
        <div className="flex overflow-hidden w-2/3 *:px-1 *:py-0.5 *:bg-shark-800 *:rounded-sm">
          <Typography textColor="gray" className="text-sm truncate">
            {/* @ts-ignore */}
            <CustomLink to={`/${parent_type}/${parent_id}`} className="text-shark-50">
              {title}
            </CustomLink>
          </Typography>
        </div>
      </div>
      <Typography className="text-base">
        {content}
      </Typography>
    </div>
  )
}

const LatestCommentsSkeleton = () => {
  return (
    <>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
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