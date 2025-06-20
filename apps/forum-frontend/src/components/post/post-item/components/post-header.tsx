import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/src/components/tooltip";
import { CustomLink } from "#components/shared/link";
import { createIdLink } from "@repo/lib/utils/create-link";
import { IconPin } from "@tabler/icons-react";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { UserDetailed } from "@repo/types/entities/user-type";

type PostItemHeaderProps = Pick<UserPostItem, "visibility" | "isPinned" | "created_at" | "nickname">
  & Pick<UserDetailed, "avatar">

const VISIBILITY_STATUS: Record<string, string> = {
  only: "видно только вам",
  friends: "видно только друзьям",
  all: ""
}

export const PostItemHeader = ({
  nickname, created_at, visibility, isPinned, avatar
}: PostItemHeaderProps) => {
  return (
    <div className="flex gap-3 items-center">
      <CustomLink to={createIdLink("user", nickname)}>
        <Avatar url={avatar} propHeight={48} propWidth={48} nickname={nickname} />
      </CustomLink>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <CustomLink to={createIdLink("user", nickname)}>
            <UserNickname nickname={nickname} className="text-lg font-medium" />
          </CustomLink>
          {visibility !== "all" && (
            <Typography textSize="small" textColor="gray" className="self-end">
              {VISIBILITY_STATUS[visibility]}
            </Typography>
          )}
          {isPinned && <IconPin title="Pinned" size={22} className="text-gold-500" />}
        </div>
        <TooltipProvider delayDuration={1}>
          <Tooltip>
            <TooltipTrigger className="w-fit cursor-default">
              <Typography className="text-shark-300 text-sm">
                {dayjs(created_at).fromNow()}
              </Typography>
            </TooltipTrigger>
            <TooltipContent side="right">
              <Typography className="text-shark-300 text-base">
                {dayjs(created_at).format("DD.MM.YYYY HH:mm")}
              </Typography>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};