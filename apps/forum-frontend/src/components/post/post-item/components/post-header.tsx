import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { Pin } from "lucide-react";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/src/components/tooltip";
import { CustomLink } from "#components/shared/link";
import { createIdLink } from "@repo/lib/utils/create-link";

type PostItemHeaderProps = Pick<UserPostItem, "visibility" | "isPinned" | "created_at" | "nickname"> & {
  avatar: string | null
};

export const PostItemHeader = ({
  nickname, created_at: postCreatedAt, visibility, isPinned, avatar
}: PostItemHeaderProps) => {
  const visibilityStatus = visibility === "only" ? "видно только вам" : "видно только друзьям";

  return (
    <div className="flex gap-3 items-center">
      <CustomLink to={createIdLink("user", nickname)}>
        <Avatar
          url={avatar}
          propHeight={48}
          propWidth={48}
          nickname={nickname}
        />
      </CustomLink>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <CustomLink to={createIdLink("user", nickname)}>
            <UserNickname nickname={nickname} className="text-base font-medium" />
          </CustomLink>
          {visibility !== "all" && (
            <Typography textSize="small" textColor="gray" className="self-end">
              {visibilityStatus}
            </Typography>
          )}
          {isPinned && <Pin size={18} className="text-gold-500" />}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-fit cursor-default">
              <Typography className="text-shark-200 text-sm">
                {dayjs(postCreatedAt).fromNow()}
              </Typography>
            </TooltipTrigger>
            <TooltipContent side="right">
              <Typography className="text-shark-300 text-base">
                {dayjs(postCreatedAt).format("DD.MM.YYYY HH:mm")}
              </Typography>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};