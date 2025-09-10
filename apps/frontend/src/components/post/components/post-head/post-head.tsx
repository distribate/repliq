import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/components/avatar/components/avatar";
import { UserNickname } from "#components/user/components/name/nickname";
import dayjs from "@repo/shared/constants/dayjs-instance.ts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/src/components/tooltip";
import { CustomLink } from "#shared/components/link";
import { createIdLink } from "#shared/helpers/create-link";
import { IconPin } from "@tabler/icons-react";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { UserDetailed } from "@repo/types/entities/user-type";

type PostItemHeaderProps = Pick<UserPostItem, "visibility" | "isPinned" | "created_at" | "nickname">
  & Pick<UserDetailed, "avatar">

const VISIBILITY_STATUS: Record<string, string> = {
  only: "видно только вам",
  friends: "видно только друзьям",
  all: ""
} as const;

export const PostItemHeader = ({
  nickname, created_at, visibility, isPinned, avatar
}: PostItemHeaderProps) => {
  return (
    <div className="flex gap-3 items-center">
      <CustomLink to={createIdLink("user", nickname)}>
        <Avatar
          url={avatar}
          propHeight={48}
          propWidth={48}
          nickname={nickname}
          className="min-h-[48px] h-[48px] max-h-[48px] aspect-square"
        />
      </CustomLink>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <CustomLink to={createIdLink("user", nickname)}>
            <UserNickname nickname={nickname} className="text-lg" />
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
            <TooltipContent>
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