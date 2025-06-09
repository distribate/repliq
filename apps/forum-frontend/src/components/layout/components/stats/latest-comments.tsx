import { CustomLink } from "#components/shared/link"
import { Avatar } from "#components/user/avatar/components/avatar"
import { UserNickname } from "#components/user/name/nickname"
import { reatomComponent } from "@reatom/npm-react"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { latestCommentsResource } from "./latest-comments.model"
import { createIdLink } from "@repo/lib/utils/create-link"

export const LatestComments = reatomComponent(({ ctx }) => {
  const comments = ctx.spy(latestCommentsResource.dataAtom)

  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography textSize="big" textColor="shark_white" className="font-semibold">
        Последние комментарии
      </Typography>
      <div className="flex flex-col w-full h-full gap-2">
        {ctx.spy(latestCommentsResource.statusesAtom).isPending && (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        )}
        {comments && comments.map(({ content, parent_id, parent_type, title, user_nickname }, idx) => (
          <div key={idx} className="flex flex-col bg-shark-700/60 rounded-md p-2 gap-1">
            <div className="flex items-center gap-2">
              <CustomLink to={createIdLink("user", user_nickname)}>
                <Avatar nickname={user_nickname} propWidth={24} propHeight={24} />
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
        ))}
      </div>
    </div>
  )
}, "LatestComments")