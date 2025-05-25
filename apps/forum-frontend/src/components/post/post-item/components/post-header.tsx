import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname";
import { Link } from "@tanstack/react-router";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { Pin } from "lucide-react";
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/src/components/tooltip";

type PostItemHeaderProps = Pick<UserPostItem, "visibility" | "isPinned" | "created_at" | "nickname">;

export const PostItemHeader = ({
  nickname, created_at: postCreatedAt, visibility, isPinned,
}: PostItemHeaderProps) => {
  const visibilityStatus = visibility === "only" ? "видно только вам" : "видно только друзьям";

  return (
    <div className="flex gap-3 items-center">
      <Link to={USER_URL + nickname}>
        <Avatar
          variant="page"
          propHeight={48}
          propWidth={48}
          nickname={nickname}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Link to={USER_URL + nickname}>
            <UserNickname nickname={nickname} className="text-base font-medium" />
          </Link>
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